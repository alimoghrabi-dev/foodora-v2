import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from 'src/schemas/restaurant.schema';
import { Request } from 'express';
import { Model } from 'mongoose';

@Injectable()
export class JwtRestaurantStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {
    const jwtSecret = process.env.JWT_ACCESS_SECRET_RESTAURANT;

    if (!jwtSecret) {
      throw new Error(
        'Missing JWT_ACCESS_SECRET_RESTAURANT environment variable',
      );
    }

    super({
      jwtFromRequest: (req: Request) => {
        if (!req || !req.cookies) return null;
        return (req.cookies as Record<string, string>)[
          'Fresh_V2_Access_Token_RESTAURANT'
        ];
      },
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { sub: string }): Promise<Restaurant> {
    const restaurant = await this.restaurantModel
      .findById(payload.sub)
      .select('-password');

    if (!restaurant) {
      throw new UnauthorizedException('Restaurant no longer exists');
    }

    return restaurant;
  }
}
