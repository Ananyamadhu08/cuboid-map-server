import jwt from "jsonwebtoken";
import { env } from "./envConfig";

const secret = env.JWT_SECRET;

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, secret, { expiresIn: "1h" });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
}
