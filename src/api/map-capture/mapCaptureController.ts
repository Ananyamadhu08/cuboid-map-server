import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { User } from "@prisma/client";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { mapCaptureService } from "./mapCaptureService";

interface MapCaptureRequest extends Request {
  user?: User;
}

export interface LatestMapCaptureRequest extends Request {
  user?: User;
}

class MapCaptureController {
  async saveCapture(req: MapCaptureRequest, res: Response) {
    const userId = req.user?.id as string;

    if (!userId) {
      return ServiceResponse.failure("User ID is missing from the request.", null, StatusCodes.BAD_REQUEST);
    }

    const { title, longitude, latitude, zoom, bearing, pitch, imageUrl } = req.body;

    if (!title || !longitude || !latitude || !imageUrl) {
      return ServiceResponse.failure("Missing required fields in the request.", null, StatusCodes.BAD_REQUEST);
    }

    const serviceResponse = await mapCaptureService.saveCapture(userId, {
      title,
      longitude,
      latitude,
      zoom,
      bearing,
      pitch,
      imageUrl,
    });

    return handleServiceResponse(serviceResponse, res);
  }

  async getAllUserCaptures(req: MapCaptureRequest, res: Response) {
    const userId = req.user?.id as string;

    if (!userId) {
      return ServiceResponse.failure("User ID is missing from the request.", null, StatusCodes.BAD_REQUEST);
    }

    const serviceResponse = await mapCaptureService.getAllCapturesByUserId(userId);

    return handleServiceResponse(serviceResponse, res);
  }

  async getCaptureById(req: Request, res: Response) {
    const { id } = req.params;

    const serviceResponse = await mapCaptureService.getCaptureById(id);

    return handleServiceResponse(serviceResponse, res);
  }

  async getLatestCaptureByUserId(req: LatestMapCaptureRequest, res: Response) {
    const userId = req.user?.id as string;

    if (!userId) {
      return ServiceResponse.failure("User ID is missing from the request.", null, StatusCodes.BAD_REQUEST);
    }

    const serviceResponse = await mapCaptureService.getLatestCaptureByUserId(userId);
    return handleServiceResponse(serviceResponse, res);
  }

  async getTopCapturedRegions(req: MapCaptureRequest, res: Response) {
    const userId = req.user?.id as string;

    if (!userId) {
      return ServiceResponse.failure("User ID is missing from the request.", null, StatusCodes.BAD_REQUEST);
    }

    const serviceResponse = await mapCaptureService.getTopCapturedRegions(userId);
    return handleServiceResponse(serviceResponse, res);
  }
}

export const mapCaptureController = new MapCaptureController();
