import axios from "axios";
import ServerEndpoint from "../server-endpoint";
import { getCurrentToken } from "../server";

export const getMenuItems = async () => {
  try {
    const token = await getCurrentToken();

    if (!token) {
      throw new Error("You're Unauthorized!");
    }

    const response = await ServerEndpoint.get("/admin-restaurant/get-items", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your menu items!"
      );
    }

    return { items: response.data.menuItems };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data.message ||
          "Something went wrong while getting your menu items",
      };
    } else if (error instanceof Error) {
      return { error: "Something went wrong while getting your menu items" };
    }
  }
};

export const getMenuItemByName = async (title: string) => {
  try {
    const token = await getCurrentToken();

    if (!token) {
      throw new Error("You're Unauthorized!");
    }

    const response = await ServerEndpoint.get(
      `/admin-restaurant/get-menu-item/${title}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your menu item!"
      );
    }

    return { item: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data.message ||
          "Something went wrong while getting your menu item",
      };
    } else if (error instanceof Error) {
      return { error: "Something went wrong while getting your menu item" };
    }
  }
};

export const getOnSaleItems = async () => {
  try {
    const token = await getCurrentToken();

    if (!token) {
      throw new Error("You're Unauthorized!");
    }

    const response = await ServerEndpoint.get(
      "/admin-restaurant/get-sale-items",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your sale menu items!"
      );
    }

    return {
      data: {
        items: response.data.items,
        activeSales: response.data.activeSales,
        expiringSoonSales: response.data.expiringSoonSales,
        upcomingSales: response.data.upcomingSales,
        totalSales: response.data.totalSales,
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data.message ||
          "Something went wrong while getting your sale menu items",
      };
    } else if (error instanceof Error) {
      return {
        error: "Something went wrong while getting your sale menu items",
      };
    }
  }
};
