import httpStatus from 'http-status';
import { IServicesPost } from './servicesPost.interface';
import ServicesPost from './servicesPost.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { IFilter } from '../user/user.service';
import { IPaginationOption } from '../../interface/common.interface';
import { ServicesPostSearchableFields } from './servicesPost.constants';
import { Types, ObjectId } from 'mongoose';
import { paginationHelper } from '../../helpers/pagination.helpers';

const createServicesPost = async (payload: IServicesPost) => { 
  const result = await ServicesPost.create(payload); 
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create servicesPost');
  }
  return result;
};

const getAllServicesPost = async (
  filters: IFilter,
  paginationOptions: IPaginationOption,
) => {
  const { searchTerm, latitude, longitude, ...filtersData } = filters;
  if (filtersData?.category) {
    filtersData['category'] = new Types.ObjectId(filtersData?.category);
  }
  if (filtersData?.serviceProvider) {
    filtersData['serviceProvider'] = new Types.ObjectId(
      filtersData?.serviceProvider,
    );
  }
  // Initialize the aggregation pipeline
  const pipeline: any[] = [];

  // If latitude and longitude are provided, add $geoNear to the aggregation pipeline
  if (latitude && longitude) {
    pipeline.push({
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        key: 'location',
        maxDistance: parseFloat(5 as unknown as string) * 1609, // 5 miles to meters
        distanceField: 'dist.calculated',
        spherical: true,
      },
    });
  }

  // Add a match to exclude deleted documents
  pipeline.push({
    $match: {
      isDeleted: false,
    },
  });

  // If searchTerm is provided, add a search condition
  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: ServicesPostSearchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      },
    });
  }

  // Add custom filters (filtersData) to the aggregation pipeline
  if (Object.entries(filtersData).length) {
    Object.entries(filtersData).map(([field, value]) => {
      if (/^\[.*?\]$/.test(value)) {
        const match = value.match(/\[(.*?)\]/);
        const queryValue = match ? match[1] : value;
        pipeline.push({
          $match: {
            [field]: { $in: [new Types.ObjectId(queryValue)] },
          },
        });
        delete filtersData[field];
      }
    });

    if (Object.entries(filtersData).length) {
      pipeline.push({
        $match: {
          $and: Object.entries(filtersData).map(([field, value]) => ({
            isDeleted: false,
            [field]: value,
          })),
        },
      });
    }
  }

  // Sorting condition
  const { page, limit, skip, sort } =
    paginationHelper.calculatePagination(paginationOptions);

  if (sort) {
    const sortArray = sort.split(',').map(field => {
      const trimmedField = field.trim();
      if (trimmedField.startsWith('-')) {
        return { [trimmedField.slice(1)]: -1 };
      }
      return { [trimmedField]: 1 };
    });

    pipeline.push({ $sort: Object.assign({}, ...sortArray) });
  }

  // pipeline.push({
  //   $facet: {
  //     totalData: [{ $count: 'total' }], // Count total documents after filters
  //     paginatedData: [
  //       { $skip: skip },
  //       { $limit: limit },
  //       // Lookups
  //       {
  //         $lookup: {
  //           from: 'users',
  //           localField: 'serviceProvider',
  //           foreignField: '_id',
  //           as: 'serviceProvider',
  //           pipeline: [
  //             {
  //               $project: {
  //                 name: 1,
  //                 email: 1,
  //                 phoneNumber: 1,
  //                 profile: 1,
  //                 address:1
  //               },
  //             },
  //           ],
  //         },
  //       },
  //       { $unwind: { path: '$serviceProvider' } },
  //       // Optionally reshape serviceProvider as an object if needed
  //       {
  //         $lookup: {
  //           from: 'services',
  //           localField: 'services',
  //           foreignField: '_id',
  //           as: 'services',
  //         },
  //       },
  //     ],
  //   },
  // });

  // Execute the pipeline

  pipeline.push({
    $facet: {
      totalData: [{ $count: 'total' }], // Count total documents after filters
      paginatedData: [
        { $skip: skip },
        { $limit: limit },
        // Lookups
        {
          $lookup: {
            from: 'users',
            localField: 'serviceProvider',
            foreignField: '_id',
            as: 'serviceProvider',
            pipeline: [
              {
                $project: {
                  name: 1,
                  email: 1,
                  phoneNumber: 1,
                  profile: 1,
                  address: 1,
                },
              },
            ],
          },
        },
        // Add serviceProvider as an object (instead of an array)

        {
          $lookup: {
            from: 'services',
            localField: 'services',
            foreignField: '_id',
            as: 'services',
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },

        {
          $addFields: {
            serviceProvider: { $arrayElemAt: ['$serviceProvider', 0] }, // Extract the first (and only) item from the array
            services: { $arrayElemAt: ['$services', 0] }, // Extract the first (and only) item from the array
            category: { $arrayElemAt: ['$category', 0] }, // Extract the first (and only) item from the array
          },
        },
      ],
    },
  });

  const [result] = await ServicesPost.aggregate(pipeline);

  const total = result?.totalData?.[0]?.total || 0; // Get total count
  const data = result?.paginatedData || []; // Get paginated data

  return {
    meta: { page, limit, total },
    data,
  };
};

const getServicesPostById = async (id: string) => {
  const result = await ServicesPost.findById(id).populate([
    { path: 'serviceProvider' },
    { path: 'services' },
    { path: 'category' },
  ]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'ServicesPost not found!');
  }
  return result;
};

const updateServicesPost = async (
  id: string,
  payload: Partial<IServicesPost>,
) => { 
  
  const result = await ServicesPost.findByIdAndUpdate(id, payload, {
    new: true,
  }); 
  if (!result) {
    throw new Error('Failed to update ServicesPost');
  }
  return result;
};

const deleteServicesPost = async (id: string) => {
  const result = await ServicesPost.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete servicesPost');
  }
  return result;
};

export const servicesPostService = {
  createServicesPost,
  getAllServicesPost,
  getServicesPostById,
  updateServicesPost,
  deleteServicesPost,
};
