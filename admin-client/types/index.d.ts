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
  openingHours: {
    monday: {
      open: string;
      close: string;
    };
    tuesday: {
      open: string;
      close: string;
    };
    wednesday: {
      open: string;
      close: string;
    };
    thursday: {
      open: string;
      close: string;
    };
    friday: {
      open: string;
      close: string;
    };
    saturday: {
      open: string;
      close: string;
    };
    sunday: {
      open: string;
      close: string;
    };
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
  category: {
    _id: string;
    name: string;
  };
  tags: string[];
  ingredients: string[];
  imageUrl: string;
  variants: {
    _id: string;
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
