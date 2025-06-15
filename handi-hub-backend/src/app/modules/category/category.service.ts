/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { ICategory } from './category.interface';
import Category from './category.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError'; 
import Service from '../service/service.models';

const createCategory = async (payload: ICategory) => {
  const result = await Category.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create category');
  }
  return result;
};

const getAllCategories = async (query: Record<string, any>) => {
  const newCategory = [];

  const categoriesModel = new QueryBuilder(
    Category.find({ isDeleted: false }),
    query,
  )
    .search(['name'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await categoriesModel.modelQuery;
  const meta = await categoriesModel.countTotal();
  for (const category of data) {
    const services = await Service.find({ category: category?._id });
    newCategory.push({ services, ...category.toObject() });
  }
  return {
    data: newCategory,
    meta,
  };
};

const getCategoryById = async (id: string) => {
  const result = await Category.findById(id);
  if (!result || result?.isDeleted) {
    throw new Error('Category not found');
  }
  return result;
};

const updateCategory = async (id: string, payload: Partial<ICategory>) => {
  const result = await Category.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Failed to update category');
  }
  return result;
};

const deleteCategory = async (id: string) => {
  const result = await Category.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus?.BAD_REQUEST, 'Failed to delete category');
  }

  // if (result.banner) {
  //  await deleteFromS3(`images/category/${result?.name}`);
  // }

  return result;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
