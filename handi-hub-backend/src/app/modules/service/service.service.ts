import httpStatus from 'http-status';
import AppError from '../../error/AppError';  
import QueryBuilder from '../../builder/QueryBuilder';
import { IService } from './service.interface';
import Service from './service.models';

const createService = async (payload: IService) => {
  const result = await Service.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create services');
  }
  return result;
};

const getAllServices = async (query: Record<string, any>) => {
  const servicesModel = new QueryBuilder(
    Service.find({ isDeleted: false }).populate('category'),
    query,
  )
    .search(['name'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await servicesModel.modelQuery;
  const meta = await servicesModel.countTotal();

  return {
    data,
    meta,
  };
};

const getServiceById = async (id: string) => {
  const result = await Service.findById(id).populate('category');
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'service not found');
  }
  return result;
};

const updateService = async (
  id: string,
  payload: Partial<IService>,
) => {
  const result = await Service.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('category');
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST,'Failed to update service');
  }
  return result;
};

const deleteService = async (id: string) => {
  const result = await Service.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus?.BAD_REQUEST, 'Failed to delete subcategory');
  }

  // if (result.banner) {
  //  await deleteFromS3(`images/category/${result?.name}`);
  // }

  return result;
};

export const servicesService = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService, 
};
