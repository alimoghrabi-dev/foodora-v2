import { removeSessionOnLogout } from "@/lib/remove-session";
import ServerEndpoint from "@/lib/server-endpoint";
import axios from "axios";

export const logout = async () => {
  try {
    const response = await ServerEndpoint.post("/admin-restaurant/logout");

    if (response.status !== 200) {
      throw new Error(response.data.message || "Something went wrong");
    }

    await removeSessionOnLogout();
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const getClientAllCuisines = async (query?: string | null) => {
  try {
    const response = await ServerEndpoint.get("/user/get-cuisines", {
      params: {
        query,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your cuisines!"
      );
    }

    return response.data.cuisines;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const getClientFilteredRestaurants = async (
  sort: string | string[] | null,
  quickFilter: string | string[] | null,
  cuisine: string | string[] | null,
  price: string | string[] | null
) => {
  try {
    const response = await ServerEndpoint.get(
      "/user/get-filtered-restaurants",
      {
        params: {
          sort,
          quickFilter,
          cuisine,
          price,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your filtered restaurants!"
      );
    }

    return response.data.restaurants;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const getClientRestaurantById = async (restaurantId: string) => {
  try {
    const response = await ServerEndpoint.get(
      `/user/get-restaurant-by-id/${restaurantId}`
    );

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your restaurant!"
      );
    }

    return response.data.restaurant;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const getClientRestaurantCategories = async (restaurantId: string) => {
  try {
    const response = await ServerEndpoint.get(
      `/user/get-restaurant-categories/${restaurantId}`
    );

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting categories!"
      );
    }

    return response.data.categories;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const getClientRestaurantMenuItems = async (
  restaurantId: string,
  categoryId: string | undefined
) => {
  try {
    const response = await ServerEndpoint.post(
      `/user/get-restaurant-items/${restaurantId}`,
      {
        categoryId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting restaurant items!"
      );
    }

    return response.data.items;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const addItemToCart = async (
  itemId: string,
  data: {
    restaurantId: string;
    quantity: number;
    selectedVariants: {
      name: string;
      optionName: string;
      optionId: string;
      price: number;
    }[];
    selectedAddons: {
      addonId: string;
      name: string;
      price: number;
    }[];
  }
) => {
  try {
    const response = await ServerEndpoint.post(
      `/cart/add-item/${itemId}`,
      {
        ...data,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 201) {
      throw new Error(
        response.data.message ||
          "Something went wrong while adding item to cart!"
      );
    }
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const removeItemFromCart = async (
  itemId: string,
  restaurantId: string
) => {
  try {
    const response = await ServerEndpoint.patch(
      `/cart/remove-item/${itemId}`,
      {
        restaurantId: restaurantId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 201) {
      throw new Error(
        response.data.message ||
          "Something went wrong while removing item from cart!"
      );
    }
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const addFavoriteAction = async (restaurantId: string) => {
  try {
    const response = await ServerEndpoint.patch(
      `/user/add-favorite/${restaurantId}`
    );

    if (response.status !== 201) {
      throw new Error(
        response.data.message ||
          "Something went wrong while adding restaurant to your favorites!"
      );
    }
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const removeFavoriteAction = async (restaurantId: string) => {
  try {
    const response = await ServerEndpoint.patch(
      `/user/remove-favorite/${restaurantId}`
    );

    if (response.status !== 201) {
      throw new Error(
        response.data.message ||
          "Something went wrong while removing restaurant to your favorites!"
      );
    }
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const getClientFavoriteRestaurants = async () => {
  try {
    const response = await ServerEndpoint.get("/user/get-favorites");

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your favorite restaurants!"
      );
    }

    return response.data.restaurants;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};
