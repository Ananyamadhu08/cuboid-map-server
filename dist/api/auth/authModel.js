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

// src/api/auth/authModel.ts
var authModel_exports = {};
__export(authModel_exports, {
  AuthRequestSchema: () => AuthRequestSchema,
  AuthResponseSchema: () => AuthResponseSchema
});
module.exports = __toCommonJS(authModel_exports);
var import_zod_to_openapi = require("@asteasolutions/zod-to-openapi");
var import_zod = require("zod");
(0, import_zod_to_openapi.extendZodWithOpenApi)(import_zod.z);
var AuthRequestSchema = import_zod.z.object({
  username: import_zod.z.string().min(3, { message: "Username is required and must be at least 3 characters" }).openapi({ example: "user123" }),
  password: import_zod.z.string().min(8, { message: "Password is required and must be at least 8 characters" }).openapi({ example: "securepassword" }),
  email: import_zod.z.string().email({ message: "A valid email is required" }).openapi({ example: "user@example.com" })
}).openapi("AuthRequest");
var AuthResponseSchema = import_zod.z.object({
  accessToken: import_zod.z.string().openapi({ example: "jwt.token.here" }),
  refreshToken: import_zod.z.string().openapi({ example: "refresh.token.here" }),
  username: import_zod.z.string().openapi({ example: "user123" }),
  email: import_zod.z.string().email().openapi({ example: "user@example.com" })
}).openapi("AuthResponse");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthRequestSchema,
  AuthResponseSchema
});
//# sourceMappingURL=authModel.js.map