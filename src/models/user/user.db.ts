import { Model, Schema, model } from 'mongoose';
import { IUser } from './user.model';

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
