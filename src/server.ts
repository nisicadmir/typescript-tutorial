import express, { NextFunction, Request, Response } from 'express';
import { dummyMiddleware } from './middlewares/dummy-middleware';
import { errorHandler } from './error-handler/error-handler';
import { ErrorException } from './error-handler/error-exception';
import { ErrorCode } from './error-handler/error-code';
import { dummyFunc } from './lib/dummy-lib';

const app = express();

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

app.get('/throw-async-error', async (req: Request, res: Response, next: NextFunction) => {
  // If not try/catch then app will be broken in express 4
  try {
    await dummyFunc();
  } catch (error) {
    next(error);
  }
  res.send('Something is broken in dummy func!');
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});
