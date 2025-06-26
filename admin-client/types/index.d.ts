interface IRestaurant {
  _id: string;
  name: string;
  description: string;
  cuisine: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  isEmailVerified: boolean;
  isPublished: boolean;
  phoneNumber: string;
  website: string;
  logo: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

interface IItem {
  _id: string;
  restaurantId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  ingredients: string[];
  imageUrl: string;
  variants: {
    name: string;
    price: number;
    isAvailable: boolean;
  }[];
  rating: number;
  reviewsCount: number;
  isEdited: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
