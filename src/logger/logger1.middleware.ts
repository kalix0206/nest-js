import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class LoggerMiddleware1 implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request1...');

    // res.send('Done');
    next();
  }
}
