import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import { ulid } from 'ulid';

import { ErrorCode } from './error-handler/error-code';
import { ErrorException } from './error-handler/error-exception';
import { errorHandler } from './error-handler/error-handler';
import { dummyFunc } from './lib/dummy-lib';
import { generateAuthToken } from './lib/jwt';
import { comparePassword, passwordHash } from './lib/password-hash';
import { authMiddleware } from './middlewares/auth-middleware';
import { dummyMiddleware } from './middlewares/dummy-middleware';
import { connect } from './models/mongoose';
import { UserModel, userMixin } from './models/user/user.db';
import { ISignInAPI, IUser, UserCreate, UserCreateAPI } from './models/user/user.model';

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

  const hash = passwordHash(data.password);
  const userCreate: UserCreate = {
    _id: ulid(),
    name: data.name,
    email: data.email,
    password: hash,
  };
  const user = await userMixin.create(userCreate);
  console.log('user', user);

  res.send('OK');
});

app.post('/sign-in', async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body as ISignInAPI;

  const userExists: IUser | null = await UserModel.findOne({ email: data.email });
  if (userExists === null) {
    throw new ErrorException(ErrorCode.Unauthenticated);
  }

  console.log('userExists', userExists);

  // validate the password
  const validPassword = comparePassword(data.password, userExists.password);
  if (!validPassword) {
    throw new ErrorException(ErrorCode.Unauthenticated);
  }

  const token = generateAuthToken(userExists);

  res.send({ token });
});

app.get('/protected-route', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  res.send('success');
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});
