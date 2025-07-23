import { Document } from 'mongoose';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IRestaurant extends Document {
  name: string;
  cuisine: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  isPublished: boolean;
  logo: string;
  coverImage: string;
  onSale: boolean;
  saleType: 'fixed' | 'percentage';
  saleAmount: number;
  saleStartDate: Date;
  saleEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
