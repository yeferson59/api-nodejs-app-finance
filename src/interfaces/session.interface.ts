import { JWTPayload } from "jose";

export interface Session extends JWTPayload {
  userId?: string;
  role?: string;
  createdAt?: string;
  expiresAt?: Date;
}
