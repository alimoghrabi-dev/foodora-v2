import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Restaurant, RestaurantSchema } from 'src/schemas/restaurant.schema';
import { Item, ItemSchema } from 'src/schemas/item.schema';
import { Category, CategorySchema } from 'src/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: Restaurant.name,
        schema: RestaurantSchema,
      },
      {
        name: Item.name,
        schema: ItemSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  exports: [MongooseModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
