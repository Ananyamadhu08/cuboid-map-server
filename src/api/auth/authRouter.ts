import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { authController } from "./authController";
import { AuthRequestSchema, AuthResponseSchema } from "./authModel";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: AuthRequestSchema,
        },
      },
    },
  },
  responses: createApiResponse(AuthResponseSchema, "Successful registration"),
});

authRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: AuthRequestSchema,
        },
      },
    },
  },
  responses: createApiResponse(AuthResponseSchema, "Successful login"),
});

authRegistry.registerPath({
  method: "post",
  path: "/auth/refresh-token",
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ refreshToken: z.string().openapi({ example: "refresh.token.here" }) }),
        },
      },
    },
  },
  responses: createApiResponse(
    z.object({ accessToken: z.string().openapi({ example: "jwt.token.here" }) }),
    "Token refreshed",
  ),
});

authRouter.post("/register", validateRequest(AuthRequestSchema), authController.register);
authRouter.post("/login", validateRequest(AuthRequestSchema), authController.login);
authRouter.post("/refresh-token", validateRequest(z.object({ refreshToken: z.string() })), authController.refreshToken);
