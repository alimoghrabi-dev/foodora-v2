import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class SelectedVariantDto {
  @IsString()
  @IsNotEmpty()
  variantId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  optionName: string;

  @IsString()
  @IsNotEmpty()
  optionId: string;

  @IsNumber()
  @IsOptional()
  price?: number;
}

export class SelectedAddonDto {
  @IsString()
  @IsNotEmpty()
  addonId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  price?: number;
}

export class AddItemToCartDto {
  @IsString()
  @IsNotEmpty()
  readonly restaurantId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly quantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedVariantDto)
  readonly selectedVariants: SelectedVariantDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedAddonDto)
  readonly selectedAddons: SelectedAddonDto[];
}
