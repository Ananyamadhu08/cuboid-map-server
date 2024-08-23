"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/api/map-capture/mapCaptureRepository.ts
var mapCaptureRepository_exports = {};
__export(mapCaptureRepository_exports, {
  MapCaptureRepository: () => MapCaptureRepository
});
module.exports = __toCommonJS(mapCaptureRepository_exports);
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var MapCaptureRepository = class {
  async saveCapture(data) {
    return prisma.mapCapture.create({
      data
    });
  }
  async findAllCaptures() {
    return prisma.mapCapture.findMany();
  }
  async findAllCapturesByUserId(userId, skip, take) {
    return prisma.mapCapture.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take
    });
  }
  async findCaptureById(id) {
    return prisma.mapCapture.findUnique({
      where: { id }
    });
  }
  async findLatestCaptureByUserId(userId) {
    return prisma.mapCapture.findFirst({
      where: { userId },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
  async findTopCapturedRegions(userId) {
    const result = await prisma.mapCapture.groupBy({
      by: ["longitude", "latitude", "title", "imageUrl", "pitch", "zoom", "bearing"],
      where: { userId },
      _count: {
        longitude: true
      },
      orderBy: {
        _count: {
          longitude: "desc"
        }
      },
      take: 3
      // Get top 3 regions
    });
    return result.map((region) => ({
      longitude: region.longitude,
      latitude: region.latitude,
      frequency: region._count.longitude,
      title: region.title,
      imageUrl: region.imageUrl,
      pitch: region.pitch,
      zoom: region.zoom,
      bearing: region.bearing
    }));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MapCaptureRepository
});
//# sourceMappingURL=mapCaptureRepository.js.map