import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/schemas/cart.schema';
import { Restaurant, RestaurantSchema } from 'src/schemas/restaurant.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Item, ItemSchema } from 'src/schemas/item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: User.name, schema: UserSchema },
      { name: Item.name, schema: ItemSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
