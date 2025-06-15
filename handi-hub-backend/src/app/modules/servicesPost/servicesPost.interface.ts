import { Model, ObjectId } from 'mongoose';
import { IService } from '../service/service.interface';
import { IUser } from '../user/user.interface';
import { ICategory } from '../category/category.interface';

interface map {
  coordinates: [number];
  type: { type: string };
}

export interface IServicesPost {
  banner: string;
  title: string;
  location: map;
  description: string;
  category: string | ICategory;
  services: ObjectId[] | IService;
  address:string
  serviceProvider: ObjectId | IUser;
  tags: string[];
  isDeleted: boolean;
}

export type IServicesPostModules = Model<
  IServicesPost,
  Record<string, unknown>
>;
