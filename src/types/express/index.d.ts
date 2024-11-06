import type { JWTPayload } from "jose";

declare module "express" {
  interface Request {
    user?: JWTPayload;
  }
}
