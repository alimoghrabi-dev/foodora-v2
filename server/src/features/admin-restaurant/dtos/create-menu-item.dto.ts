import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class VariantOptionDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsOptional()
  readonly price?: number;
}

export class VariantDto {
  @IsString()
  @IsNotEmpty({ message: 'Variant name is required' })
  readonly name: string;

  @IsArray()
  @Type(() => VariantOptionDto)
  @IsNotEmpty({ message: 'Variant options are required' })
  readonly options: VariantOptionDto[];

  @IsOptional()
  @IsBoolean()
  readonly isRequired?: boolean = true;

  @IsOptional()
  @IsBoolean()
  readonly isAvailable?: boolean = true;
}

export class AddonDto {
  @IsString()
  @IsNotEmpty({ message: 'Addon name is required' })
  readonly name: string;

  @IsNumber()
  @IsOptional()
  readonly price?: number;
}

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  readonly description: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly price: string;

  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly ingredients?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as VariantDto[];
      } catch {
        return [];
      }
    }
    return value as VariantDto[];
  })
  @IsArray()
  @Type(() => VariantDto)
  readonly variants?: VariantDto[];

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as AddonDto[];
      } catch {
        return [];
      }
    }
    return value as AddonDto[];
  })
  @IsArray()
  @Type(() => AddonDto)
  readonly addons?: AddonDto[];

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  readonly isAvailable?: boolean;
}
