import { LoginValidationSchema } from "../validators";
import ServerEndpoint from "../server-endpoint";
import axios from "axios";
import { z } from "zod";

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
