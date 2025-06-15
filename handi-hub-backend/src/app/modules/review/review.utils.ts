import { ObjectId, Types } from 'mongoose';
import Review from './review.models';
import { IReview } from './review.interface';

interface IResReview {
  avgRating: number;
  totalReviews: number;
}

export const calculateReview = async (payload: IReview) => {
  const review = await Review.aggregate([
    {
      $match: {
        serviceProvider: new Types.ObjectId(payload?.serviceProvider),
      },
    },
    {
      $group: {
        _id: '$serviceProvider',
        avgRating: { $avg: '$rating' },
        totalRatings: { $sum: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const avgRating = Math.round(review[0]?.avgRating * 10) / 10 || 0;
  const totalReviews = review[0]?.totalReviews || 0;
  const totalRatings = review[0]?.totalRatings || 0;

  //step 4: Calculate the new average rating and total reviews
  const newTotalReview = Number(totalReviews) + 1;
  const newTotalRatings = Number(payload?.rating) + Number(totalRatings);
  const newAvgRating = newTotalRatings / newTotalReview;

  return { avgRating: newAvgRating, totalReviews: newTotalReview };
};
