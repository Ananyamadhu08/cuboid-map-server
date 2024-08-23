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

// src/common/middleware/authenticateToken.ts
var authenticateToken_exports = {};
__export(authenticateToken_exports, {
  authenticateToken: () => authenticateToken
});
module.exports = __toCommonJS(authenticateToken_exports);
var import_http_status_codes2 = require("http-status-codes");
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

// src/common/middleware/authenticateToken.ts
var authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(import_http_status_codes2.StatusCodes.UNAUTHORIZED).json(ServiceResponse.failure("Access denied. No token provided.", null, import_http_status_codes2.StatusCodes.UNAUTHORIZED));
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
      return res.status(import_http_status_codes2.StatusCodes.UNAUTHORIZED).json(ServiceResponse.failure("Token expired.", null, import_http_status_codes2.StatusCodes.UNAUTHORIZED));
    } else if (err instanceof import_jsonwebtoken2.JsonWebTokenError) {
      console.error("Invalid token:", err.message);
      return res.status(import_http_status_codes2.StatusCodes.FORBIDDEN).json(ServiceResponse.failure("Invalid token.", null, import_http_status_codes2.StatusCodes.FORBIDDEN));
    } else {
      console.error("Token verification failed:", err);
      return res.status(import_http_status_codes2.StatusCodes.INTERNAL_SERVER_ERROR).json(ServiceResponse.failure("Token verification failed.", null, import_http_status_codes2.StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authenticateToken
});
//# sourceMappingURL=authenticateToken.js.map