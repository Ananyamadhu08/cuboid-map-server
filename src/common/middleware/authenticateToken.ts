import type { User } from "@prisma/client";
import type { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { verifyToken } from "../utils/jwtUtils";
import { ServiceResponse } from "./../models/serviceResponse";
import type { AuthenticatedRequest } from "./../types";

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(ServiceResponse.failure("Access denied. No token provided.", null, StatusCodes.UNAUTHORIZED));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token) as { userId: string; iat: number; exp: number };
    req.user = { id: decoded.userId } as User;

    console.log("Decoded user from token:", decoded);
    console.log("User ID:", req.user.id);

    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      console.error("Token expired:", err.message);
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(ServiceResponse.failure("Token expired.", null, StatusCodes.UNAUTHORIZED));
    } else if (err instanceof JsonWebTokenError) {
      console.error("Invalid token:", err.message);
      return res
        .status(StatusCodes.FORBIDDEN)
        .json(ServiceResponse.failure("Invalid token.", null, StatusCodes.FORBIDDEN));
    } else {
      console.error("Token verification failed:", err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ServiceResponse.failure("Token verification failed.", null, StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
};
