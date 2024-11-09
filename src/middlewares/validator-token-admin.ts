import { Request, Response, NextFunction } from "express";
import { secretToken } from "@/config/index";
import { verifiedToken } from "@/lib/auth-functions";
import { Session } from "@/interfaces/session.interface";

const secret = new TextEncoder().encode(secretToken); // Cache the encoded secret

const tokenAuthAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    // Verify the JWT token
    const payload: Session | undefined = await verifiedToken(
      token ?? "",
      secret
    );

    if (!payload) {
      res.status(401).json({ message: "Invalid session or token mismatch" });
      return;
    }

    // Check for admin role
    if (payload.role !== "admin") {
      res.status(403).json({ message: "Forbidden: Access denied" });
      return;
    }

    // Attach the user payload to the request
    req.user = payload;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default tokenAuthAdmin;
