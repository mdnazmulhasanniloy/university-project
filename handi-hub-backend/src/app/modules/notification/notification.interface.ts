import { ObjectId } from 'mongodb';
export enum modeType {
  Contract = 'Contract',
  Payments = 'Payments',
}
export interface TNotification {
  receiver: ObjectId;
  message: string;
  description?: string;
  refference: ObjectId;
  model_type: modeType;
  date?: Date;
  read: boolean;
  isDeleted: boolean;
}
