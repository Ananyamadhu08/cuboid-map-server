import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type MapCapture = z.infer<typeof MapCaptureSchema>;

export const MapCaptureSchema = z
  .object({
    longitude: z.number(),
    latitude: z.number(),
    zoom: z.number(),
    bearing: z.number(),
    pitch: z.number(),
    imageUrl: z.string().url(),
  })
  .openapi("MapCaptureRequest");

export const MapCaptureResponseSchema = z
  .object({
    id: z.string().openapi({ description: "The unique identifier of the map capture" }),
    userId: z.string().openapi({ description: "The ID of the user who created the capture" }),
    longitude: z.number(),
    latitude: z.number(),
    zoom: z.number(),
    bearing: z.number(),
    pitch: z.number(),
    imageUrl: z.string().url(),
    createdAt: z.string().openapi({ description: "Timestamp of when the capture was created" }),
  })
  .openapi("MapCaptureResponse");
