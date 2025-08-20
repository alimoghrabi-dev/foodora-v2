import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Cart, CartDocument, CartItem } from 'src/schemas/cart.schema';
import { Item, ItemDocument } from 'src/schemas/item.schema';
import { Restaurant, RestaurantDocument } from 'src/schemas/restaurant.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { IUser } from 'types/nest';
import { SelectedAddonDto, SelectedVariantDto } from './dtos/add-to-cart.dto';
import { calculateItemTotal } from 'src/lib/utils';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Item.name)
    private itemModel: Model<ItemDocument>,
  ) {}

  async addItemToCart(
    restaurantId: string,
    itemId: string,
    user: IUser,
    quantity: number,
    selectedVariants: SelectedVariantDto[],
    selectedAddons: SelectedAddonDto[],
  ) {
    try {
      const restaurant = await this.restaurantModel.findById(restaurantId);

      if (!restaurant || !restaurant.isPublished) {
        throw new ConflictException('Restaurant not found');
      }

      if (!user) {
        throw new ConflictException('User not found');
      }

      const item = await this.itemModel.findById(itemId).lean();

      if (!item || item.restaurantId.toString() !== String(restaurant._id)) {
        throw new ConflictException('Invalid item for this restaurant');
      }

      const userAndRestaurantCart = await this.cartModel.findOne({
        userId: user._id,
        restaurantId: restaurant._id,
      });

      const objectIdItemId: Types.ObjectId = item._id as Types.ObjectId;

      const itemTotal = calculateItemTotal(
        item.price,
        quantity,
        selectedVariants,
        selectedAddons,
      );

      if (!userAndRestaurantCart) {
        const newCart = await this.cartModel.create({
          restaurantId: restaurant._id,
          userId: user._id,
          items: [
            {
              itemId: objectIdItemId,
              quantity,
              variants: selectedVariants,
              addons: selectedAddons,
            },
          ],
          totalPrice: itemTotal,
        });

        await this.userModel.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { carts: newCart._id } },
        );

        return { message: 'Item added to cart successfully' };
      }

      type CartItemDocument = CartItem & Document;

      const existingItem = userAndRestaurantCart.items.find(
        (cartItem: CartItemDocument) => {
          const sameItem =
            cartItem.itemId.toString() === objectIdItemId.toString();

          const sameVariants =
            cartItem.variants.length === selectedVariants.length &&
            cartItem.variants.every((v, i) => {
              const sel = selectedVariants[i];
              return (
                v.optionId.toString() === sel.optionId.toString() &&
                v.name === sel.name &&
                v.optionName === sel.optionName &&
                (v.price || 0) === (sel.price || 0)
              );
            });

          const sameAddons =
            cartItem.addons.length === selectedAddons.length &&
            cartItem.addons.every((a, i) => {
              const sel = selectedAddons[i];
              return (
                a.addonId.toString() === sel.addonId.toString() &&
                a.name === sel.name &&
                (a.price || 0) === (sel.price || 0)
              );
            });

          return sameItem && sameVariants && sameAddons;
        },
      );

      if (existingItem) {
        await this.cartModel.updateOne(
          {
            _id: userAndRestaurantCart._id,
            'items._id': (existingItem as CartItemDocument)._id,
          },
          {
            $inc: {
              'items.$.quantity': quantity,
              totalPrice: itemTotal,
            },
          },
        );
      } else {
        await this.cartModel.updateOne(
          {
            _id: userAndRestaurantCart._id,
          },
          {
            $push: {
              items: {
                itemId: objectIdItemId,
                quantity,
                variants: selectedVariants,
                addons: selectedAddons,
              },
            },
            $inc: { totalPrice: itemTotal },
          },
        );
      }

      const updatedCart = await this.cartModel.findById(
        userAndRestaurantCart._id,
      );
      return { message: 'Item added to cart successfully', cart: updatedCart };
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to add item to your cart');
    }
  }

  async removeItemFromCart(restaurantId: string, itemId: string, user: IUser) {
    try {
      const restaurant = await this.restaurantModel
        .findById(restaurantId)
        .lean();

      if (!restaurant || !restaurant.isPublished) {
        throw new ConflictException('Restaurant not found');
      }

      if (!user) {
        throw new ConflictException('User not found');
      }

      const item = await this.itemModel.findById(itemId);

      if (!item || item.restaurantId.toString() !== restaurantId) {
        throw new ConflictException('Invalid item for this restaurant');
      }

      const userAndRestaurantCart = await this.cartModel
        .findOne({
          userId: user._id,
          restaurantId: restaurant._id,
        })
        .lean();

      if (!userAndRestaurantCart) {
        throw new ConflictException('Cart not found');
      }

      const cartItem = userAndRestaurantCart.items.find(
        (i) => i.itemId.toString() === String(item._id),
      );

      if (!cartItem) {
        throw new ConflictException('Item not in cart');
      }

      const totalToSubtract = item.price * cartItem.quantity;

      const objectIdItemId: Types.ObjectId = item._id as Types.ObjectId;

      await this.cartModel.updateOne(
        {
          userId: user._id,
          restaurantId: restaurant._id,
        },
        {
          $pull: {
            items: {
              itemId: objectIdItemId,
            },
          },
          $inc: { totalPrice: -totalToSubtract },
        },
      );

      return {
        message: 'Item added to cart successfully',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to add item to your cart',
        );
      }
    }
  }
}
