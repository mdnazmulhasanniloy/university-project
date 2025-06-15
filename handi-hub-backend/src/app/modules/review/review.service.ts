/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import Review from './review.models';
import { IReview } from './review.interface';
import QueryBuilder from '../../builder/QueryBuilder';
// import Product from '../product/product.models';
// import { calculateAverageRatingForProduct } from '../favoriteItem/favoriteItem.utils';
import { User } from '../user/user.models';
import { calculateReview } from './review.utils';
import mongoose, { PipelineStage, Types } from 'mongoose';
import Contract from '../contract/contract.models';

export const createReview = async (payload: IReview) => {
  const session = await mongoose.startSession(); // Start a session
  session.startTransaction();

  try {
    const isContractHave = await Contract.findById(payload?.contract).session(
      session,
    );

    if (!isContractHave) {
      throw new AppError(httpStatus.NOT_FOUND, 'Contract Not Found!');
    }

    // Step 0: Validate the payload and check if the service provider exists
    if (isContractHave?.isReview) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'This contract has already reviewed',
      );
    }

    // Step 1: Find the service provider
    const serviceProvider = await User.findById(
      payload?.serviceProvider,
    ).session(session);
    if (!serviceProvider) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid service provider');
    }

    // Step 2: Create the review
    const result = await Review.create([payload], { session });
    if (!result || result.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Review creation failed');
    }

    // Step 3: Calculate the new average rating
    const calculation = await calculateReview(payload);

    // Step 4: Update the service provider with the new average rating and review
    await User.findByIdAndUpdate(
      payload?.serviceProvider,
      {
        //@ts-ignore
        avgRating: calculation?.avgRating,
        $addToSet: { reviews: result[0]._id },
      },
      { new: true, timestamps: false, session }, // Include session in the update
    );

    // Step 5: Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (error) {
    // Step 6: Rollback the transaction on failure
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// const createReview = async (payload: IReview) => {
//   const serviceProvider = await User.findById(payload?.serviceProvider);
//   if (!serviceProvider) {
//     throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid service provider');
//   }
//   const result = await Review.create(payload);
//   if (!result) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Review creation failed');
//   }
//   const review = await calculateReview(payload?.serviceProvider);
//   console.log(review);
//   await User.findByIdAndUpdate(
//     payload?.serviceProvider,
//     {
//       //@ts-ignore
//       avgRating: review?.avgRating,
//       $addToSet: { reviews: result?._id },
//     },
//     { new: true, timestamps: false },
//   );

//   return result;
// };

// Get all reviews
const getAllReview = async (query: Record<string, any>) => {
  const reviewModel = new QueryBuilder(
    Review.find().populate(['user', 'serviceProvider']),
    query,
  )
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await reviewModel.modelQuery;
  const meta = await reviewModel.countTotal();
  return {
    data,
    meta,
  };
};

// Get review by ID
const getReviewById = async (id: string) => {
  const result = await Review.findById(id).populate([
    'user',
    'serviceProvider',
  ]);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Oops! Review not found');
  }
  return result;
};

// Update review
const updateReview = async (id: string, payload: Partial<IReview>) => {
  const result = await Review.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review update failed');
  }

  // const reviews = await calculateAverageRatingForProduct(result?.product);
  // await User.findByIdAndUpdate(
  //   payload?.product,
  //   // { avgRating: reviews },
  //   { new: true, timestamps: false },
  // );

  return result;
};

// Delete review
const deleteReview = async (id: string) => {
  const result = await Review.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Review deletion failed');
  }

  return result;
};

const reviewFlow = async (userId: string) => {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        serviceProvider: new Types.ObjectId(userId), // Filter reviews for the given service provider
      },
    },
    {
      $group: {
        _id: '$rating', // Group by rating
        count: { $sum: 1 }, // Count the number of reviews per rating
      },
    },
    {
      $sort: { _id: -1 }, // Sort ratings in descending order (5 to 1)
    },
    {
      $facet: {
        ratingDistribution: [
          {
            $bucket: {
              groupBy: '$_id', // Group by rating
              boundaries: [1, 2, 3, 4, 5, 6], // Define buckets for 1 to 5 stars
              default: 'Others', // Group other unexpected ratings here (if needed)
              output: {
                count: { $sum: '$count' }, // Sum counts in each bucket
              },
            },
          },
        ],
        totalReviews: [
          {
            $group: {
              _id: null,
              total: { $sum: '$count' }, // Total number of reviews
              averageRating: { $avg: '$_id' }, // Calculate average rating
            },
          },
        ],
      },
    },
    {
      $project: {
        ratingDistribution: {
          $map: {
            input: [5, 4, 3, 2, 1], // Ensure all star ratings are included
            as: 'star',
            in: {
              star: '$$star',
              count: {
                $let: {
                  vars: {
                    matched: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$ratingDistribution',
                            as: 'rating',
                            cond: { $eq: ['$$rating._id', '$$star'] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: { $ifNull: ['$$matched.count', 0] }, // Default to 0 if not found
                },
              },
            },
          },
        },
        totalReviews: { $arrayElemAt: ['$totalReviews.total', 0] },
        averageRating: { $arrayElemAt: ['$totalReviews.averageRating', 0] },
      },
    },
  ];

  const result = await Review.aggregate(pipeline);

  if (!result || result.length === 0) {
    return {
      ratingDistribution: [
        { star: 5, count: 0 },
        { star: 4, count: 0 },
        { star: 3, count: 0 },
        { star: 2, count: 0 },
        { star: 1, count: 0 },
      ],
      totalReviews: 0,
      averageRating: 0,
    };
  }

  const { ratingDistribution, totalReviews, averageRating } = result[0];
  return {
    ratingDistribution,
    totalReviews: totalReviews || 0,
    averageRating: averageRating || 0,
  };
};

export const reviewService = {
  createReview,
  getAllReview,
  getReviewById,
  updateReview,
  deleteReview,
  reviewFlow,
};
