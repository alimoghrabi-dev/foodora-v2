import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterRestaurantDto {
  @IsString()
  @IsNotEmpty({ message: 'Restaurant name is required' })
  @Matches(/^[A-Za-zÀ-ÿ '-]+$/, {
    message: 'Restaurant name must contain only letters',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty({ message: 'Cuisine is required' })
  @Matches(/^[A-Za-zÀ-ÿ '-]+$/, {
    message: 'Last name must contain only letters',
  })
  @MinLength(2, { message: 'Cuisine is too short' })
  @MaxLength(30, { message: 'Cuisine is too long' })
  readonly cuisine: string;

  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: 'Password must contain at least one special character',
  })
  readonly password: string;
}
