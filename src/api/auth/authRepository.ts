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

  async findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    return prisma.refreshToken.upsert({
      where: { userId },
      update: { token: refreshToken },
      create: { userId, token: refreshToken },
    });
  }

  async findRefreshToken(userId: string) {
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { userId },
    });
    return tokenRecord?.token || null;
  }
}

export const authRepository = new AuthRepository();
