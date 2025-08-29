import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './features/cart/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AdminRestaurantModule } from './features/admin-restaurant/admin-restaurant.module';
import { CartModule } from './features/cart/cart.module';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        COOKIE_SECRET: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    AuthModule,
    UserModule,
    AdminRestaurantModule,
    ScheduleModule.forRoot(),
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
