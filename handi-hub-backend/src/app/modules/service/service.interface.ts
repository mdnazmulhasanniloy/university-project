import { Model, ObjectId } from 'mongoose'; 

export interface IService {
  name: string;
  category: ObjectId;
  banner: string;
  isDeleted: boolean;
}

export type IServiceModel = Model<IService, Record<string, unknown>>;
