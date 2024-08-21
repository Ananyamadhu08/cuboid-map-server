import { ServiceResponse } from "@/common/models/serviceResponse";
import { generateToken } from "@/common/utils/jwtUtils";
import { logger } from "@/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import type { z } from "zod";
import type { AuthRequestSchema } from "./authModel";
import { authRepository } from "./authRepository";

// Mapping Prisma constraint names to user-friendly field names for better error messages
const constraintFieldMap: { [key: string]: string } = {
  User_email_key: "email",
  User_username_key: "username",
};

class AuthService {
  async register({ username, password, email }: z.infer<typeof AuthRequestSchema>) {
    try {
      const user = await authRepository.createUser({ username, email, password });

      const token = generateToken(user.id);
      return ServiceResponse.success("Registration successful", { accessToken: token });
    } catch (error) {
      const errorMessage = `Error Registering User: $${(error as Error).message}`;
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          // Unique constraint failed
          const fieldName = constraintFieldMap[error.meta?.target as string] || "field";

          logger.error(errorMessage);

          return ServiceResponse.failure(
            `Registration failed: The ${fieldName} is already in use.`,
            null,
            StatusCodes.BAD_REQUEST,
          );
        }
      }

      logger.error(errorMessage);
      // For other errors, return a generic error message
      return ServiceResponse.failure(
        "Registration failed: An unexpected error occurred.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login({ username, password }: z.infer<typeof AuthRequestSchema>) {
    const user = await authRepository.findUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return ServiceResponse.failure("Invalid username or password", null, StatusCodes.UNAUTHORIZED);
    }

    const token = generateToken(user.id);
    return ServiceResponse.success("Login successful", { accessToken: token });
  }
}

export const authService = new AuthService();
