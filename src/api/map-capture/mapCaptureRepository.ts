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

  async findAllCapturesByUserId(userId: string, skip: number, take: number) {
    return prisma.mapCapture.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
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

  async findTopCapturedRegions(userId: string) {
    const result = await prisma.mapCapture.groupBy({
      by: ["longitude", "latitude", "title", "imageUrl", "pitch", "zoom", "bearing"],
      where: { userId },
      _count: {
        longitude: true,
      },
      orderBy: {
        _count: {
          longitude: "desc",
        },
      },
      take: 3, // Get top 3 regions
    });

    return result.map((region) => ({
      longitude: region.longitude,
      latitude: region.latitude,
      frequency: region._count.longitude,
      title: region.title,
      imageUrl: region.imageUrl,
      pitch: region.pitch,
      zoom: region.zoom,
      bearing: region.bearing,
    }));
  }
}
