import { Request, Response, NextFunction } from 'express';

// using for logger in main.ts, logger should be function(not class)

// ** disadvatage of function logger : could not use DI contrainer(means could not receive injection provider)
export function logger3(req: Request, res: Response, next: NextFunction) {
  console.log('Request3...');
  next();
}
