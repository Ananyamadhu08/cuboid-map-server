import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { mapCaptureRepository } from "./mapCaptureRepository";

export class MapCaptureService {
  async saveCapture(
    userId: string,
    data: { longitude: number; latitude: number; zoom: number; bearing: number; pitch: number; imageUrl: string },
  ) {
    try {
      const capture = await mapCaptureRepository.saveCapture({ userId, ...data });
      return ServiceResponse.success("Map capture saved successfully", capture, StatusCodes.CREATED);
    } catch (error) {
      console.error("Error saving map capture:", error);
      return ServiceResponse.failure("Failed to save map capture.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllCaptures() {
    try {
      const captures = await mapCaptureRepository.findAllCaptures();
      return ServiceResponse.success("Map captures retrieved successfully", captures, StatusCodes.OK);
    } catch (error) {
      console.error("Error retrieving map captures:", error);
      return ServiceResponse.failure("Failed to retrieve map captures.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getCaptureById(id: string) {
    try {
      const capture = await mapCaptureRepository.findCaptureById(id);
      if (!capture) {
        return ServiceResponse.failure("Map capture not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Map capture retrieved successfully", capture, StatusCodes.OK);
    } catch (error) {
      console.error("Error retrieving map capture:", error);
      return ServiceResponse.failure("Failed to retrieve map capture.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const mapCaptureService = new MapCaptureService();
