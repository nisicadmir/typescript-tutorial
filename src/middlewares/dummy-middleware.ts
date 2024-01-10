import { Response, Request, NextFunction } from 'express';

export function dummyMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log('dummy middleware');

  next();
}
