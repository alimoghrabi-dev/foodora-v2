import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register.dto';
import { Response } from 'express';
import { LoginUserDto } from './dtos/login.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { User } from 'decorators/user.decorator';
import { IUser } from 'types/nest';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() regterUserDto: RegisterUserDto) {
    await this.authService.registerNewUser(regterUserDto);

    return {
      message: 'User registered successfully',
    };
  }

  @Post('login')
  @HttpCode(201)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.login(loginUserDto);

    res.cookie('Fresh_V2_Access_Token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      message: 'User Logged successfully',
    };
  }

  @Get('status')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  status(@User() user: IUser) {
    return user;
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Fresh_V2_Access_Token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return {
      message: 'User Logged out successfully',
    };
  }
}
