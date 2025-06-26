import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminRestaurantService } from './admin-restaurant.service';
import { RegisterRestaurantDto } from './dtos/restaurant-register.dto';
import { LoginRestaurantDto } from './dtos/restaurant-login.dto';
import { Response } from 'express';
import { IRestaurant } from 'types/nest';
import { Restaurant } from 'decorators/restaurant.decorator';
import { JwtRestaurantGuard } from 'src/guards/jwt-restaurant.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMenuItemDto } from './dtos/create-menu-item.dto';

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

  @Post('send-verification-email')
  @HttpCode(201)
  @UseGuards(JwtRestaurantGuard)
  async sendVerificationEmail(@Restaurant() restaurant: IRestaurant) {
    return await this.adminRestaurantService.sendVerificationEmailService(
      restaurant,
    );
  }

  @Post('verify-email')
  @HttpCode(201)
  @UseGuards(JwtRestaurantGuard)
  async verifyEmail(
    @Restaurant() restaurant: IRestaurant,
    @Body() body: { token: string },
  ) {
    const { token } = body;

    return await this.adminRestaurantService.verifyEmailService(
      restaurant,
      token,
    );
  }

  @Post('create-item')
  @HttpCode(201)
  @UseGuards(JwtRestaurantGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createNewMenuItem(
    @Body() createMenuItemDto: CreateMenuItemDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg|webp)',
          }),
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
            message: 'File is too large. Max file size is 10MB',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Restaurant() restaurant: IRestaurant,
  ) {
    await this.adminRestaurantService.createNewMenuItem(
      createMenuItemDto,
      file,
      restaurant,
    );

    return {
      message: 'Restaurant Menu Item Created Successfully',
    };
  }

  @Get('get-items')
  @HttpCode(200)
  @UseGuards(JwtRestaurantGuard)
  async getMenuItems(@Restaurant() restaurant: IRestaurant) {
    const menuItems =
      await this.adminRestaurantService.getMenuItems(restaurant);

    return {
      menuItems,
    };
  }
}
