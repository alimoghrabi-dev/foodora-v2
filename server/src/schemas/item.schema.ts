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
        options: {
          type: [
            {
              name: { type: String, required: true },
              price: { type: Number },
            },
          ],
        },
        isRequired: { type: Boolean, default: false },
        isAvailable: { type: Boolean, default: true },
      },
    ],
    default: [],
  })
  variants: {
    name: string;
    price?: number;
    options?: { name: string; price: number }[];
    isRequired?: boolean;
    isAvailable?: boolean;
  }[];

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        price: { type: Number },
      },
    ],
  })
  addons: {
    name: string;
    price: number;
  };

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: false })
  onSale: boolean;

  @Prop({ enum: ['fixed', 'percentage'] })
  saleType?: 'fixed' | 'percentage';

  @Prop({ default: 0 })
  saleAmount?: number;

  @Prop()
  saleStartDate?: Date;

  @Prop()
  saleEndDate?: Date;

  @Prop({ default: false })
  isEdited: boolean;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

ItemSchema.index({ restaurantId: 1 });
ItemSchema.index({ title: 1, restaurantId: 1 });
ItemSchema.index({ restaurantId: 1, 'variants._id': 1 });
ItemSchema.index({ restaurantId: 1, category: 1 });
ItemSchema.index({ onSale: 1, saleEndDate: 1 });
ItemSchema.index({ onSale: 1, restaurantId: 1 });
