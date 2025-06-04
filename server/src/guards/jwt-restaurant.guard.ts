import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRestaurantGuard extends AuthGuard('jwt-restaurant') {}
