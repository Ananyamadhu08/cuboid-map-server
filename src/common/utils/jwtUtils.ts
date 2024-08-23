import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { env } from "./envConfig";

const secret = env.JWT_SECRET;

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, secret, { expiresIn: "1d" }); // Access token valid for 1 day
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, secret, { expiresIn: "7d" }); // Refresh token valid for 7 days
}

export function verifyToken(token: string, type: "access" | "refresh" = "access"): any {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new TokenExpiredError("Token expired", error.expiredAt);
    } else if (error instanceof JsonWebTokenError) {
      throw new JsonWebTokenError("Invalid token");
    } else {
      throw new Error("Token verification failed");
    }
  }
}
