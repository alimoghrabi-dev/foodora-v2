import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AddItemToCartDto } from './dtos/add-to-cart.dto';
import { CartService } from './cart.service';
import { User } from 'decorators/user.decorator';
import { IUser } from 'types/nest';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add-item/:itemId')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async addItemToCart(
    @Body() addItemDto: AddItemToCartDto,
    @Param('itemId') itemId: string,
    @User() user: IUser,
  ) {
    const { restaurantId, quantity, selectedVariants, selectedAddons } =
      addItemDto;

    return await this.cartService.addItemToCart(
      restaurantId,
      itemId,
      user,
      quantity,
      selectedVariants,
      selectedAddons,
    );
  }

  @Patch('remove-item/:itemId')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async removeItemFromCart(
    @Param('itemId') itemId: string,
    @Body('restaurantId') restaurantId: string,
    @User() user: IUser,
  ) {
    return await this.cartService.removeItemFromCart(
      restaurantId,
      itemId,
      user,
    );
  }
}
