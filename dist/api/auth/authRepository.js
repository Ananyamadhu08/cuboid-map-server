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

// src/api/auth/authRepository.ts
var authRepository_exports = {};
__export(authRepository_exports, {
  AuthRepository: () => AuthRepository,
  authRepository: () => authRepository
});
module.exports = __toCommonJS(authRepository_exports);
var import_client = require("@prisma/client");
var import_bcrypt = __toESM(require("bcrypt"));
var prisma = new import_client.PrismaClient();
var AuthRepository = class {
  async createUser({ username, email, password }) {
    const hashedPassword = await import_bcrypt.default.hash(password, 10);
    return prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });
  }
  async findUserByUsername(username) {
    return prisma.user.findUnique({
      where: { username }
    });
  }
  async findUserById(userId) {
    return prisma.user.findUnique({
      where: { id: userId }
    });
  }
  async saveRefreshToken(userId, refreshToken) {
    return prisma.refreshToken.upsert({
      where: { userId },
      update: { token: refreshToken },
      create: { userId, token: refreshToken }
    });
  }
  async findRefreshToken(userId) {
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { userId }
    });
    return tokenRecord?.token || null;
  }
};
var authRepository = new AuthRepository();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthRepository,
  authRepository
});
//# sourceMappingURL=authRepository.js.map