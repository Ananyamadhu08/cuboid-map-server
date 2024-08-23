import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authenticateToken } from "@/common/middleware/authenticateToken";
import { validateRequest } from "@/common/utils/httpHandlers";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { mapCaptureController } from "./mapCaptureController";
import { MapCaptureResponseSchema, MapCaptureSchema } from "./mapCaptureModel";

export const mapCaptureRegistry = new OpenAPIRegistry();
export const mapCaptureRouter: Router = express.Router();

mapCaptureRegistry.register("MapCapture", MapCaptureSchema);

// Authenticate all routes in this router
mapCaptureRouter.use(authenticateToken);

// POST save map capture
mapCaptureRegistry.registerPath({
  method: "post",
  path: "/map-captures",
  tags: ["Map Capture"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: MapCaptureSchema,
        },
      },
    },
  },
  responses: createApiResponse(MapCaptureResponseSchema, "Map capture saved successfully"),
});

// GET all captures
mapCaptureRegistry.registerPath({
  method: "get",
  path: "/map-captures",
  tags: ["Map Capture"],
  responses: createApiResponse(MapCaptureResponseSchema.array(), "Map captures retrieved successfully"), // Updated to .array()
});

// GET latest map capture
mapCaptureRegistry.registerPath({
  method: "get",
  path: "/map-captures/user/latest",
  tags: ["Map Capture"],
  responses: createApiResponse(MapCaptureResponseSchema, "Latest map capture retrieved successfully"),
});

// GET top regions
mapCaptureRegistry.registerPath({
  method: "get",
  path: "/map-captures/top-regions",
  tags: ["Map Capture"],
  responses: createApiResponse(MapCaptureResponseSchema.array(), "Top captured regions retrieved successfully"), // Updated to .array()
});

// GET specific capture by ID
mapCaptureRegistry.registerPath({
  method: "get",
  path: "/map-captures/{id}",
  tags: ["Map Capture"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: createApiResponse(MapCaptureResponseSchema, "Map capture retrieved successfully"),
});

// POST endpoint to save the map capture
mapCaptureRouter.post("/", validateRequest(MapCaptureSchema), mapCaptureController.saveCapture);

// GET endpoint to retrieve all map captures of the user
mapCaptureRouter.get("/", mapCaptureController.getAllUserCaptures);

// GET endpoint to retrieve the latest map capture
mapCaptureRouter.get("/user/latest", mapCaptureController.getLatestCaptureByUserId);

// GET endpoint to retrieve top regions
mapCaptureRouter.get("/top-regions", mapCaptureController.getTopCapturedRegions);

// GET endpoint to retrieve a specific map capture by ID
mapCaptureRouter.get("/:id", mapCaptureController.getCaptureById); // This must be last to avoid conflicts
