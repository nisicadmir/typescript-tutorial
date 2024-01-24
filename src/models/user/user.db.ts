import { Model, Schema, model } from 'mongoose';
import { IUser, UserCreate } from './user.model';
import { MongooseMixin } from '../mongoose';

const IUserSchema = new Schema<IUser>(
  {
    _id: { type: String, required: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      unique: true,
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  { collection: 'user', timestamps: true },
);

export const UserModel: Model<IUser> = model('user', IUserSchema);

export const userMixin = new MongooseMixin<IUser, UserCreate>(UserModel);
