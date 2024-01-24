import mongoose, { Connection, Model } from 'mongoose';
import { ErrorException } from '../error-handler/error-exception';
import { ErrorCode } from '../error-handler/error-code';

let mongooseConnection: Connection | null = null;

export async function connect(): Promise<void> {
  try {
    mongoose.connection.on('connecting', () => {
      console.log(`MongoDB: connecting.`);
    });
    mongoose.connection.on('connected', () => {
      console.log('MongoDB: connected.');
    });
    mongoose.connection.on('disconnecting', () => {
      console.log('MongoDB: disconnecting.');
    });
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB: disconnected.');
    });

    if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
      const conn = await mongoose.connect('mongodb://localhost:27017/ts-tutorial', {
        // <- replace connection string if necessary
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
      });
      mongooseConnection = conn.connection;
    }
  } catch (error) {
    console.log(`Error connecting to DB`, error);
  }
}

export class MongooseMixin<T, TCreate> {
  private model: Model<T>;
  constructor(modelIn: Model<T>) {
    this.model = modelIn;
  }
  // public async findOne(): Promise<T> {}

  public async create(data: TCreate): Promise<T> {
    try {
      const user = await this.model.create(data);
      return user;
    } catch (error) {
      throw new ErrorException(ErrorCode.MongoCreateError);
    }
  }
}
