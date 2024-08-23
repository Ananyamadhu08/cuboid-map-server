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

// src/api/map-capture/mapCaptureRouter.ts
var mapCaptureRouter_exports = {};
__export(mapCaptureRouter_exports, {
  mapCaptureRegistry: () => mapCaptureRegistry,
  mapCaptureRouter: () => mapCaptureRouter
});
module.exports = __toCommonJS(mapCaptureRouter_exports);

// src/api-docs/openAPIResponseBuilders.ts
var import_http_status_codes2 = require("http-status-codes");

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
var ServiceResponseSchema = (dataSchema) => import_zod.z.object({
  success: import_zod.z.boolean(),
  message: import_zod.z.string(),
  responseObject: dataSchema.optional(),
  statusCode: import_zod.z.number()
});

// src/api-docs/openAPIResponseBuilders.ts
function createApiResponse(schema, description, statusCode = import_http_status_codes2.StatusCodes.OK) {
  return {
    [statusCode]: {
      description,
      content: {
        "application/json": {
          schema: ServiceResponseSchema(schema)
        }
      }
    }
  };
}

// src/common/middleware/authenticateToken.ts
var import_http_status_codes3 = require("http-status-codes");
var import_jsonwebtoken2 = require("jsonwebtoken");

// src/common/utils/jwtUtils.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));

