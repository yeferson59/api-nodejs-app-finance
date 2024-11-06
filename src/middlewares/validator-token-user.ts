import { secretToken } from "@/config/index";
import { Session } from "@/interfaces/session.interface";
import { verifiedToken } from "@/lib/auth-functions";
import { Request, Response, NextFunction } from "express";

const secret = new TextEncoder().encode(secretToken); // Cache the encoded secret

const tokenTokenUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    const payload: Session | undefined = await verifiedToken(token, secret);

    if (!payload) {
      res.status(401).json({ message: "Invalid session or token mismatch" });
      return;
    }

    // Attach the user payload to the request
    req.user = payload;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default tokenTokenUser;
