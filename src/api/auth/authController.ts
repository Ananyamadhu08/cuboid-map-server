import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { authService } from "./authService";

class AuthController {
  public register: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await authService.register(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public login: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await authService.login(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public refreshToken: RequestHandler = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const serviceResponse = await authService.refresh(refreshToken);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const authController = new AuthController();
