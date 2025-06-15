import { Error, Query, Schema, Types, model } from 'mongoose';
import config from '../../config';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from './user.interface';
import { Role, USER_ROLE } from './user.constants';
import generateRandomHexColor from '../../utils/generateRandomHexColor';

const MapSchema = new Schema({
  coordinates: [Number],
  type: { type: String, default: 'Point' },
});

const VerificationSchema = new Schema({
  otp: { type: Number, required: true },
  expiresAt: { type: Date, default: Date.now()  },
  status: { type: Boolean, default: false },
});

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, default: null },
    email: { type: String, required: true, unique: true, trim: true },
    phoneNumber: { type: String, default: null },
    location: { type: MapSchema },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    role: { type: String, enum: Role, default: USER_ROLE.user },
    password: { type: String },

    // Additional fields
    lastQuote: { type: String, default: null },
    aboutMe: { type: String, default: null },

    category: { type: Types.ObjectId, ref: 'Categories', default: null },

    services: [
      {
        type: Types.ObjectId,
        ref: 'Service',
      },
    ],

    finishedWork: { type: Number, default: 0 },
    pendingWork: { type: Number, default: 0 },

    totalRequests: { type: Number, default: 0 },
    totalResponses: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 },

    profile: { type: String, default: null },

    bannerColor: {
      type: String,
      default: () => generateRandomHexColor(),
    },
    stripeAccountId: {
      type: String,
      default: null,
    },
    designation: {
      type: String,
      default: null,
    },
    banner: { type: String, default: null },

    reviews: [{ type: Types.ObjectId, ref: 'Review' }],

    avgRating: { type: Number, default: 0 },

    // Authentication part
    isGoogleLogin: { type: Boolean, default: false },
    address: { type: String, default: null },
    needsPasswordChange: { type: Boolean, default: false },
    passwordChangedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    verification: { type: VerificationSchema },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  if (!user?.isGoogleLogin) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  next();
});

// set '' after saving password
userSchema.post(
  'save',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (error: Error, doc: any, next: (error?: Error) => void): void {
    doc.password = '';
    next();
  },
);

userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email: email }).select('+password');
};

userSchema.statics.IsUserExistId = async function (id: string) {
  return await User.findById(id).select('+password');
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);
