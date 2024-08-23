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

// src/api/map-capture/mapCaptureModel.ts
var mapCaptureModel_exports = {};
__export(mapCaptureModel_exports, {
  MapCaptureResponseSchema: () => MapCaptureResponseSchema,
  MapCaptureSchema: () => MapCaptureSchema
});
module.exports = __toCommonJS(mapCaptureModel_exports);
var import_zod_to_openapi = require("@asteasolutions/zod-to-openapi");
var import_zod = require("zod");
(0, import_zod_to_openapi.extendZodWithOpenApi)(import_zod.z);
var MapCaptureSchema = import_zod.z.object({
  title: import_zod.z.string().min(1, "Title is required"),
  longitude: import_zod.z.number(),
  latitude: import_zod.z.number(),
  zoom: import_zod.z.number(),
  bearing: import_zod.z.number(),
  pitch: import_zod.z.number(),
  imageUrl: import_zod.z.string().url()
}).openapi("MapCaptureRequest");
var MapCaptureResponseSchema = import_zod.z.object({
  id: import_zod.z.string().openapi({ description: "The unique identifier of the map capture" }),
  userId: import_zod.z.string().openapi({ description: "The ID of the user who created the capture" }),
  title: import_zod.z.string().openapi({ description: "The title of the map capture" }),
  longitude: import_zod.z.number(),
  latitude: import_zod.z.number(),
  zoom: import_zod.z.number(),
  bearing: import_zod.z.number(),
  pitch: import_zod.z.number(),
  imageUrl: import_zod.z.string().url(),
  createdAt: import_zod.z.string().openapi({ description: "Timestamp of when the capture was created" })
}).openapi("MapCaptureResponse");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MapCaptureResponseSchema,
  MapCaptureSchema
});
//# sourceMappingURL=mapCaptureModel.js.map