import { Document } from 'mongoose';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  favorites: string[];
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
  openingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  saleStartDate: Date;
  saleEndDate: Date;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
