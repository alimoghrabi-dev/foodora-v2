import {
  ConflictException,
  FileTypeValidator,
  Injectable,
  InternalServerErrorException,
  Logger,
  MaxFileSizeValidator,
  NotFoundException,
  ParseFilePipe,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from 'src/schemas/restaurant.schema';
import { RegisterRestaurantDto } from './dtos/restaurant-register.dto';
import { LoginRestaurantDto } from './dtos/restaurant-login.dto';
import { CreateMenuItemDto, VariantDto } from './dtos/create-menu-item.dto';
import { IRestaurant } from 'types/nest';
import { S3Service } from 'src/lib/s3.service';
import { Item, ItemDocument } from 'src/schemas/item.schema';
import { EmailService } from 'src/lib/email/email.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model, Types } from 'mongoose';
import { emailVerificationTemplate } from 'src/lib/email/templates/email-verification.template';
import {
  OpeningHoursDto,
  PublishRestaurantDto,
  RestaurantManagementDto,
} from './dtos/publish-restaurant.dto';
import { Category, CategoryDocument } from 'src/schemas/category.schema';
import { ItemSaleDto } from './dtos/apply-sale.dto';
import * as bcrypt from 'bcrypt';
import * as sharp from 'sharp';

@Injectable()
export class AdminRestaurantService {
  private readonly logger = new Logger(AdminRestaurantService.name);

  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,

    @InjectModel(Item.name)
    private readonly itemModel: Model<ItemDocument>,

    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,

    private readonly jwtService: JwtService,
    private readonly s3Service: S3Service,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleExpiredSales() {
    this.logger.verbose('Running expired sale cleanup job...');

    const now = new Date();

    try {
      const expiredItems = await this.itemModel
        .find({
          onSale: true,
          saleEndDate: { $lte: now },
        })
        .select('_id');

      if (expiredItems.length) {
        this.logger.verbose(`Expiring ${expiredItems.length} item sales`);

        const expiredIds = expiredItems.map((item) => item._id);

        await this.itemModel.updateMany(
          { _id: { $in: expiredIds } },
          {
            $set: {
              onSale: false,
              saleType: null,
              saleAmount: null,
              saleStartDate: null,
              saleEndDate: null,
            },
          },
        );
      } else {
        this.logger.verbose('No expired sales found');
      }

      const expiredRestaurants = await this.restaurantModel
        .find({
          onSale: true,
          saleEndDate: { $lte: now },
        })
        .select('_id');

      if (expiredRestaurants.length > 0) {
        this.logger.verbose(
          `Expiring ${expiredRestaurants.length} restaurant sales`,
        );

        const expiredRestaurantIds = expiredRestaurants.map((r) => r._id);

        await this.restaurantModel.updateMany(
          { _id: { $in: expiredRestaurantIds } },
          {
            $set: {
              onSale: false,
              saleType: null,
              saleAmount: null,
              saleStartDate: null,
              saleEndDate: null,
            },
          },
        );
      } else {
        this.logger.verbose('No expired restaurant sales found');
      }
    } catch (error) {
      this.logger.error('Error handling expired sales', error);
    }
  }

  async registerNewRestaurant(registerRestaurantDto: RegisterRestaurantDto) {
    try {
      const { name, cuisine, email, password } = registerRestaurantDto;

      const exists = await this.restaurantModel.findOne({ email }).lean();

      if (exists) throw new ConflictException('Restaurant already exists');

      const hashed = await bcrypt.hash(password, 12);

      await this.restaurantModel.create({
        name,
        cuisine,
        email,
        password: hashed,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to create restaurant');
      }
    }
  }

  async loginRestaurant(loginRestaurantDto: LoginRestaurantDto) {
    try {
      const { email, password } = loginRestaurantDto;

      const restaurant = await this.restaurantModel.findOne({ email: email });

      if (!restaurant) throw new NotFoundException('Invalid credentials');

      const match = await bcrypt.compare(password, restaurant.password);

      if (!match) throw new NotFoundException('Invalid credentials');

      return this.generateTokens(restaurant._id as string);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to login restaurant');
      }
    }
  }

  async generateTokens(restaurantId: string) {
    const payload = { sub: restaurantId };
    console.log(restaurantId);
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET_RESTAURANT,
      expiresIn: '7d',
    });

    return { accessToken };
  }

  async sendVerificationEmailService(restaurant: IRestaurant) {
    try {
      if (restaurant.isEmailVerified) {
        return {
          message: 'Email already verified',
        };
      }

      const token = await this.jwtService.signAsync(
        { email: restaurant.email },
        {
          secret: process.env.JWT_EMAIL_ACCESS_SECRET,
          expiresIn: '15m',
        },
      );

      const url = `${process.env.ADMIN_CLIENT_ORIGIN}/verification-email-status?token=${token}`;

      const htmlTemplate = emailVerificationTemplate(url);

      await this.emailService.sendEmail(
        restaurant.email,
        'Verify Email',
        htmlTemplate,
      );

      return {
        message: 'Email sent successfully',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to send verification email',
        );
      }
    }
  }

  async verifyEmailService(restaurant: IRestaurant, token: string) {
    try {
      if (restaurant.isEmailVerified) {
        return {
          message: 'Email already verified',
        };
      }

      interface JwtEmailPayload {
        email: string;
      }

      const payload = await this.jwtService.verifyAsync<JwtEmailPayload>(
        token,
        {
          secret: process.env.JWT_EMAIL_ACCESS_SECRET,
        },
      );

      if (payload.email !== restaurant.email) {
        throw new UnauthorizedException('Token email does not match.');
      }

      await this.restaurantModel.updateOne(
        { _id: restaurant._id },
        { $set: { isEmailVerified: true } },
      );

      return {
        message: 'Email verified successfully',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to verify email');
      }
    }
  }

  async publishRestaurant(
    publishRestaurantDto: PublishRestaurantDto,
    logo: Express.Multer.File | undefined,
    coverImage: Express.Multer.File | undefined,
    restaurant: IRestaurant,
  ) {
    const {
      name,
      description,
      cuisine,
      address,
      openingHours,
      phoneNumber,
      website,
      freeDeliveryFirstOrder,
      pricingDescription,
      deliveryTimeRange,
    } = publishRestaurantDto;

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
    ];
    try {
      if (!logo) throw new NotFoundException('Logo is required');
      if (!coverImage) throw new NotFoundException('Cover image is required');

      const validateFile = async (
        file: Express.Multer.File | undefined,
        name: string,
      ) => {
        const pipe = new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({
              maxSize: 10 * 1024 * 1024,
              message: `${name} must be less than 10MB`,
            }),
            new FileTypeValidator({
              fileType: new RegExp(
                allowedMimeTypes.join('|').replace(/\//g, '\\/'),
              ),
            }),
          ],
        });

        await pipe.transform(file);
      };

      await Promise.all([
        validateFile(logo, 'Logo'),
        validateFile(coverImage, 'Cover Image'),
      ]);

      const [compressedLogo, compressedCoverImage] = await Promise.all([
        sharp(logo.buffer)
          .resize({
            width: 150,
            height: 150,
            fit: 'cover',
            background: { r: 255, g: 255, b: 255, alpha: 0 },
          })
          .toFormat('webp')
          .webp({ quality: 80 })
          .toBuffer(),

        sharp(coverImage.buffer)
          .resize({
            width: 1200,
            height: 600,
            fit: 'cover',
            position: 'center',
          })
          .toFormat('webp')
          .webp({ quality: 80 })
          .toBuffer(),
      ]);

      const logoFileName = `menu-items/${restaurant.name}/${Date.now()}-${logo?.originalname}`;
      const coverImageFileName = `menu-items/${restaurant.name}/${Date.now()}-${coverImage?.originalname}`;

      const [logoUrl, coverImageUrl] = await Promise.all([
        this.s3Service.uploadFile(compressedLogo, logoFileName, 'image/webp'),
        this.s3Service.uploadFile(
          compressedCoverImage,
          coverImageFileName,
          'image/webp',
        ),
      ]);

      await this.restaurantModel.updateOne(
        { _id: restaurant._id },
        {
          $set: {
            name,
            description,
            cuisine,
            address,
            openingHours,
            phoneNumber,
            website,
            logo: logoUrl,
            coverImage: coverImageUrl,
            freeDeliveryFirstOrder: freeDeliveryFirstOrder || false,
            pricingDescription,
            deliveryTimeRange,
            isPublished: true,
          },
        },
      );

      return {
        message: 'Restaurant Publsihed Successfully',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to publish restaurant');
      }
    }
  }

  async manageRestaurant(
    publishRestaurantDto: RestaurantManagementDto,
    logo: Express.Multer.File | undefined,
    coverImage: Express.Multer.File | undefined,
    restaurant: IRestaurant,
  ) {
    const {
      name,
      description,
      cuisine,
      address,
      phoneNumber,
      website,
      pricingDescription,
      freeDeliveryFirstOrder,
      deliveryTimeRange,
    } = publishRestaurantDto;

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
    ];
    try {
      const dbRestaurant = await this.restaurantModel.findById(restaurant._id);

      if (!dbRestaurant) throw new NotFoundException('Restaurant not found');

      if (typeof logo !== 'string' && !logo && !dbRestaurant.logo)
        throw new NotFoundException('Logo is required');
      if (
        typeof coverImage !== 'string' &&
        !coverImage &&
        !dbRestaurant.coverImage
      )
        throw new NotFoundException('Cover image is required');

      const validateFile = async (
        file: Express.Multer.File | undefined,
        name: string,
      ) => {
        const pipe = new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({
              maxSize: 10 * 1024 * 1024,
              message: `${name} must be less than 10MB`,
            }),
            new FileTypeValidator({
              fileType: new RegExp(
                allowedMimeTypes.join('|').replace(/\//g, '\\/'),
              ),
            }),
          ],
        });

        await pipe.transform(file);
      };

      let compressedLogo: Buffer | undefined;
      let compressedCoverImage: Buffer | undefined;

      if (logo && typeof logo !== 'string') {
        await validateFile(logo, 'Logo');

        const oldKey = new URL(dbRestaurant.logo).pathname.slice(1);
        await this.s3Service.deleteFile(oldKey);

        compressedLogo = await sharp(logo?.buffer)
          .resize({
            width: 150,
            height: 150,
            fit: 'cover',
            background: { r: 255, g: 255, b: 255, alpha: 0 },
          })
          .toFormat('webp')
          .webp({ quality: 80 })
          .toBuffer();
      }

      if (coverImage && typeof coverImage !== 'string') {
        await validateFile(coverImage, 'Cover Image');

        const oldKey = new URL(dbRestaurant.coverImage).pathname.slice(1);
        await this.s3Service.deleteFile(oldKey);

        compressedCoverImage = await sharp(coverImage?.buffer)
          .resize({
            width: 1200,
            height: 600,
            fit: 'cover',
            position: 'center',
          })
          .toFormat('webp')
          .webp({ quality: 80 })
          .toBuffer();
      }

      const logoFileName = `menu-items/${restaurant.name}/${Date.now()}-${logo?.originalname}`;
      const coverImageFileName = `menu-items/${restaurant.name}/${Date.now()}-${coverImage?.originalname}`;

      let logoUrl: string;
      let coverImageUrl: string;

      if (compressedLogo) {
        logoUrl = await this.s3Service.uploadFile(
          compressedLogo,
          logoFileName,
          'image/webp',
        );

        dbRestaurant.logo = logoUrl;
      }

      if (compressedCoverImage) {
        coverImageUrl = await this.s3Service.uploadFile(
          compressedCoverImage,
          coverImageFileName,
          'image/webp',
        );

        dbRestaurant.coverImage = coverImageUrl;
      }

      if (name && dbRestaurant.name !== name) {
        dbRestaurant.name = name;
      }

      if (description && dbRestaurant.description !== description) {
        dbRestaurant.description = description;
      }

      if (cuisine && dbRestaurant.cuisine !== cuisine) {
        dbRestaurant.cuisine = cuisine;
      }

      if (phoneNumber && dbRestaurant.phoneNumber !== phoneNumber) {
        dbRestaurant.phoneNumber = phoneNumber;
      }

      if (website && dbRestaurant.website !== website) {
        dbRestaurant.website = website;
      }

      if (
        pricingDescription &&
        dbRestaurant.pricingDescription !== pricingDescription
      ) {
        dbRestaurant.pricingDescription = pricingDescription;
      }

      if (
        deliveryTimeRange &&
        dbRestaurant.deliveryTimeRange !== deliveryTimeRange
      ) {
        dbRestaurant.deliveryTimeRange = deliveryTimeRange;
      }

      dbRestaurant.address = {
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        latitude: address.latitude ?? undefined,
        longitude: address.longitude ?? undefined,
      };

      dbRestaurant.freeDeliveryFirstOrder = freeDeliveryFirstOrder || false;

      await dbRestaurant.save();

      return {
        message: 'Restaurant Managed Successfully',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to manage restaurant');
      }
    }
  }

  async updateRestaurantOpeningHours(
    openingHoursDto: OpeningHoursDto,
    restaurant: IRestaurant,
  ) {
    try {
      const { openingHours } = openingHoursDto;

      if (!restaurant.isPublished) {
        throw new ConflictException('Restaurant is not published');
      }

      await this.restaurantModel.updateOne(
        { _id: restaurant._id },
        { $set: { openingHours } },
      );

      return {
        message: 'Opening hours updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to update opening hours',
        );
      }
    }
  }

  // MENU ===>

  async createCategory(name: string, restaurant: IRestaurant) {
    try {
      if (name.trim() === '') {
        throw new NotFoundException('Category name is required');
      }

      const existingCategory = await this.categoryModel.findOne({
        name,
        restaurantId: restaurant._id,
      });

      if (existingCategory) {
        throw new ConflictException('Category already exists');
      }

      await this.categoryModel.create({
        name,
        restaurantId: restaurant._id,
      });

      return {
        message: 'Category created successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to create menu category',
        );
      }
    }
  }

  async getRestaurantCategories(restaurant: IRestaurant) {
    try {
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      const categories = await this.categoryModel
        .find({
          restaurantId: restaurant._id,
        })
        .lean();

      return categories;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to get categories');
      }
    }
  }

  async editCategory(
    name: string,
    categoryId: string,
    restaurant: IRestaurant,
  ) {
    try {
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      const updatedCategory = await this.categoryModel.findOneAndUpdate(
        {
          _id: categoryId,
          restaurantId: restaurant._id,
        },
        {
          $set: {
            name,
          },
        },
      );

      if (!updatedCategory) {
        throw new NotFoundException('Category not found');
      }

      return {
        message: 'Category updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to update category');
      }
    }
  }

  async deleteCategory(categoryId: string, restaurant: IRestaurant) {
    try {
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      const exists = await this.itemModel.exists({
        restaurantId: restaurant._id,
        category: new Types.ObjectId(categoryId),
      });

      if (exists) {
        throw new ConflictException(
          'Category is associated with menu items, edit items first',
        );
      }

      await this.categoryModel.deleteOne({
        _id: categoryId,
      });

      return {
        message: 'Category deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to delete category');
      }
    }
  }

  async createNewMenuItem(
    createMenuItemDto: CreateMenuItemDto,
    file: Express.Multer.File,
    restaurant: IRestaurant,
  ) {
    try {
      const {
        title,
        description,
        price,
        category,
        ingredients,
        tags,
        variants,
        addons,
        isAvailable,
      } = createMenuItemDto;

      let imageUrl: string | undefined;

      const itemExists = await this.itemModel
        .findOne({
          restaurantId: restaurant._id,
          title,
        })
        .lean();

      if (itemExists) throw new ConflictException('Menu item already exists');

      if (file) {
        const compressedImage = await sharp(file.buffer)
          .resize({
            width: 325,
            height: 275,
            fit: 'cover',
          })
          .toFormat('webp')
          .webp({ quality: 80 })
          .toBuffer();

        const filename = `menu-items/${restaurant.name}/${Date.now()}-${file.originalname}`;

        imageUrl = await this.s3Service.uploadFile(
          compressedImage,
          filename,
          'image/webp',
        );
      }

      await this.itemModel.create({
        restaurantId: restaurant._id,
        title,
        description,
        price,
        imageUrl,
        category,
        ingredients,
        tags,
        variants,
        addons,
        isAvailable,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to create menu item');
      }
    }
  }

  async editMenuItem(
    itemId: string,
    editMenuItemDto: CreateMenuItemDto,
    file: Express.Multer.File,
    restaurant: IRestaurant,
  ) {
    try {
      if (file) {
        const allowedTypes = [
          'image/png',
          'image/jpg',
          'image/jpeg',
          'image/webp',
        ];
        if (!allowedTypes.includes(file.mimetype)) {
          throw new ConflictException('Invalid file type');
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new ConflictException('File too large (max 10MB)');
        }
      }

      const {
        title,
        description,
        price,
        category,
        ingredients,
        tags,
        variants,
        addons,
        isAvailable,
      } = editMenuItemDto;

      let imageUrl: string | undefined;

      const itemExists = await this.itemModel.findById(itemId).lean();

      if (!itemExists) throw new NotFoundException('Menu item not found');

      if (file) {
        if (itemExists.imageUrl) {
          const oldKey = new URL(itemExists.imageUrl).pathname.slice(1);
          await this.s3Service.deleteFile(oldKey);
        }

        const compressedImage = await sharp(file.buffer)
          .resize({
            width: 325,
            height: 275,
            fit: 'cover',
          })
          .toFormat('webp')
          .webp({ quality: 80 })
          .toBuffer();

        const filename = `menu-items/${restaurant.name}/${Date.now()}-${file.originalname}`;

        imageUrl = await this.s3Service.uploadFile(
          compressedImage,
          filename,
          'image/webp',
        );
      }

      await this.itemModel.findOneAndUpdate(
        {
          _id: itemId,
        },
        {
          $set: {
            title,
            description,
            price,
            imageUrl,
            category: new Types.ObjectId(category),
            ingredients,
            tags,
            variants,
            addons,
            isAvailable,
          },
        },
      );
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to create menu item');
      }
    }
  }

  async deleteMenuItem(itemId: string, restaurant: IRestaurant) {
    try {
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      const result = await this.itemModel.deleteOne({
        _id: itemId,
      });

      if (result.deletedCount === 0) {
        throw new NotFoundException('Menu item not found');
      }

      return {
        message: 'Item deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to delete item');
      }
    }
  }

  async getMenuItems(restaurant: IRestaurant) {
    try {
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      //TODO: Add pagination

      const items = await this.itemModel
        .find({
          restaurantId: restaurant._id,
        })
        .populate('category')
        .lean();

      return items;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to get menu items');
      }
    }
  }

  async editItemVariant(
    variantId: string,
    variantDto: VariantDto,
    restaurant: IRestaurant,
  ) {
    try {
      const updateResult = await this.itemModel.updateOne(
        {
          restaurantId: restaurant._id,
          'variants._id': variantId,
        },
        {
          $set: {
            'variants.$.name': variantDto.name,
            'variants.$.options': variantDto.options,
            'variants.$.isRequired': variantDto.isRequired ?? true,
            'variants.$.isAvailable': variantDto.isAvailable ?? true,
          },
        },
      );

      if (updateResult.matchedCount === 0) {
        throw new NotFoundException('Variant not found in any menu item');
      }

      return {
        message: 'Variant updated successfully',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to edit menu item variant',
        );
      }
    }
  }

  async deleteVariant(variantId: string, restaurant: IRestaurant) {
    try {
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      const result = await this.itemModel.updateOne(
        {
          restaurantId: restaurant._id,
          'variants._id': variantId,
        },
        {
          $pull: {
            variants: { _id: variantId },
          },
        },
      );

      if (result.modifiedCount === 0) {
        throw new NotFoundException('Variant not found in any item');
      }

      return {
        message: 'Variant deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to delete variant');
      }
    }
  }

  async getMenuItemByName(title: string, restaurant: IRestaurant) {
    try {
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      const item = await this.itemModel
        .findOne({
          title,
          restaurantId: restaurant._id,
        })
        .populate('category')
        .lean();

      return item;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to get menu item');
      }
    }
  }

  async applyItemSale(
    itemId: string,
    itemSaleDto: ItemSaleDto,
    restaurant: IRestaurant,
  ) {
    try {
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      if (restaurant.onSale) {
        throw new ConflictException('Restaurant is already on sale');
      }

      const { saleType, saleAmount, saleStartDate, saleEndDate } = itemSaleDto;

      const updateFields: Record<string, any> = {
        onSale: true,
        saleType,
        saleAmount,
      };

      if (saleStartDate) updateFields.saleStartDate = saleStartDate;
      if (saleEndDate) updateFields.saleEndDate = saleEndDate;

      const result = await this.itemModel.updateOne(
        { _id: itemId },
        { $set: updateFields },
      );

      if (result.modifiedCount === 0) {
        throw new NotFoundException('Menu item not found');
      }

      return {
        message: 'Sale applied successfully',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to apply sale to menu item',
        );
      }
    }
  }

  async removeItemSale(itemId: string) {
    try {
      const result = await this.itemModel.updateOne(
        { _id: itemId },
        {
          $set: {
            onSale: false,
            saleType: null,
            saleAmount: null,
            saleStartDate: null,
            saleEndDate: null,
          },
        },
      );

      if (result.modifiedCount === 0) {
        throw new NotFoundException('Menu item not found');
      }

      return {
        message: 'Sale removed successfully',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to remove sale from menu item',
        );
      }
    }
  }

  async getOnSaleItems(restaurant: IRestaurant) {
    try {
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      const items = await this.itemModel
        .find({
          onSale: true,
          restaurantId: restaurant._id,
        })
        .lean();

      const now = new Date();
      const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const activeSales = items.filter((item) => {
        const startOk = !item.saleStartDate || item.saleStartDate <= now;
        const endOk = !item.saleEndDate || item.saleEndDate > now;
        return item.onSale && startOk && endOk;
      });

      const expiringSoonSales = activeSales.filter(
        (item) =>
          item.saleEndDate !== undefined &&
          item.saleEndDate !== null &&
          item.saleEndDate <= next24Hours,
      );

      const upcomingSales = items.filter((item) => item.saleStartDate! > now);

      return {
        items,
        activeSales: activeSales.length || 0,
        expiringSoonSales: expiringSoonSales.length || 0,
        upcomingSales: upcomingSales.length || 0,
        totalSales: items.length || 0,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to get sale menu items');
      }
    }
  }

  async getNotOnSaleItems(restaurant: IRestaurant) {
    try {
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      const items = await this.itemModel
        .find({
          onSale: false,
          restaurantId: restaurant._id,
        })
        .lean();

      return {
        items,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to get not on sale menu items',
        );
      }
    }
  }

  async applyMenuSale(menuSaleDto: ItemSaleDto, restaurant: IRestaurant) {
    try {
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      if (restaurant.onSale) {
        throw new ConflictException('Menu is already on sale');
      }

      const { saleType, saleAmount, saleStartDate, saleEndDate } = menuSaleDto;

      await this.restaurantModel.updateOne(
        {
          _id: restaurant._id,
        },
        {
          $set: {
            onSale: true,
            saleType,
            saleAmount,
            saleStartDate,
            saleEndDate,
          },
        },
      );

      await this.itemModel.updateMany(
        { restaurantId: restaurant._id, onSale: true },
        {
          $set: {
            onSale: false,
            saleType: null,
            saleAmount: null,
            saleStartDate: null,
            saleEndDate: null,
          },
        },
      );

      return {
        message: 'Sale applied to the whole menu successfully',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Failed to apply sale to the whole menu',
        );
      }
    }
  }

  async removeMenuSale(restaurant: IRestaurant) {
    try {
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      const result = await this.restaurantModel.updateOne(
        { _id: restaurant._id },
        {
          $set: {
            onSale: false,
            saleType: null,
            saleAmount: null,
            saleStartDate: null,
            saleEndDate: null,
          },
        },
      );

      if (result.modifiedCount === 0) {
        throw new NotFoundException('Menu item not found');
      }

      return {
        message: 'Menu Sale removed successfully',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to remove menu sale');
      }
    }
  }
}