// src/common/utils/envConfig.ts
var import_dotenv = __toESM(require("dotenv"));
var import_envalid = require("envalid");
import_dotenv.default.config();
var env = (0, import_envalid.cleanEnv)(process.env, {
  NODE_ENV: (0, import_envalid.str)({ devDefault: (0, import_envalid.testOnly)("test"), choices: ["development", "production", "test"] }),
  HOST: (0, import_envalid.host)({ devDefault: (0, import_envalid.testOnly)("localhost") }),
  PORT: (0, import_envalid.port)({ devDefault: (0, import_envalid.testOnly)(3e3) }),
  CORS_ORIGIN: (0, import_envalid.str)({ devDefault: (0, import_envalid.testOnly)("http://localhost:5173") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: (0, import_envalid.num)({ devDefault: (0, import_envalid.testOnly)(1e3) }),
  COMMON_RATE_LIMIT_WINDOW_MS: (0, import_envalid.num)({ devDefault: (0, import_envalid.testOnly)(1e3) }),
  DATABASE_URL: (0, import_envalid.str)(),
  JWT_SECRET: (0, import_envalid.str)()
});

// src/common/utils/jwtUtils.ts
var secret = env.JWT_SECRET;
function verifyToken(token, type = "access") {
  try {
    return import_jsonwebtoken.default.verify(token, secret);
  } catch (error) {
    if (error instanceof import_jsonwebtoken.TokenExpiredError) {
      throw new import_jsonwebtoken.TokenExpiredError("Token expired", error.expiredAt);
    } else if (error instanceof import_jsonwebtoken.JsonWebTokenError) {
      throw new import_jsonwebtoken.JsonWebTokenError("Invalid token");
    } else {
      throw new Error("Token verification failed");
    }
  }
}

// src/common/middleware/authenticateToken.ts
var authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(import_http_status_codes3.StatusCodes.UNAUTHORIZED).json(ServiceResponse.failure("Access denied. No token provided.", null, import_http_status_codes3.StatusCodes.UNAUTHORIZED));
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.userId };
    console.log("Decoded user from token:", decoded);
    console.log("User ID:", req.user.id);
    next();
  } catch (err) {
    if (err instanceof import_jsonwebtoken2.TokenExpiredError) {
      console.error("Token expired:", err.message);
      return res.status(import_http_status_codes3.StatusCodes.UNAUTHORIZED).json(ServiceResponse.failure("Token expired.", null, import_http_status_codes3.StatusCodes.UNAUTHORIZED));
    } else if (err instanceof import_jsonwebtoken2.JsonWebTokenError) {
      console.error("Invalid token:", err.message);
      return res.status(import_http_status_codes3.StatusCodes.FORBIDDEN).json(ServiceResponse.failure("Invalid token.", null, import_http_status_codes3.StatusCodes.FORBIDDEN));
    } else {
      console.error("Token verification failed:", err);
      return res.status(import_http_status_codes3.StatusCodes.INTERNAL_SERVER_ERROR).json(ServiceResponse.failure("Token verification failed.", null, import_http_status_codes3.StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

// src/common/utils/httpHandlers.ts
var import_http_status_codes4 = require("http-status-codes");
var handleServiceResponse = (serviceResponse, response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};
var validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const zodError = result.error;
    const errorMessage = `Invalid input: ${zodError.errors.map((e) => `${e.path.join(".")} - ${e.message}`).join(", ")}`;
    const statusCode = import_http_status_codes4.StatusCodes.BAD_REQUEST;
    const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode);
    return handleServiceResponse(serviceResponse, res);
  }
  next();
};

// src/api/map-capture/mapCaptureRouter.ts
var import_zod_to_openapi2 = require("@asteasolutions/zod-to-openapi");
var import_express = __toESM(require("express"));

// src/api/map-capture/mapCaptureController.ts
var import_http_status_codes6 = require("http-status-codes");

// src/api/map-capture/mapCaptureService.ts
var import_http_status_codes5 = require("http-status-codes");
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
      return ServiceResponse.success("Map capture saved successfully", capture, import_http_status_codes5.StatusCodes.CREATED);
    } catch (error) {
      console.error("Error saving map capture:", error);
      return ServiceResponse.failure("Failed to save map capture.", null, import_http_status_codes5.StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async getAllCaptures() {
    try {
      const captures = await this.mapCaptureRepository.findAllCaptures();
      return ServiceResponse.success("Map captures retrieved successfully", captures, import_http_status_codes5.StatusCodes.OK);
    } catch (error) {
      console.error("Error retrieving map captures:", error);
      return ServiceResponse.failure("Failed to retrieve map captures.", null, import_http_status_codes5.StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async getAllCapturesByUserId(userId, page, limit) {
    try {
      const skip = (page - 1) * limit;
      const captures = await this.mapCaptureRepository.findAllCapturesByUserId(userId, skip, limit);
      return ServiceResponse.success("Captures retrieved successfully", captures);
    } catch (error) {
      return ServiceResponse.failure("Failed to retrieve map captures", null, import_http_status_codes5.StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async getCaptureById(id) {
    try {
      const capture = await this.mapCaptureRepository.findCaptureById(id);
      if (!capture) {
        return ServiceResponse.failure("Map capture not found", null, import_http_status_codes5.StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Map capture retrieved successfully", capture, import_http_status_codes5.StatusCodes.OK);
    } catch (error) {
      console.error("Error retrieving map capture:", error);
      return ServiceResponse.failure("Failed to retrieve map capture.", null, import_http_status_codes5.StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async getLatestCaptureByUserId(userId) {
    try {
      const latestCapture = await this.mapCaptureRepository.findLatestCaptureByUserId(userId);
      if (!latestCapture) {
        return ServiceResponse.failure("No captures found for this user.", null, import_http_status_codes5.StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Latest map capture retrieved successfully", latestCapture, import_http_status_codes5.StatusCodes.OK);
    } catch (error) {
      console.log("Error retrieving latest map capture:", error);
      return ServiceResponse.failure("Failed to retrieve latest map capture.", null, import_http_status_codes5.StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async getTopCapturedRegions(userId) {
    const cacheKey = `topCapturedRegions_${userId}`;
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      return ServiceResponse.success("Top captured regions retrieved from cache", cachedData, import_http_status_codes5.StatusCodes.OK);
    }
    try {
      const topRegions = await this.mapCaptureRepository.findTopCapturedRegions(userId);
      if (topRegions.length === 0) {
        return ServiceResponse.failure("No captures found for this user.", null, import_http_status_codes5.StatusCodes.NOT_FOUND);
      }
      this.cache.set(cacheKey, topRegions);
      return ServiceResponse.success("Top captured regions retrieved successfully", topRegions, import_http_status_codes5.StatusCodes.OK);
    } catch (error) {
      console.log("Error retrieving top captured regions:", error);
      return ServiceResponse.failure(
        "Failed to retrieve top captured regions.",
        null,
        import_http_status_codes5.StatusCodes.INTERNAL_SERVER_ERROR
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
      return ServiceResponse.failure("User ID is missing from the request.", null, import_http_status_codes6.StatusCodes.BAD_REQUEST);
    }
    const { title, longitude, latitude, zoom, bearing, pitch, imageUrl } = req.body;
    if (!title || !longitude || !latitude || !imageUrl) {
      return ServiceResponse.failure("Missing required fields in the request.", null, import_http_status_codes6.StatusCodes.BAD_REQUEST);
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
      return ServiceResponse.failure("User ID is missing from the request.", null, import_http_status_codes6.StatusCodes.BAD_REQUEST);
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
      return ServiceResponse.failure("User ID is missing from the request.", null, import_http_status_codes6.StatusCodes.BAD_REQUEST);
    }
    const serviceResponse = await mapCaptureService.getLatestCaptureByUserId(userId);
    return handleServiceResponse(serviceResponse, res);
  }
  async getTopCapturedRegions(req, res) {
    const userId = req.user?.id;
    if (!userId) {
      return ServiceResponse.failure("User ID is missing from the request.", null, import_http_status_codes6.StatusCodes.BAD_REQUEST);
    }
    const serviceResponse = await mapCaptureService.getTopCapturedRegions(userId);
    return handleServiceResponse(serviceResponse, res);
  }
};
var mapCaptureController = new MapCaptureController();

// src/api/map-capture/mapCaptureModel.ts
var import_zod_to_openapi = require("@asteasolutions/zod-to-openapi");
var import_zod2 = require("zod");
(0, import_zod_to_openapi.extendZodWithOpenApi)(import_zod2.z);
var MapCaptureSchema = import_zod2.z.object({
  title: import_zod2.z.string().min(1, "Title is required"),
  longitude: import_zod2.z.number(),
  latitude: import_zod2.z.number(),
  zoom: import_zod2.z.number(),
  bearing: import_zod2.z.number(),
  pitch: import_zod2.z.number(),
  imageUrl: import_zod2.z.string().url()
}).openapi("MapCaptureRequest");
var MapCaptureResponseSchema = import_zod2.z.object({
  id: import_zod2.z.string().openapi({ description: "The unique identifier of the map capture" }),
  userId: import_zod2.z.string().openapi({ description: "The ID of the user who created the capture" }),
  title: import_zod2.z.string().openapi({ description: "The title of the map capture" }),
  longitude: import_zod2.z.number(),
  latitude: import_zod2.z.number(),
  zoom: import_zod2.z.number(),
  bearing: import_zod2.z.number(),
  pitch: import_zod2.z.number(),
  imageUrl: import_zod2.z.string().url(),
  createdAt: import_zod2.z.string().openapi({ description: "Timestamp of when the capture was created" })
}).openapi("MapCaptureResponse");

// src/api/map-capture/mapCaptureRouter.ts
var mapCaptureRegistry = new import_zod_to_openapi2.OpenAPIRegistry();
var mapCaptureRouter = import_express.default.Router();
mapCaptureRegistry.register("MapCapture", MapCaptureSchema);
mapCaptureRouter.use(authenticateToken);
mapCaptureRegistry.registerPath({
  method: "post",
  path: "/map-captures",
  tags: ["Map Capture"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: MapCaptureSchema
        }
      }
    }
  },
  responses: createApiResponse(MapCaptureResponseSchema, "Map capture saved successfully")
});
mapCaptureRegistry.registerPath({
  method: "get",
  path: "/map-captures",
  tags: ["Map Capture"],
  responses: createApiResponse(MapCaptureResponseSchema.array(), "Map captures retrieved successfully")
  // Updated to .array()
});
mapCaptureRegistry.registerPath({
  method: "get",
  path: "/map-captures/user/latest",
  tags: ["Map Capture"],
  responses: createApiResponse(MapCaptureResponseSchema, "Latest map capture retrieved successfully")
});
mapCaptureRegistry.registerPath({
  method: "get",
  path: "/map-captures/top-regions",
  tags: ["Map Capture"],
  responses: createApiResponse(MapCaptureResponseSchema.array(), "Top captured regions retrieved successfully")
  // Updated to .array()
});
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
        type: "string"
      }
    }
  ],
  responses: createApiResponse(MapCaptureResponseSchema, "Map capture retrieved successfully")
});
mapCaptureRouter.post("/", validateRequest(MapCaptureSchema), mapCaptureController.saveCapture);
mapCaptureRouter.get("/", mapCaptureController.getAllUserCaptures);
mapCaptureRouter.get("/user/latest", mapCaptureController.getLatestCaptureByUserId);
mapCaptureRouter.get("/top-regions", mapCaptureController.getTopCapturedRegions);
mapCaptureRouter.get("/:id", mapCaptureController.getCaptureById);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapCaptureRegistry,
  mapCaptureRouter
});
//# sourceMappingURL=mapCaptureRouter.js.map