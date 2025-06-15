import { Model, ObjectId, Types } from 'mongoose';
import { IReview } from '../review/review.interface';

interface map { 
  coordinates: [number];
  type: { type: string };
}


export interface IUser {
  // [x: string]: any;
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  location: map;
  status: string;
  designation: string;
  role: string;
  password: string;

  //additional
  aboutMe: string;
  category: ObjectId;
  services: ObjectId[];
  finishedWork: Number;
  pendingWork: Number;
  lastQuote: string;
  totalRequests: number;
  totalResponses: number; 
  averageResponseTime: number;
  profile: string;
  stripeAccountId: string;
  bannerColor: string;
  banner: string;
  reviews: ObjectId[] | IReview[];
  avgRating: number;

  //auth part
  isGoogleLogin: boolean;
  address?: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  isDeleted: boolean;
  verification: {
    otp: string | number;
    expiresAt: Date;
    status: boolean;
  };
}

export interface UserModel extends Model<IUser> {
  isUserExist(email: string): Promise<IUser>;
  IsUserExistId(id: string): Promise<IUser>;
  IsUserExistUserName(userName: string): Promise<IUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
