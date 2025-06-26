import {
  AddMenuItemValidationSchema,
  LoginValidationSchema,
} from "../validators";
import { removeSessionOnLogout } from "../remove-session";
import ServerEndpoint from "../server-endpoint";
import axios from "axios";
import * as z from "zod";

export const loginAdminAction = async (
  data: z.infer<typeof LoginValidationSchema>
) => {
  try {
    const parsedData = LoginValidationSchema.parse(data);

    const response = await ServerEndpoint.post(
      "/admin-restaurant/login",
      parsedData
    );

    if (response.status !== 201) {
      throw new Error(response.data.message || "Something went wrong");
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

export const createMenuItemAction = async (
  data: z.infer<typeof AddMenuItemValidationSchema>
) => {
  try {
    const parsedData = AddMenuItemValidationSchema.parse(data);

    const formData = new FormData();

    formData.append("title", parsedData.title);
    formData.append("description", parsedData.description);
    formData.append("price", parsedData.price.toString());
    formData.append("category", parsedData.category);
    formData.append("isAvailable", String(parsedData.isAvailable ?? false));

    if (parsedData.tags && parsedData.tags.length > 0) {
      parsedData.tags.forEach((tag) => formData.append("tags", tag));
    }

    if (parsedData.ingredients && parsedData.ingredients.length > 0) {
      parsedData.ingredients.forEach((ingredient) =>
        formData.append("ingredients", ingredient)
      );
    }

    if (parsedData.variants && parsedData.variants.length > 0) {
      formData.append("variants", JSON.stringify(data.variants));
    }

    if (parsedData.image) {
      formData.append("file", parsedData.image);
    }

    const response = await ServerEndpoint.post(
      "/admin-restaurant/create-item",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status !== 201) {
      throw new Error(response.data.message || "Something went wrong");
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

export const getClientMenuItems = async () => {
  try {
    const response = await ServerEndpoint.get("/admin-restaurant/get-items");

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your menu items!"
      );
    }

    return response.data.menuItems;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};
