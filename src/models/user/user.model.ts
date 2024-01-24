export interface IUser {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  email: string;
  password: string;
}

export type UserCreate = Pick<IUser, '_id' | 'name' | 'email' | 'password'>;
export type UserCreateAPI = Pick<IUser, 'name' | 'email' | 'password'>;

export interface ISignInAPI {
  email: string;
  password: string;
}
