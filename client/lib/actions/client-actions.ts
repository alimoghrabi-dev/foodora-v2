import { LoginValidationSchema, RegisterValidationSchema } from "../validators";
import ServerEndpoint from "../server-endpoint";
import axios from "axios";
import z from "zod/v3";

export const registerAction = async (
  data: z.infer<typeof RegisterValidationSchema>
) => {
  try {
    const parsedData = RegisterValidationSchema.parse(data);

    const response = await ServerEndpoint.post("/auth/register", parsedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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

export const loginAction = async (
  data: z.infer<typeof LoginValidationSchema>
) => {
  try {
    const parsedData = LoginValidationSchema.parse(data);

    const response = await ServerEndpoint.post("/auth/login", parsedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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
