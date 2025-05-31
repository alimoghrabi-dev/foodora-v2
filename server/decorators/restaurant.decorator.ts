import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IRestaurant } from 'types/nest';

export const Restaurant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IRestaurant => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { restaurant: IRestaurant }>();

    if (!request.restaurant) {
      throw new Error('Restaurant not found in request');
    }

    return request.restaurant;
  },
);
