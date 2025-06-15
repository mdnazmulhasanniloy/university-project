import { model, Schema, Types } from 'mongoose';
import { IService, IServiceModel } from './service.interface';

const subcategorySchema = new Schema<IService>(
  {
    name: { type: String, required: true, unique: true },
    banner: { type: String, required: false },
    category: { type: Types.ObjectId, ref: 'Categories', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Service = model<IService, IServiceModel>(
  'Service',
  subcategorySchema,
);
export default Service;
