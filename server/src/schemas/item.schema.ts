import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop([String])
  tags: string[];

  @Prop([String])
  ingredients: string[];

  @Prop()
  imageUrl: string;

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        price: { type: Number, default: 0 },
        isAvailable: { type: Boolean, default: true },
      },
    ],
    default: [],
  })
  variants: {
    name: string;
    price?: number;
    isAvailable?: boolean;
  }[];

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewsCount: number;

  @Prop({ default: false })
  isEdited: boolean;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
