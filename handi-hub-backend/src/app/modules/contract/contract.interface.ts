import { Model, ObjectId } from 'mongoose';
import { IServicesPost } from '../servicesPost/servicesPost.interface';
import { IUser } from '../user/user.interface';
interface map {
  coordinates: [number];
  type: { type: string };
}
export interface IContract {
  createdAt?: any;
  _id?: string;
  servicesPost: ObjectId | IServicesPost;
  serviceProvider: ObjectId | IUser;
  user: ObjectId | IUser;
  contractType: 'Hourly' | 'Project Based';
  status:
    | 'requested'
    | 'approved'
    | 'declined'
    | 'accepted'
    | 'completed'
    | 'cancelled';
  quote: number;
  location: map;
  isPaid: boolean;
  // durationDay: number;
  completionDate: string;
  description: string;
  address: string;
  isReview: boolean;
  trnId: string;
  images: { key: string; url: string }[];
  isDeleted: boolean;
  responseTime?: Date;
}

export type IContractModules = Model<IContract, Record<string, unknown>>;
