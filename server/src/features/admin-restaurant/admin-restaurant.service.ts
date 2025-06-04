import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from 'src/schemas/restaurant.schema';
import { Model } from 'mongoose';
import { RegisterRestaurantDto } from './dtos/restaurant-register.dto';
import * as bcrypt from 'bcrypt';
import { LoginRestaurantDto } from './dtos/restaurant-login.dto';

@Injectable()
export class AdminRestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    private jwtService: JwtService,
  ) {}

  async registerNewRestaurant(registerRestaurantDto: RegisterRestaurantDto) {
    try {
      const { name, cuisine, email, password } = registerRestaurantDto;

      const exists = await this.restaurantModel.findOne({ email }).lean();

      if (exists) throw new ConflictException('Restaurant already exists');

      const hashed = await bcrypt.hash(password, 12);

      await this.restaurantModel.create({
        name,
        cuisine,
        email,
        password: hashed,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create restaurant');
    }
  }

  async loginRestaurant(loginRestaurantDto: LoginRestaurantDto) {
    try {
      const { email, password } = loginRestaurantDto;

      const restaurant = await this.restaurantModel.findOne({ email: email });

      if (!restaurant) throw new UnauthorizedException('Invalid credentials');

      const match = await bcrypt.compare(password, restaurant.password);

      if (!match) throw new UnauthorizedException('Invalid credentials');

      return this.generateTokens(restaurant._id as string);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to login restaurant');
    }
  }

  async generateTokens(restaurantId: string) {
    const payload = { sub: restaurantId };
    console.log(restaurantId);
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET_RESTAURANT,
      expiresIn: '7d',
    });

    return { accessToken };
  }
}
