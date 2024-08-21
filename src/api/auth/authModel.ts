import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const AuthRequestSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username is required and must be at least 3 characters" })
      .openapi({ example: "user123" }),
    password: z
      .string()
      .min(8, { message: "Password is required and must be at least 8 characters" })
      .openapi({ example: "securepassword" }),
    email: z.string().email({ message: "A valid email is required" }).openapi({ example: "user@example.com" }),
  })
  .openapi("AuthRequest");

export const AuthResponseSchema = z
  .object({
    accessToken: z.string().openapi({ example: "jwt.token.here" }),
  })
  .openapi("AuthResponse");
