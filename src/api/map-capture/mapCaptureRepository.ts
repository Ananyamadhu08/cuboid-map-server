import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MapCaptureRepository {
  async saveCapture(data: {
    userId: string;
    title: string;
    longitude: number;
    latitude: number;
    zoom: number;
    bearing: number;
    pitch: number;
    imageUrl: string;
  }) {
    return prisma.mapCapture.create({
      data,
    });
  }

  async findAllCaptures() {
    return prisma.mapCapture.findMany();
  }

  async findAllCapturesByUserId(userId: string) {
    return prisma.mapCapture.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findCaptureById(id: string) {
    return prisma.mapCapture.findUnique({
      where: { id },
    });
  }

  async findLatestCaptureByUserId(userId: string) {
    return prisma.mapCapture.findFirst({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
