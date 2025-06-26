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
