import {
  AddMenuItemValidationSchema,
  EditItemVariantValidationSchema,
  ItemSaleValidationSchema,
  LoginValidationSchema,
  OpeningHoursChangerValidationSchema,
  PublishRestaurantValidationSchema,
  RestaurantManagementValidationSchema,
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
      parsedData,
      {
        headers: {
          "Content-Type": "application/json",
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
      parsedData.variants.forEach((variant) =>
        formData.append("variants", JSON.stringify(variant))
      );
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

export const getCategories = async () => {
  try {
    const response = await ServerEndpoint.get(
      "/admin-restaurant/get-categories"
    );

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your categories!"
      );
    }

    return response.data;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const publishRestaurantAction = async (
  data: z.infer<typeof PublishRestaurantValidationSchema>
) => {
  try {
    const parsedData = PublishRestaurantValidationSchema.parse(data);

    const formData = new FormData();

    formData.append("name", parsedData.name);
    formData.append("description", parsedData.description);
    formData.append("cuisine", parsedData.cuisine);

    formData.append("address[street]", parsedData.address.street);
    formData.append("address[city]", parsedData.address.city);
    formData.append("address[state]", parsedData.address.state);
    formData.append("address[zipCode]", parsedData.address.zipCode);
    formData.append("address[country]", parsedData.address.country);
    if (parsedData.address.latitude !== undefined)
      formData.append("address[latitude]", String(parsedData.address.latitude));
    if (parsedData.address.longitude !== undefined)
      formData.append(
        "address[longitude]",
        String(parsedData.address.longitude)
      );

    Object.entries(parsedData.openingHours).forEach(([day, hours]) => {
      formData.append(`openingHours[${day}][open]`, hours.open || "");
      formData.append(`openingHours[${day}][close]`, hours.close || "");
    });

    formData.append("phoneNumber", parsedData.phoneNumber);
    if (parsedData.website) {
      formData.append("website", parsedData.website);
    }

    formData.append("logo", parsedData.logo);
    formData.append("coverImage", parsedData.coverImage);

    const response = await ServerEndpoint.post(
      "/admin-restaurant/publish",
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

export const manageRestaurantAction = async (
  data: z.infer<typeof RestaurantManagementValidationSchema>
) => {
  try {
    const parsedData = RestaurantManagementValidationSchema.parse(data);

    const formData = new FormData();

    formData.append("name", parsedData.name);
    formData.append("description", parsedData.description);
    formData.append("cuisine", parsedData.cuisine);

    formData.append("address[street]", parsedData.address.street);
    formData.append("address[city]", parsedData.address.city);
    formData.append("address[state]", parsedData.address.state);
    formData.append("address[zipCode]", parsedData.address.zipCode);
    formData.append("address[country]", parsedData.address.country);
    if (parsedData.address.latitude !== undefined)
      formData.append("address[latitude]", String(parsedData.address.latitude));
    if (parsedData.address.longitude !== undefined)
      formData.append(
        "address[longitude]",
        String(parsedData.address.longitude)
      );

    formData.append("phoneNumber", parsedData.phoneNumber);
    if (parsedData.website) {
      formData.append("website", parsedData.website);
    }

    formData.append("logo", parsedData.logo);
    formData.append("coverImage", parsedData.coverImage);

    const response = await ServerEndpoint.patch(
      "/admin-restaurant/manage-restaurant",
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

export const updateRestaurantOpeningHours = async (
  data: z.infer<typeof OpeningHoursChangerValidationSchema>
) => {
  try {
    const parsedData = OpeningHoursChangerValidationSchema.parse(data);

    const response = await ServerEndpoint.put(
      "/admin-restaurant/update-opening-hours",
      {
        openingHours: parsedData.openingHours,
      }
    );

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while updating your opening hours!"
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

export const createCategory = async (name: string) => {
  try {
    const response = await ServerEndpoint.post(
      "/admin-restaurant/create-category",
      { name },
      {
        headers: {
          "Content-Type": "application/json",
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

export const editCategory = async (categoryId: string, name: string) => {
  try {
    const response = await ServerEndpoint.put(
      `/admin-restaurant/edit-category/${categoryId}`,
      { name },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
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

export const deleteCategory = async (categoryId: string) => {
  try {
    const response = await ServerEndpoint.delete(
      `/admin-restaurant/delete-category/${categoryId}`,
      {
        headers: {
          "Content-Type": "application/json",
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

export const editItemVariant = async (
  variantId: string,
  data: z.infer<typeof EditItemVariantValidationSchema>
) => {
  try {
    const parsedData = EditItemVariantValidationSchema.parse(data);

    const response = await ServerEndpoint.put(
      `/admin-restaurant/edit-variant/${variantId}`,
      {
        ...parsedData,
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
          "Something went wrong while updating your variant!"
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

export const deleteVariant = async (variantId: string) => {
  try {
    const response = await ServerEndpoint.delete(
      `/admin-restaurant/delete-variant/${variantId}`,
      {
        headers: {
          "Content-Type": "application/json",
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

export const getClientMenuItemByName = async (name: string) => {
  try {
    const response = await ServerEndpoint.get(
      `/admin-restaurant/get-menu-item/${name}`
    );

    if (response.status !== 200) {
      throw new Error(response.data.message || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const editMenuItemAction = async (
  itemId: string,
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
      parsedData.variants.forEach((variant) =>
        formData.append("variants", JSON.stringify(variant))
      );
    }

    if (parsedData.image) {
      formData.append("file", parsedData.image);
    }

    const response = await ServerEndpoint.put(
      `/admin-restaurant/edit-item/${itemId}`,
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

export const deleteMenuItem = async (itemId: string) => {
  try {
    const response = await ServerEndpoint.delete(
      `/admin-restaurant/delete-item/${itemId}`,
      {
        headers: {
          "Content-Type": "application/json",
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

export const applyItemSale = async (
  itemId: string,
  data: z.infer<typeof ItemSaleValidationSchema>
) => {
  try {
    const parsedData = ItemSaleValidationSchema.parse(data);

    const response = await ServerEndpoint.patch(
      `/admin-restaurant/apply-sale/${itemId}`,
      { ...parsedData },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
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

export const removeSaleAction = async (itemId: string) => {
  try {
    const response = await ServerEndpoint.patch(
      `/admin-restaurant/remove-sale/${itemId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
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

export const getClientSaleItems = async () => {
  try {
    const response = await ServerEndpoint.get(
      "/admin-restaurant/get-sale-items"
    );

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your items!"
      );
    }

    return {
      items: response.data.items,
      activeSales: response.data.activeSales,
      expiringSoonSales: response.data.expiringSoonSales,
      upcomingSales: response.data.upcomingSales,
      totalSales: response.data.totalSales,
    };
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const getClientNotOnSaleItems = async () => {
  try {
    const response = await ServerEndpoint.get(
      "/admin-restaurant/get-not-sale-items"
    );

    if (response.status !== 200) {
      throw new Error(
        response.data.message ||
          "Something went wrong while getting your items!"
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

export const applyMenuSale = async (
  data: z.infer<typeof ItemSaleValidationSchema>
) => {
  try {
    const parsedData = ItemSaleValidationSchema.parse(data);

    const response = await ServerEndpoint.patch(
      "/admin-restaurant/apply-menu-sale",
      { ...parsedData },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
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

export const removeRestaurantSaleAction = async () => {
  try {
    const response = await ServerEndpoint.patch(
      "/admin-restaurant/remove-menu-sale",
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
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
