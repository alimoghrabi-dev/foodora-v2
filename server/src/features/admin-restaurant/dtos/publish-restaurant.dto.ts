import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

class Address {
  @IsString()
  @IsNotEmpty({ message: 'Street is required' })
  @MaxLength(50, { message: 'Street must be less than 50 characters' })
  street: string;

  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  @MaxLength(50, { message: 'City must be less than 50 characters' })
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'State is required' })
  @MaxLength(50, { message: 'State must be less than 50 characters' })
  state: string;

  @IsString()
  @IsNotEmpty({ message: 'Zip code is required' })
  @MaxLength(10, { message: 'Zip code must be less than 10 characters' })
  zipCode: string;

  @IsString()
  country: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Invalid latitude' })
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Invalid longitude' })
  @Min(-180)
  @Max(180)
  longitude?: number;
}

class DailyHours {
  @IsOptional()
  @IsString()
  open: string;

  @IsOptional()
  @IsString()
  close: string;
}

class OpeningHours {
  @ValidateNested()
  @Type(() => DailyHours)
  monday: DailyHours;

  @ValidateNested()
  @Type(() => DailyHours)
  tuesday: DailyHours;

  @ValidateNested()
  @Type(() => DailyHours)
  wednesday: DailyHours;

  @ValidateNested()
  @Type(() => DailyHours)
  thursday: DailyHours;

  @ValidateNested()
  @Type(() => DailyHours)
  friday: DailyHours;

  @ValidateNested()
  @Type(() => DailyHours)
  saturday: DailyHours;

  @ValidateNested()
  @Type(() => DailyHours)
  sunday: DailyHours;
}

export class PublishRestaurantDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(400, { message: 'Description must be less than 400 characters' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Cuisine is required' })
  cuisine: string;

  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @ValidateNested()
  @Type(() => OpeningHours)
  openingHours: OpeningHours;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid website URL' })
  website?: string;
}
