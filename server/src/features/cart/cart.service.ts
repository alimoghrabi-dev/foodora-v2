import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Cart, CartDocument, CartItem } from 'src/schemas/cart.schema';
import { Item, ItemDocument } from 'src/schemas/item.schema';
import { Restaurant, RestaurantDocument } from 'src/schemas/restaurant.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { IRestaurant, IUser } from 'types/nest';
import { SelectedAddonDto, SelectedVariantDto } from './dtos/add-to-cart.dto';
import { getIsAutoClosed } from 'src/lib/utils';

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

  async removeItemFromCart(cartId: string, itemId: string, user: IUser) {
    try {
      if (!user) {
        throw new ConflictException('User not found');
      }

      const cart = await this.cartModel.findById(cartId).populate<{
        items: (CartItem & { itemId: ItemDocument })[];
      }>({
        path: 'items.itemId',
        select: '_id price',
      });

      if (!cart) {
        throw new ConflictException('Cart not found');
      }

      const prevLength = cart.items.length;

      cart.items = cart.items.filter(
        (i) => i.itemId._id.toString() !== itemId.toString(),
      );

      if (cart.items.length === prevLength) {
        throw new ConflictException('Item not found in cart');
      }

      if (cart.items.length === 0) {
        await this.cartModel.findByIdAndDelete(cartId);
        await this.userModel.findOneAndUpdate(
          { _id: user._id },
          { $pull: { carts: cartId } },
        );
      } else {
        await cart.save();
      }

      return {
        message: 'Item removed from cart successfully',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to remove item from your cart',
        );
      }
    }
  }

  async deleteCart(cartId: string, user: IUser) {
    try {
      if (!user) {
        throw new ConflictException('User not found');
      }

      const cart = await this.cartModel.findByIdAndDelete(cartId);

      if (!cart) {
        throw new ConflictException('Cart not found');
      }

      await this.userModel.findByIdAndUpdate(user._id, {
        $pull: { carts: cart._id },
      });

      return {
        message: 'Cart deleted successfully',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to delete your cart');
      }
    }
  }

  async updateItemQuantity(
    cartId: string,
    itemId: string,
    user: IUser,
    quantity: number,
  ) {
    try {
      if (quantity <= 0) {
        throw new ConflictException('Quantity must be greater than 0');
      }

      if (!user) {
        throw new ConflictException('User not found');
      }

      const cart = await this.cartModel.findById(cartId).populate<{
        items: (CartItem & { itemId: ItemDocument })[];
      }>({
        path: 'items.itemId',
        select: '_id price',
      });

      if (!cart) {
        throw new ConflictException('Cart not found');
      }

      const item = cart.items.find(
        (i) => i.itemId._id.toString() === itemId.toString(),
      );

      if (!item || !item.itemId.price) {
        throw new ConflictException('Item not found in cart');
      }

      item.quantity = quantity;

      await cart.save();

      return {
        message: 'Item quanity updated from your cart successfully',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to update item quantity from your cart',
        );
      }
    }
  }

  async getUserCarts(user: IUser) {
    try {
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userCarts = await this.cartModel
        .find({ userId: user._id })
        .populate({
          path: 'restaurantId',
          select: '_id name logo openingHours isClosed',
        })
        .populate({
          path: 'items.itemId',
          select:
            '_id name price onSale saleType saleAmount saleStartDate saleEndDate',
        })
        .lean<
          {
            _id: Types.ObjectId;
            restaurantId: IRestaurant;
            items: CartItem[];
            createdAt: Date;
            updatedAt: Date;
          }[]
        >();

      const cartsWithTotals = userCarts.map((cart) => {
        const calculateItemBaseTotal = (item: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const basePrice = item.itemId.price ?? 0;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const variantsTotal =
            item.variants?.reduce(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              (sum: number, v: any) => sum + (v.price || 0),
              0,
            ) || 0;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const addonsTotal =
            item.addons?.reduce(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              (sum: number, a: any) => sum + (a.price || 0),
              0,
            ) || 0;

          return (
            (basePrice + variantsTotal + addonsTotal) * (item.quantity || 1)
          );
        };

        let subtotal = 0;

        if (cart.restaurantId.onSale) {
          subtotal = cart.items.reduce(
            (sum: number, item: any) => sum + calculateItemBaseTotal(item),
            0,
          );

          if (cart.restaurantId.saleType === 'percentage') {
            const discount =
              (subtotal * (cart.restaurantId.saleAmount || 0)) / 100;
            subtotal = Math.max(subtotal - discount, 0);
          }

          if (cart.restaurantId.saleType === 'fixed') {
            const discount = cart.restaurantId.saleAmount || 0;
            subtotal = Math.max(subtotal - discount, 0);
          }
        } else {
          subtotal = cart.items.reduce((sum: number, item: any) => {
            let total = calculateItemBaseTotal(item);

            if (item.itemId.onSale) {
              if (item.itemId.saleType === 'percentage') {
                const discount = (total * (item.itemId.saleAmount || 0)) / 100;
                total = Math.max(total - discount, 0);
              }
              if (item.itemId.saleType === 'fixed') {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const discount = item.itemId.saleAmount || 0;
                total = Math.max(total - discount, 0);
              }
            }

            return sum + total;
          }, 0);
        }

        return {
          _id: cart._id,
          restaurantId: cart.restaurantId,
          itemsCount: cart.items.length,
          totalPrice: subtotal,
          isAutoClosed:
            getIsAutoClosed(cart.restaurantId.openingHours) ||
            cart.restaurantId.isClosed,
          createdAt: cart.createdAt,
        };
      });

      return {
        carts: cartsWithTotals,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to get your carts');
      }
    }
  }

  async getCartById(user: IUser, cartId: string) {
    try {
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const cartObject = await this.cartModel
        .findById(cartId)
        .populate({
          path: 'items.itemId',
          select:
            '_id title price imageUrl onSale saleType saleAmount saleStartDate saleEndDate isAvailable',
        })
        .lean();

      const restaurant = await this.restaurantModel
        .findById(cartObject?.restaurantId)
        .select(
          '_id name openingHours isClosed isPublished onSale saleType saleAmount saleStartDate saleEndDate',
        )
        .lean();

      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      const isAutoClosed =
        getIsAutoClosed(restaurant.openingHours) || restaurant.isClosed;

      const cart = {
        ...cartObject,
        isAutoClosed,
        restaurantName: restaurant.name,
        restaurantOnSale: restaurant.onSale,
        restaurantSaleType: restaurant.saleType,
        restaurantSaleAmount: restaurant.saleAmount,
        restaurantSaleStartDate: restaurant.saleStartDate,
        restaurantSaleEndDate: restaurant.saleEndDate,
        isPublished: restaurant.isPublished,
      };

      return {
        cart,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to get your carts');
      }
    }
  }
}
