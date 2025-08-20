import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { User } from 'decorators/user.decorator';
import { IUser } from 'types/nest';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('get-cuisines')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getCuisines(@Query('query') query?: string) {
    return await this.userService.getAllCuisines(query);
  }

  @Get('get-filtered-restaurants')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getFilteredRestaurants(
    @Query('sort') sort: string | null,
    @Query('quickFilter') quickFilter: string | null,
    @Query('cuisine') cuisine: string | null,
    @Query('price') price: string | null,
  ) {
    return await this.userService.getFilteredRestaurants(
      sort,
      quickFilter,
      cuisine,
      price,
    );
  }

  @Get('get-restaurant-by-id/:restaurantId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getRestaurantById(@Param('restaurantId') restaurantId: string) {
    return await this.userService.getRestaurantById(restaurantId);
  }

  @Get('get-restaurant-categories/:restaurantId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getRestaurantCategories(@Param('restaurantId') restaurantId: string) {
    return await this.userService.getRestaurantCategories(restaurantId);
  }

  @Post('get-restaurant-items/:restaurantId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getRestaurantItems(
    @Param('restaurantId') restaurantId: string,
    @Body('categoryId') categoryId: string,
  ) {
    return await this.userService.getRestaurantItems(restaurantId, categoryId);
  }

  @Patch('add-favorite/:restaurantId')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async addRestaurantToFavorites(
    @Param('restaurantId') restaurantId: string,
    @User() user: IUser,
  ) {
    return await this.userService.addRestaurantToFavorites(restaurantId, user);
  }

  @Patch('remove-favorite/:restaurantId')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async removeRestaurantFromFavorites(
    @Param('restaurantId') restaurantId: string,
    @User() user: IUser,
  ) {
    return await this.userService.removeRestaurantFromFavorites(
      restaurantId,
      user,
    );
  }

  @Get('get-favorites')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getFavoriteRestaurants(@User() user: IUser) {
    return await this.userService.getFavoriteRestaurants(user);
  }
}
