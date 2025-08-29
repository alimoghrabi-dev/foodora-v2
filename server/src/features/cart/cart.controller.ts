import {
  Body,
  Controller,
  Delete,
  Get,
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

  @Patch('remove-item/:cartId/:itemId')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async removeItemFromCart(
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
    @User() user: IUser,
  ) {
    return await this.cartService.removeItemFromCart(cartId, itemId, user);
  }

  @Delete('delete-cart/:cartId')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async deleteCart(@Param('cartId') cartId: string, @User() user: IUser) {
    return await this.cartService.deleteCart(cartId, user);
  }

  @Patch('update-quantity/:cartId/:itemId')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async updateItemQuantity(
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
    @User() user: IUser,
  ) {
    return await this.cartService.updateItemQuantity(
      cartId,
      itemId,
      user,
      quantity,
    );
  }

  @Get('get-carts')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getUserCarts(@User() user: IUser) {
    return await this.cartService.getUserCarts(user);
  }

  @Get('get-cart/:cartId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getCartById(@User() user: IUser, @Param('cartId') cartId: string) {
    return await this.cartService.getCartById(user, cartId);
  }
}
