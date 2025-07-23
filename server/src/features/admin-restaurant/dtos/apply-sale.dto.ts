import {
  IsEnum,
  IsNumber,
  Min,
  Max,
  ValidateIf,
  IsOptional,
  IsDate,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SaleType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

@ValidatorConstraint({ name: 'IsFutureDate', async: false })
class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(date: Date) {
    return date > new Date();
  }

  defaultMessage(): string {
    return 'Sale start date must be in the future';
  }
}

function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsFutureDateConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'EndDateAfterStartDate', async: false })
export class EndDateAfterStartDate implements ValidatorConstraintInterface {
  validate(endDate: Date, args: ValidationArguments) {
    const dto = args.object as ItemSaleDto;
    return !endDate || !dto.saleStartDate || endDate > dto.saleStartDate;
  }

  defaultMessage() {
    return 'Sale end date must be after the sale start date';
  }
}

export class ItemSaleDto {
  @IsEnum(SaleType, { message: 'Sale type must be fixed or percentage' })
  saleType: SaleType;

  @IsNumber({}, { message: 'Amount is required' })
  @ValidateIf((o: ItemSaleDto) => o.saleType === SaleType.FIXED)
  @Min(0.01, { message: 'Fixed sale amount must be greater than 0' })
  @ValidateIf((o: ItemSaleDto) => o.saleType === SaleType.PERCENTAGE)
  @Min(1, { message: 'Percentage must be between 1 and 100' })
  @Max(100, { message: 'Percentage must be between 1 and 100' })
  saleAmount: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Sale start date must be a valid date' })
  @ValidateIf((o: ItemSaleDto) => !!o.saleStartDate)
  @IsFutureDate({ message: 'Sale start date must be in the future' })
  saleStartDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Sale end date must be a valid date' })
  @ValidateIf((o: ItemSaleDto) => !!o.saleStartDate && !o.saleEndDate)
  @Validate(() => EndDateAfterStartDate)
  saleEndDate?: Date;
}
