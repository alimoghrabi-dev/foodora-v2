import {
  ConflictException,
  FileTypeValidator,
  Injectable,
  InternalServerErrorException,
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
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as sharp from 'sharp';
import { emailVerificationTemplate } from 'src/lib/email/templates/email-verification.template';
import {
  OpeningHoursDto,
  PublishRestaurantDto,
} from './dtos/publish-restaurant.dto';
import { Category, CategoryDocument } from 'src/schemas/category.schema';

@Injectable()
export class AdminRestaurantService {
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
      console.error(error);
      throw new InternalServerErrorException('Failed to create restaurant');
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
            fit: 'contain',
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

      await this.categoryModel.deleteOne({
        _id: categoryId,
      });

      return {
        message: 'Category deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
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
        isAvailable,
      } = createMenuItemDto;

      let parsedVariants: VariantDto[] = [];

      if (Array.isArray(variants)) {
        parsedVariants = variants.map((variant) =>
          typeof variant === 'string'
            ? (JSON.parse(variant) as VariantDto)
            : variant,
        );
      }

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
        variants: parsedVariants,
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
            'variants.$.price': variantDto.price ?? 0,
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
}
