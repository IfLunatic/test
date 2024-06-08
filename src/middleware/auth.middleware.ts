import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    console.log('Auth Header:', authHeader); 

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token); 

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const decoded = jwt.verify(token, this.configService.get('JWT_SECRET'));
      console.log('Decoded:', decoded); 
      req.user = decoded;
      next();
    } catch (err) {
      console.error('JWT verification failed:', err); 
      throw new UnauthorizedException('Invalid token');
    }
  }
}
