import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class CartItemVariant {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  optionName: string;

  @Prop({ type: Types.ObjectId, required: true })
  optionId: Types.ObjectId;

  @Prop({ type: Number })
  price: number;
}

export const CartItemVariantSchema =
  SchemaFactory.createForClass(CartItemVariant);

@Schema()
export class CartItemAddon {
  @Prop({ type: String, required: true })
  addonId: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number })
  price: number;
}

export const CartItemAddonSchema = SchemaFactory.createForClass(CartItemAddon);

@Schema()
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Item', required: true })
  itemId: Types.ObjectId;

  @Prop({ type: Number, default: 1 })
  quantity: number;

  @Prop({ type: [CartItemVariantSchema], default: [] })
  variants: CartItemVariant[];

  @Prop({ type: [CartItemAddonSchema], default: [] })
  addons: CartItemAddon[];
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.index({ userId: 1, restaurantId: 1 });
