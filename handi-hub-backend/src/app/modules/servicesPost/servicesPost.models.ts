import { model, Schema, Types } from 'mongoose';
import { IServicesPost, IServicesPostModules } from './servicesPost.interface';

const MapSchema = new Schema({
  coordinates: { type: [Number], required: true },
  type: { type: String, default: 'Point' },
});

const servicesPostSchema = new Schema<IServicesPost>(
  {
    banner: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: MapSchema, required: true },
    description: { type: String, required: true },
    address: { type: String, default:null},
    serviceProvider: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
    services: [
      {
        type: Types.ObjectId,
        ref: 'Service',
        required: true,
      },
    ],
    tags: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
); 

const ServicesPost = model<IServicesPost, IServicesPostModules>(
  'ServicesPost',
  servicesPostSchema,
);
export default ServicesPost;
