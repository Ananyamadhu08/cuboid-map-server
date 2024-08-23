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

// src/common/utils/jwtUtils.ts
var jwtUtils_exports = {};
__export(jwtUtils_exports, {
  generateRefreshToken: () => generateRefreshToken,
  generateToken: () => generateToken,
  verifyToken: () => verifyToken
});
module.exports = __toCommonJS(jwtUtils_exports);
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
function generateToken(userId) {
  return import_jsonwebtoken.default.sign({ userId }, secret, { expiresIn: "1d" });
}
function generateRefreshToken(userId) {
  return import_jsonwebtoken.default.sign({ userId }, secret, { expiresIn: "7d" });
}
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateRefreshToken,
  generateToken,
  verifyToken
});
//# sourceMappingURL=jwtUtils.js.map