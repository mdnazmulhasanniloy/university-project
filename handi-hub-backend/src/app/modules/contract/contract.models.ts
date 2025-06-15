import { model, Schema, Types } from 'mongoose';
import { IContract, IContractModules } from './contract.interface';
import { CONTRACT_STATUS, contractStatusType } from './contract.constants';

const MapSchema = new Schema({
  coordinates: [Number],
  type: { type: String, default: 'Point' },
});

const contractSchema = new Schema<IContract>(
  {
    servicesPost: {
      type: Types.ObjectId,
      ref: 'ServicesPost',
      required: true,
    },
    serviceProvider: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contractType: {
      type: String,
      enum: ['Hourly', 'Project Based'],
      required: true,
    },
    status: {
      type: String,
      enum: contractStatusType,
      default: CONTRACT_STATUS.requested,
    },
    quote: {
      type: Number,
    },
    location: MapSchema,
    // durationDay: {
    //   type: Number,
    // },
    completionDate: {
      type: String,
      required: [true, 'Completion date is required'],
    },
    trnId: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    isPaid: {
      type: 'boolean',
      default: false,
    },
    responseTime: {
      type: Date,
      default: null,
    },
    images: [
      {
        key: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],

    isDeleted: { type: 'boolean', default: false },
    isReview: { type: 'boolean', default: false },
  },
  {
    timestamps: true,
  },
);

const Contract = model<IContract, IContractModules>('Contract', contractSchema);
export default Contract;
