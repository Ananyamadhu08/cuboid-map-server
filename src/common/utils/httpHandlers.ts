import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodSchema } from "zod";

import { ServiceResponse } from "@/common/models/serviceResponse";

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  // Validate using safeParse
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const zodError = result.error;

    // Build a more detailed error message
    const errorMessage = `Invalid input: ${zodError.errors.map((e) => `${e.path.join(".")} - ${e.message}`).join(", ")}`;
    const statusCode = StatusCodes.BAD_REQUEST;

    const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode);
    return handleServiceResponse(serviceResponse, res);
  }

  next();
};
