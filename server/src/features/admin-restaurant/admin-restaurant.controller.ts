import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UploadedFiles,
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
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CreateMenuItemDto, VariantDto } from './dtos/create-menu-item.dto';
import {
  OpeningHoursDto,
  PublishRestaurantDto,
} from './dtos/publish-restaurant.dto';

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

  @Post('publish')
  @HttpCode(201)
  @UseGuards(JwtRestaurantGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 },
    ]),
  )
  async publishRestaurant(
    @Body() publishRestaurantDto: PublishRestaurantDto,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    },
    @Restaurant() restaurant: IRestaurant,
  ) {
    const logo = files.logo?.[0];
    const coverImage = files.coverImage?.[0];

    return await this.adminRestaurantService.publishRestaurant(
      publishRestaurantDto,
      logo,
      coverImage,
      restaurant,
    );
  }

  @Put('update-opening-hours')
  @HttpCode(200)
  @UseGuards(JwtRestaurantGuard)
  async updateRestaurantOpeningHours(
    @Body() updateRestaurantOpeningHoursDto: OpeningHoursDto,
    @Restaurant() restaurant: IRestaurant,
  ) {
    return await this.adminRestaurantService.updateRestaurantOpeningHours(
      updateRestaurantOpeningHoursDto,
      restaurant,
    );
  }

  // MENU ==>

  @Post('create-category')
  @HttpCode(201)
  @UseGuards(JwtRestaurantGuard)
  async createCategory(
    @Body() body: { name: string },
    @Restaurant() restaurant: IRestaurant,
  ) {
    const { name } = body;

    return await this.adminRestaurantService.createCategory(name, restaurant);
  }

  @Get('get-categories')
  @HttpCode(200)
  @UseGuards(JwtRestaurantGuard)
  async getRestaurantCategories(@Restaurant() restaurant: IRestaurant) {
    return await this.adminRestaurantService.getRestaurantCategories(
      restaurant,
    );
  }

  @Put('edit-category/:categoryId')
  @HttpCode(200)
  @UseGuards(JwtRestaurantGuard)
  async editCategory(
    @Param('categoryId') categoryId: string,
    @Body() body: { name: string },
    @Restaurant() restaurant: IRestaurant,
  ) {
    const { name } = body;

    return await this.adminRestaurantService.editCategory(
      name,
      categoryId,
      restaurant,
    );
  }

  @Delete('delete-category/:categoryId')
  @HttpCode(201)
  @UseGuards(JwtRestaurantGuard)
  async deleteCategory(
    @Param('categoryId') categoryId: string,
    @Restaurant() restaurant: IRestaurant,
  ) {
    return await this.adminRestaurantService.deleteCategory(
      categoryId,
      restaurant,
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

  @Put('edit-variant/:variantId')
  @HttpCode(200)
  @UseGuards(JwtRestaurantGuard)
  async editItemVariant(
    @Body() variantDto: VariantDto,
    @Param('variantId') variantId: string,
    @Restaurant() restaurant: IRestaurant,
  ) {
    return await this.adminRestaurantService.editItemVariant(
      variantId,
      variantDto,
      restaurant,
    );
  }

  @Delete('delete-variant/:variantId')
  @HttpCode(201)
  @UseGuards(JwtRestaurantGuard)
  async deleteVariant(
    @Param('variantId') variantId: string,
    @Restaurant() restaurant: IRestaurant,
  ) {
    return await this.adminRestaurantService.deleteVariant(
      variantId,
      restaurant,
    );
  }
}
