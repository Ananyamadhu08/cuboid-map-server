"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/api/map-capture/mapCaptureController.ts
var mapCaptureController_exports = {};
__export(mapCaptureController_exports, {
  mapCaptureController: () => mapCaptureController
});
module.exports = __toCommonJS(mapCaptureController_exports);

// src/common/models/serviceResponse.ts
var import_http_status_codes = require("http-status-codes");
var import_zod = require("zod");
var ServiceResponse = class _ServiceResponse {
  success;
  message;
  responseObject;
  statusCode;
  constructor(success, message, responseObject, statusCode) {
    this.success = success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
  }
  static success(message, responseObject, statusCode = import_http_status_codes.StatusCodes.OK) {
    return new _ServiceResponse(true, message, responseObject, statusCode);
  }
  static failure(message, responseObject, statusCode = import_http_status_codes.StatusCodes.BAD_REQUEST) {
    return new _ServiceResponse(false, message, responseObject, statusCode);
  }
};

// src/common/utils/httpHandlers.ts
var import_http_status_codes2 = require("http-status-codes");
var handleServiceResponse = (serviceResponse, response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

// src/api/map-capture/mapCaptureController.ts
var import_http_status_codes4 = require("http-status-codes");

// src/api/map-capture/mapCaptureService.ts
var import_http_status_codes3 = require("http-status-codes");
var import_node_cache = __toESM(require("node-cache"));

// src/api/map-capture/mapCaptureRepository.ts
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

// src/api/map-capture/mapCaptureService.ts
var MapCaptureService = class {
  mapCaptureRepository;
  cache;
  constructor(repository = new MapCaptureRepository()) {
    this.mapCaptureRepository = repository;
    this.cache = new import_node_cache.default({ stdTTL: 3600, checkperiod: 600 });
  }
  async saveCapture(userId, data) {
    try {
      const capture = await this.mapCaptureRepository.saveCapture({ userId, ...data });
      return ServiceResponse.success("Map capture saved successfully", capture, import_http_status_codes3.StatusCodes.CREATED);
    } catch (error) {
      console.error("Error saving map capture:", error);
      return ServiceResponse.failure("Failed to save map capture.", null, import_http_status_codes3.StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async getAllCaptures() {
    try {
      const captures = await this.mapCaptureRepository.findAllCaptures();
      return ServiceResponse.success("Map captures retrieved successfully", captures, import_http_status_codes3.StatusCodes.OK);
    } catch (error) {
      console.error("Error retrieving map captures:", error);
      return ServiceResponse.failure("Failed to retrieve map captures.", null, import_http_status_codes3.StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async getAllCapturesByUserId(userId, page, limit) {
    try {
      const skip = (page - 1) * limit;
      const captures = await this.mapCaptureRepository.findAllCapturesByUserId(userId, skip, limit);
      return ServiceResponse.success("Captures retrieved successfully", captures);
    } catch (error) {
      return ServiceResponse.failure("Failed to retrieve map captures", null, import_http_status_codes3.StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async getCaptureById(id) {
    try {
      const capture = await this.mapCaptureRepository.findCaptureById(id);
      if (!capture) {
        return ServiceResponse.failure("Map capture not found", null, import_http_status_codes3.StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Map capture retrieved successfully", capture, import_http_status_codes3.StatusCodes.OK);
    } catch (error) {
      console.error("Error retrieving map capture:", error);
      return ServiceResponse.failure("Failed to retrieve map capture.", null, import_http_status_codes3.StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async getLatestCaptureByUserId(userId) {
    try {
      const latestCapture = await this.mapCaptureRepository.findLatestCaptureByUserId(userId);
      if (!latestCapture) {
        return ServiceResponse.failure("No captures found for this user.", null, import_http_status_codes3.StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Latest map capture retrieved successfully", latestCapture, import_http_status_codes3.StatusCodes.OK);
    } catch (error) {
      console.log("Error retrieving latest map capture:", error);
      return ServiceResponse.failure("Failed to retrieve latest map capture.", null, import_http_status_codes3.StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async getTopCapturedRegions(userId) {
    const cacheKey = `topCapturedRegions_${userId}`;
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      return ServiceResponse.success("Top captured regions retrieved from cache", cachedData, import_http_status_codes3.StatusCodes.OK);
    }
    try {
      const topRegions = await this.mapCaptureRepository.findTopCapturedRegions(userId);
      if (topRegions.length === 0) {
        return ServiceResponse.failure("No captures found for this user.", null, import_http_status_codes3.StatusCodes.NOT_FOUND);
      }
      this.cache.set(cacheKey, topRegions);
      return ServiceResponse.success("Top captured regions retrieved successfully", topRegions, import_http_status_codes3.StatusCodes.OK);
    } catch (error) {
      console.log("Error retrieving top captured regions:", error);
      return ServiceResponse.failure(
        "Failed to retrieve top captured regions.",
        null,
        import_http_status_codes3.StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
};
var mapCaptureService = new MapCaptureService();

// src/api/map-capture/mapCaptureController.ts
var MapCaptureController = class {
  async saveCapture(req, res) {
    const userId = req.user?.id;
    if (!userId) {
      return ServiceResponse.failure("User ID is missing from the request.", null, import_http_status_codes4.StatusCodes.BAD_REQUEST);
    }
    const { title, longitude, latitude, zoom, bearing, pitch, imageUrl } = req.body;
    if (!title || !longitude || !latitude || !imageUrl) {
      return ServiceResponse.failure("Missing required fields in the request.", null, import_http_status_codes4.StatusCodes.BAD_REQUEST);
    }
    const serviceResponse = await mapCaptureService.saveCapture(userId, {
      title,
      longitude,
      latitude,
      zoom,
      bearing,
      pitch,
      imageUrl
    });
    return handleServiceResponse(serviceResponse, res);
  }
  async getAllUserCaptures(req, res) {
    const userId = req.user?.id;
    if (!userId) {
      return ServiceResponse.failure("User ID is missing from the request.", null, import_http_status_codes4.StatusCodes.BAD_REQUEST);
    }
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const serviceResponse = await mapCaptureService.getAllCapturesByUserId(userId, page, limit);
    return handleServiceResponse(serviceResponse, res);
  }
  async getCaptureById(req, res) {
    const { id } = req.params;
    const serviceResponse = await mapCaptureService.getCaptureById(id);
    return handleServiceResponse(serviceResponse, res);
  }
  async getLatestCaptureByUserId(req, res) {
    const userId = req.user?.id;
    if (!userId) {
      return ServiceResponse.failure("User ID is missing from the request.", null, import_http_status_codes4.StatusCodes.BAD_REQUEST);
    }
    const serviceResponse = await mapCaptureService.getLatestCaptureByUserId(userId);
    return handleServiceResponse(serviceResponse, res);
  }
  async getTopCapturedRegions(req, res) {
    const userId = req.user?.id;
    if (!userId) {
      return ServiceResponse.failure("User ID is missing from the request.", null, import_http_status_codes4.StatusCodes.BAD_REQUEST);
    }
    const serviceResponse = await mapCaptureService.getTopCapturedRegions(userId);
    return handleServiceResponse(serviceResponse, res);
  }
};
var mapCaptureController = new MapCaptureController();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapCaptureController
});
//# sourceMappingURL=mapCaptureController.js.map