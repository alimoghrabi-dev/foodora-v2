import { getCurrentToken } from "@/lib/server";
import ServerEndpoint from "@/lib/server-endpoint";
import axios from "axios";

export const getAllCuisines = async () => {
  try {
    const token = await getCurrentToken();

    if (!token) {
      throw new Error("You're Unauthorized!");
    }

    const response = await ServerEndpoint.get("/user/get-cuisines", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your cuisines!"
      );
    }

    return {
      cuisines: response.data.cuisines,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data.message ||
          "Something went wrong while getting your cuisines",
      };
    } else if (error instanceof Error) {
      return { error: "Something went wrong while getting your cuisines" };
    }
  }
};

export const getFilteredRestaurants = async (
  sort: string | string[] | null,
  quickFilter: string | string[] | null,
  cuisine: string | string[] | null,
  price: string | string[] | null
) => {
  try {
    const token = await getCurrentToken();

    if (!token) {
      throw new Error("You're Unauthorized!");
    }

    const response = await ServerEndpoint.get(
      "/user/get-filtered-restaurants",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

    return {
      restaurants: response.data.restaurants,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data.message ||
          "Something went wrong while getting your filtered restaurants",
      };
    } else if (error instanceof Error) {
      return {
        error: "Something went wrong while getting your filtered restaurants",
      };
    }
  }
};

export const getRestaurantById = async (restaurantId: string) => {
  try {
    const token = await getCurrentToken();

    if (!token) {
      throw new Error("You're Unauthorized!");
    }

    const response = await ServerEndpoint.get(
      `/user/get-restaurant-by-id/${restaurantId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your restaurant!"
      );
    }

    return {
      restaurant: response.data.restaurant,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data.message ||
          "Something went wrong while getting your restaurant",
      };
    } else if (error instanceof Error) {
      return {
        error: "Something went wrong while getting your restaurant",
      };
    }
  }
};

export const getFavoriteRestaurants = async () => {
  try {
    const token = await getCurrentToken();

    if (!token) {
      throw new Error("You're Unauthorized!");
    }

    const response = await ServerEndpoint.get("/user/get-favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your favorite restaurants!"
      );
    }

    return {
      restaurants: response.data.restaurants,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data.message ||
          "Something went wrong while getting your favorite restaurants",
      };
    } else if (error instanceof Error) {
      return {
        error: "Something went wrong while getting your favorite restaurants",
      };
    }
  }
};

export const getUserCarts = async () => {
  try {
    const token = await getCurrentToken();

    if (!token) {
      throw new Error("You're Unauthorized!");
    }

    const response = await ServerEndpoint.get("/cart/get-carts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your carts!"
      );
    }

    return {
      carts: response.data.carts,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data.message ||
          "Something went wrong while getting your carts",
      };
    } else if (error instanceof Error) {
      return {
        error: "Something went wrong while getting your carts",
      };
    }
  }
};

export const getCartById = async (cartId: string) => {
  try {
    const token = await getCurrentToken();

    if (!token) {
      throw new Error("You're Unauthorized!");
    }

    const response = await ServerEndpoint.get(`/cart/get-cart/${cartId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.data.message || "Something went wrong while getting your cart!"
      );
    }

    return {
      cart: response.data.cart,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data.message ||
          "Something went wrong while getting your cart",
      };
    } else if (error instanceof Error) {
      return {
        error: "Something went wrong while getting your cart",
      };
    }
  }
};
