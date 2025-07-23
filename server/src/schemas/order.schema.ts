import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  items: { item: Types.ObjectId; quantity: number }[];

  @Prop({
    type: String,
    required: true,
    enum: [
      'pending',
      'accepted',
      'rejected',
      'preparing',
      'pickedup',
      'done',
      'cancelled',
      'returned',
      'delivering',
      'delivered',
    ],
  })
  status: string;

  @Prop({ type: Number, required: true })
  total: number;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop()
  wasOnSale: boolean;

  @Prop({ type: String, enum: ['cash on delivery', 'stripe', 'whish'] })
  paymentMethod: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
