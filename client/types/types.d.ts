interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  favorites: string[];
  carts: ICart[];
  createdAt: Date;
  updatedAt: Date;
}

interface IRestaurant {
  _id: string;
  name: string;
  cuisine: string;
  price: string;
  description: string;
  coverImage: string;
  logo: string;
  pricingDescription: string;
  rating: number;
  ratingCount: number;
  onSale: boolean;
  saleAmount: number;
  saleStartDate: Date;
  saleEndDate: Date;
  saleType: "fixed" | "percentage";
  deliveryTimeRange: [number, number];
  freeDeliveryFirstOrder: boolean;
  isClosed: boolean;
  isAutoClosed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IMenuItem {
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

interface ICart {
  _id: string;
  items: {
    itemId: IMenuItem;
    quantity: number;
    variants: {
      name: string;
      optionName: string;
      optionId: string;
      price: number;
    }[];
  }[];
}
