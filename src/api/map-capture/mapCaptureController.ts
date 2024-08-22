import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { User } from "@prisma/client";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { mapCaptureService } from "./mapCaptureService";

interface MapCaptureRequest extends Request {
  user?: User;
}

class MapCaptureController {
  async saveCapture(req: MapCaptureRequest, res: Response) {
    const userId = req.user?.id as string;

    if (!userId) {
      return ServiceResponse.failure("User ID is missing from the request.", null, StatusCodes.BAD_REQUEST);
    }

    const serviceResponse = await mapCaptureService.saveCapture(userId, req.body);

    return handleServiceResponse(serviceResponse, res);
  }

  async getAllCaptures(req: Request, res: Response) {
    const serviceResponse = await mapCaptureService.getAllCaptures();

    return handleServiceResponse(serviceResponse, res);
  }

  async getCaptureById(req: Request, res: Response) {
    const { id } = req.params;

    const serviceResponse = await mapCaptureService.getCaptureById(id);

    return handleServiceResponse(serviceResponse, res);
  }
}

export const mapCaptureController = new MapCaptureController();
