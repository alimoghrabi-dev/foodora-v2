import { Module } from '@nestjs/common';
import { AdminRestaurantController } from './admin-restaurant.controller';
import { AdminRestaurantService } from './admin-restaurant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from 'src/schemas/restaurant.schema';
import { Item, ItemSchema } from 'src/schemas/item.schema';
import { JwtRestaurantStrategy } from 'src/strategies/admin-restaurant.strategry';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { S3Service } from 'src/lib/s3.service';
import { EmailModule } from 'src/lib/email/email.module';
import { Category, CategorySchema } from 'src/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    PassportModule,
    JwtModule.register({}),
    EmailModule,
  ],
  controllers: [AdminRestaurantController],
  providers: [AdminRestaurantService, JwtRestaurantStrategy, S3Service],
  exports: [AdminRestaurantService],
})
export class AdminRestaurantModule {}
