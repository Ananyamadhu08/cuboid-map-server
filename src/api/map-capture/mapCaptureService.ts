import { ServiceResponse } from "@/common/models/serviceResponse";
import type { MapCapture } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import NodeCache from "node-cache";
import { MapCaptureRepository } from "./mapCaptureRepository";

export class MapCaptureService {
  private mapCaptureRepository: MapCaptureRepository;
  private cache: NodeCache;

  constructor(repository: MapCaptureRepository = new MapCaptureRepository()) {
    this.mapCaptureRepository = repository;
    this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
  }

  async saveCapture(
    userId: string,
    data: {
      title: string;
      longitude: number;
      latitude: number;
      zoom: number;
      bearing: number;
      pitch: number;
      imageUrl: string;
    },
  ) {
    try {
      const capture = await this.mapCaptureRepository.saveCapture({ userId, ...data });
      return ServiceResponse.success("Map capture saved successfully", capture, StatusCodes.CREATED);
    } catch (error) {
      console.error("Error saving map capture:", error);
      return ServiceResponse.failure("Failed to save map capture.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllCaptures() {
    try {
      const captures = await this.mapCaptureRepository.findAllCaptures();
      return ServiceResponse.success("Map captures retrieved successfully", captures, StatusCodes.OK);
    } catch (error) {
      console.error("Error retrieving map captures:", error);
      return ServiceResponse.failure("Failed to retrieve map captures.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllCapturesByUserId(userId: string) {
    try {
      const captures = await this.mapCaptureRepository.findAllCapturesByUserId(userId);

      return ServiceResponse.success("Captures retrieved successfully", captures);
    } catch (error) {
      return ServiceResponse.failure("Failed to retrieve map captures", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getCaptureById(id: string) {
    try {
      const capture = await this.mapCaptureRepository.findCaptureById(id);
      if (!capture) {
        return ServiceResponse.failure("Map capture not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Map capture retrieved successfully", capture, StatusCodes.OK);
    } catch (error) {
      console.error("Error retrieving map capture:", error);
      return ServiceResponse.failure("Failed to retrieve map capture.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getLatestCaptureByUserId(userId: string) {
    try {
      const latestCapture = await this.mapCaptureRepository.findLatestCaptureByUserId(userId);

      if (!latestCapture) {
        return ServiceResponse.failure("No captures found for this user.", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success("Latest map capture retrieved successfully", latestCapture, StatusCodes.OK);
    } catch (error) {
      console.log("Error retrieving latest map capture:", error);

      return ServiceResponse.failure("Failed to retrieve latest map capture.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getTopCapturedRegions(userId: string) {
    const cacheKey = `topCapturedRegions_${userId}`;
    const cachedData = this.cache.get(cacheKey);

    if (cachedData) {
      return ServiceResponse.success("Top captured regions retrieved from cache", cachedData, StatusCodes.OK);
    }

    try {
      const captures = await this.mapCaptureRepository.findAllCapturesByUserId(userId);

      if (captures.length === 0) {
        return ServiceResponse.failure("No captures found for this user.", null, StatusCodes.NOT_FOUND);
      }

      // Frequency map to keep track of region captures
      const regionFrequencyMap = new Map<
        string,
        { frequency: number; title: string; imageUrl: string; captures: MapCapture[] }
      >();

      captures.forEach((capture) => {
        const regionKey = `${capture.longitude}-${capture.latitude}`;
        if (regionFrequencyMap.has(regionKey)) {
          const existingEntry = regionFrequencyMap.get(regionKey)!;
          existingEntry.frequency += 1;
          existingEntry.captures.push(capture);
        } else {
          regionFrequencyMap.set(regionKey, {
            frequency: 1,
            title: capture.title,
            imageUrl: capture.imageUrl,
            captures: [capture],
          });
        }
      });

      // Extracting top 3 regions based on frequency
      const topRegions = Array.from(regionFrequencyMap.entries())
        .sort((a, b) => b[1].frequency - a[1].frequency)
        .slice(0, 3)
        .map(([region, { frequency, title, imageUrl, captures }]) => {
          const [longitude, latitude] = region.split("-").map(Number);
          return { longitude, latitude, frequency, title, imageUrl, captures };
        });

      // Saving the top regions in the cache
      this.cache.set(cacheKey, topRegions);

      return ServiceResponse.success("Top captured regions retrieved successfully", topRegions, StatusCodes.OK);
    } catch (error) {
      console.log("Error retrieving top captured regions:", error);
      return ServiceResponse.failure(
        "Failed to retrieve top captured regions.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const mapCaptureService = new MapCaptureService();
