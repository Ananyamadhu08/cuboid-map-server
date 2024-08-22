import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MapCaptureRepository {
  async saveCapture(data: {
    userId: string;
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

  async findCaptureById(id: string) {
    return prisma.mapCapture.findUnique({
      where: { id },
    });
  }
}

export const mapCaptureRepository = new MapCaptureRepository();
