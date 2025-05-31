import { Module } from '@nestjs/common';
import { AdminRestaurantController } from './admin-restaurant.controller';
import { AdminRestaurantService } from './admin-restaurant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from 'src/schemas/restaurant.schema';
import { JwtRestaurantStrategy } from 'src/strategies/admin-restaurant.strategry';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AdminRestaurantController],
  providers: [AdminRestaurantService, JwtRestaurantStrategy],
  exports: [AdminRestaurantService],
})
export class AdminRestaurantModule {}
