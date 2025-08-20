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
  onSale: boolean;
  saleType: "fixed" | "percentage";
  saleAmount?: number;
  saleStartDate?: Date;
  saleEndDate?: Date;
  freeDeliveryFirstOrder: boolean;
  pricingDescription: "$" | "$$" | "$$$";
  deliveryTimeRange: [number, number];
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
    options: {
      _id: string;
      name: string;
      price: number;
    }[];
    isRequired: boolean;
    isAvailable: boolean;
  }[];
  addons: {
    _id: string;
    name: string;
    price: number;
  }[];
  rating: number;
  reviewsCount: number;
  onSale: boolean;
  saleType: "fixed" | "percentage";
  saleAmount?: number;
  saleStartDate?: Date;
  saleEndDate?: Date;
  isEdited: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
