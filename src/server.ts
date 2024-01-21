import 'reflect-metadata';

import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import { ulid } from 'ulid';

import { ErrorCode } from './error-handler/error-code';
import { ErrorException } from './error-handler/error-exception';
import { errorHandler } from './error-handler/error-handler';
import { dummyFunc } from './lib/dummy-lib';
import { dummyMiddleware } from './middlewares/dummy-middleware';
import { connect } from './models/mongoose';
import { UserModel } from './models/user/user.db';
import { UserCreate, UserCreateAPI } from './models/user/user.model';

const app = express();

// Not waiting.
connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET, POST, PUT, DELETE

app.get('/', dummyMiddleware, (req: Request, res: Response) => {
  console.log('ctx', req.body);
  res.send('Application works!');
});

app.get('/throw-unauthenticated', (req: Request, res: Response, next: NextFunction) => {
  // throw new ErrorException(ErrorCode.Unauthenticated);
  // or
  next(new ErrorException(ErrorCode.Unauthenticated));
});

app.get('/throw-unknown-error', (req: Request, res: Response, next: NextFunction) => {
  const num: any = null;
  // Node.js will throw an error because there is no length property inside num variable
  console.log(num.length);
});

app.get('/throw-async-await-error', async (req: Request, res: Response, next: NextFunction) => {
  // If not try/catch then app will be broken in express 4
  try {
    await dummyFunc();
  } catch (error) {
    next(error);
  }
  res.send('Something is broken in dummy func!');
});

app.post('/sign-up', async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body as UserCreateAPI;
  console.log('data', data);

  const userCreate: UserCreate = {
    _id: ulid(),
    name: data.name,
    email: data.email,
    password: data.password,
  };
  try {
    const user = await UserModel.create(userCreate);
    console.log('user', user);
  } catch (error) {
    console.log('error', error);
  }

  res.send('Something is broken in dummy func!');
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});
