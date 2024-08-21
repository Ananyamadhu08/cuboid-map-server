import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class AuthRepository {
  async createUser({ username, email, password }: { username: string; email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
  }

  async findUserByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  }
}

export const authRepository = new AuthRepository();
