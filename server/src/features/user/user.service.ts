import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { getIsAutoClosed } from 'src/lib/utils';
import { Category, CategoryDocument } from 'src/schemas/category.schema';
import { Item, ItemDocument } from 'src/schemas/item.schema';
import { Restaurant, RestaurantDocument } from 'src/schemas/restaurant.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { IUser } from 'types/nest';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async getAllCuisines(query: string | undefined) {
    try {
      const matchStage: Record<string, any> = {
        cuisine: { $ne: null },
      };

      if (query?.trim()) {
        matchStage.cuisine = {
          $regex: new RegExp(query.trim(), 'i'),
        };
      }

      const result = await this.restaurantModel.aggregate([
        { $match: matchStage },
        { $group: { _id: '$cuisine' } },
      ]);

      return {
        cuisines: result.map((cuisine) => cuisine._id as string),
      };
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to get restaurant cuisines',
        );
      }
    }
  }

  async getFilteredRestaurants(
    sort: string | null,
    quickFilter: string | null,
    cuisine: string | null,
    price: string | null,
  ) {
    try {
      const filters: Record<string, any> = {
        isPublished: true,
      };

      if (quickFilter) {
        filters.rating = { $gte: 4 };
      }

      if (cuisine) {
        filters.cuisine = { $regex: new RegExp(`^${cuisine}$`, 'i') };
      }

      if (price) {
        const priceArray = price
          .split(',')
          .map((p) => p.trim())
          .filter((p) => p.length > 0);

        if (priceArray.length > 0) {
          filters.pricingDescription = { $in: priceArray };
        }
      }

      const sortOption: Record<string, 1 | -1> = {};

      if (sort === 'top_rated') {
        sortOption.rating = -1;
      } else if (sort === 'fastest_delivery') {
        // No-op for now
      } else if (sort === 'distance') {
        // No-op for now
      }

      const restaurants = await this.restaurantModel
        .find(filters)
        .sort(sortOption)
        .select(
          '_id name cuisine coverImage description logo onSale saleAmount isClosed openingHours pricingDescription deliveryTimeRange freeDeliveryFirstOrder rating ratingCount',
        )
        .lean();

      const restaurantsWithStatus = restaurants.map(
        ({ openingHours, ...rest }) => ({
          ...rest,
          isAutoClosed: getIsAutoClosed(openingHours),
        }),
      );

      return {
        restaurants: restaurantsWithStatus,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to get filtered restaurants',
        );
      }
    }
  }

  async getRestaurantById(restaurantId: string) {
    try {
      const restaurant = await this.restaurantModel
        .findById(restaurantId)
        .select(
          '_id name cuisine coverImage description logo onSale saleAmount isClosed openingHours pricingDescription deliveryTimeRange freeDeliveryFirstOrder rating ratingCount isPublished',
        )
        .lean();

      if (!restaurant) {
        throw new ConflictException('Restaurant not found');
      }

      if (!restaurant.isPublished) {
        throw new ConflictException('Restaurant is not published');
      }

      const isAutoClosed = getIsAutoClosed(restaurant.openingHours);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { openingHours, ...rest } = restaurant;

      const managedRestaurant = {
        ...rest,
        isAutoClosed,
      };

      return {
        restaurant: managedRestaurant,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to get filtered restaurants',
        );
      }
    }
  }

  async getRestaurantItems(restaurantId: string, categoryId: string) {
    try {
      const restaurant = await this.restaurantModel
        .findById(restaurantId)
        .lean();

      if (!restaurant || !restaurant.isPublished) {
        throw new ConflictException('Restaurant not found');
      }

      let restaurantItems = [];

      if (categoryId) {
        console.log(categoryId);
        restaurantItems = await this.itemModel.find({
          restaurantId: restaurant._id,
          category: new Types.ObjectId(categoryId),
        });
      } else {
        // return popular items or all if no popular items :TODO:

        restaurantItems = await this.itemModel.find({
          restaurantId: restaurant._id,
        });
      }

      return {
        items: restaurantItems,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to get filtered restaurants',
        );
      }
    }
  }

  async getRestaurantCategories(restaurantId: string) {
    try {
      const restaurant = await this.restaurantModel
        .findById(restaurantId)
        .lean();

      if (!restaurant || !restaurant.isPublished) {
        throw new ConflictException('Restaurant not found');
      }

      const categories = await this.categoryModel
        .find({
          restaurantId: restaurant._id,
        })
        .lean();

      const categoriesWithItemCounts = await Promise.all(
        categories.map(async (category) => {
          const itemCount = await this.itemModel.countDocuments({
            category: category._id,
          });

          return {
            ...category,
            itemCount,
          };
        }),
      );

      return {
        categories: categoriesWithItemCounts,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to get filtered restaurants',
        );
      }
    }
  }

  async addRestaurantToFavorites(restaurantId: string, user: IUser) {
    try {
      const restaurantExists = await this.restaurantModel.exists({
        _id: restaurantId,
        isPublished: true,
      });

      if (!restaurantExists) {
        throw new ConflictException('Restaurant not found');
      }

      const updateResult = await this.userModel.updateOne(
        { _id: user._id },
        { $addToSet: { favorites: new Types.ObjectId(restaurantId) } },
      );

      if (updateResult.modifiedCount === 0) {
        return { message: 'Restaurant already added to favorites' };
      }

      return { message: 'Restaurant added to favorites successfully' };
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(
        'Failed to add restaurant to your favorites',
      );
    }
  }

  async removeRestaurantFromFavorites(restaurantId: string, user: IUser) {
    try {
      const restaurantExists = await this.restaurantModel.exists({
        _id: restaurantId,
        isPublished: true,
      });

      if (!restaurantExists) {
        throw new ConflictException('Restaurant not found');
      }

      const updateResult = await this.userModel.updateOne(
        { _id: user._id },
        { $pull: { favorites: new Types.ObjectId(restaurantId) } },
      );

      if (updateResult.modifiedCount === 0) {
        return { message: 'Restaurant already removed from favorites' };
      }

      return { message: 'Restaurant removed from favorites successfully' };
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(
        'Failed to remove restaurant from your favorites',
      );
    }
  }

  async getFavoriteRestaurants(user: IUser) {
    try {
      const restaurants = await this.restaurantModel
        .find({ _id: { $in: user.favorites } })
        .select(
          '_id name cuisine coverImage description logo onSale saleAmount isClosed openingHours pricingDescription deliveryTimeRange freeDeliveryFirstOrder rating ratingCount',
        )
        .lean();

      const restaurantsWithStatus = restaurants.map(
        ({ openingHours, ...rest }) => ({
          ...rest,
          isAutoClosed: getIsAutoClosed(openingHours),
        }),
      );

      return { restaurants: restaurantsWithStatus };
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(
        'Failed to get favorite restaurants',
      );
    }
  }
}
