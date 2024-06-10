import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const decoded: any = jwt.verify(token, this.configService.get('JWT_SECRET'));
      req.user = {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role 
      };
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
