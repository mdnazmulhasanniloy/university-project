import { model, Schema } from 'mongoose';
import { ICategory, ICategoryModel } from './category.interface';

const categorySchema = new Schema<ICategory>(
  {
    name: { type: 'string', required: true, unique: true },
    banner: { type: 'string', required: false },
    description: { type: String },
    isDeleted: { type: 'boolean', default: false },
  },
  {
    timestamps: true,
  },
);

const Category = model<ICategory, ICategoryModel>('Categories', categorySchema);
export default Category;
