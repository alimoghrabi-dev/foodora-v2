import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminRestaurantService } from './admin-restaurant.service';
import { RegisterRestaurantDto } from './dtos/restaurant-register.dto';
import { LoginRestaurantDto } from './dtos/restaurant-login.dto';
import { Response } from 'express';
import { IRestaurant } from 'types/nest';
import { Restaurant } from 'decorators/restaurant.decorator';
import { JwtRestaurantGuard } from 'src/guards/jwt-restaurant.guard';

@Controller('admin-restaurant')
export class AdminRestaurantController {
  constructor(private adminRestaurantService: AdminRestaurantService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() regterRestaurantDto: RegisterRestaurantDto) {
    await this.adminRestaurantService.registerNewRestaurant(
      regterRestaurantDto,
    );

    return {
      message: 'Restaurant registered successfully',
    };
  }

  @Post('login')
  @HttpCode(201)
  async login(
    @Body() loginRestaurantDto: LoginRestaurantDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } =
      await this.adminRestaurantService.loginRestaurant(loginRestaurantDto);

    res.cookie('Fresh_V2_Access_Token_RESTAURANT', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      message: 'Restaurant Logged successfully',
    };
  }

  @Get('status')
  @HttpCode(200)
  @UseGuards(JwtRestaurantGuard)
  status(@Restaurant() restaurant: IRestaurant) {
    return restaurant;
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtRestaurantGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Fresh_V2_Access_Token_RESTAURANT', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return {
      message: 'Restaurant Logged out successfully',
    };
  }
}
