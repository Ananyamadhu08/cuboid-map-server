import { ServiceResponse } from "@/common/models/serviceResponse";
import { generateRefreshToken, generateToken, verifyToken } from "@/common/utils/jwtUtils";
import { logger } from "@/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
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

      const accessToken = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      await authRepository.saveRefreshToken(user.id, refreshToken);

      return ServiceResponse.success("Registration successful", {
        accessToken,
        refreshToken,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      const errorMessage = `Error Registering User: ${(error as Error).message}`;
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
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

    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await authRepository.saveRefreshToken(user.id, refreshToken);

    return ServiceResponse.success("Login successful", {
      accessToken,
      refreshToken,
      username: user.username,
      email: user.email,
    });
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = verifyToken(refreshToken, "refresh");
      const userId = decoded.userId;

      const user = await authRepository.findUserById(userId);
      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.UNAUTHORIZED);
      }

      const storedRefreshToken = await authRepository.findRefreshToken(userId);
      if (refreshToken !== storedRefreshToken) {
        return ServiceResponse.failure("Invalid refresh token", null, StatusCodes.FORBIDDEN);
      }

      const accessToken = generateToken(userId);
      return ServiceResponse.success("Access token refreshed", { accessToken });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // If the refresh token is expired, return 403 Forbidden
        return ServiceResponse.failure("Refresh token expired", null, StatusCodes.FORBIDDEN);
      } else if (error instanceof JsonWebTokenError) {
        // If the refresh token is otherwise invalid, return 403 Forbidden
        return ServiceResponse.failure("Invalid refresh token", null, StatusCodes.FORBIDDEN);
      } else if (error instanceof Error) {
        logger.error("Error refreshing token:", error.message, error.stack);
        return ServiceResponse.failure("Error processing refresh token", null, StatusCodes.INTERNAL_SERVER_ERROR);
      } else {
        logger.error("Unknown error refreshing token");
        return ServiceResponse.failure("Error processing refresh token", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }
    }
  }
}

export const authService = new AuthService();
