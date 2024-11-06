import { Response, Request } from "express";
import { loginSchema } from "@/schemas/auth.js";
import { handleErrorResponse } from "@/lib/auth-functions";
import db from "@/config/db";
import createUserSchema from "@/schemas/user";
import AuthModel from "@/models/auth.model";

export const register = async (req: Request, res: Response) => {
  const { name, lastName, email, password } = req.body;
  const validationResult = await createUserSchema.safeParseAsync({
    name,
    lastName,
    email,
    password,
  });

  if (!validationResult.success) {
    handleErrorResponse(res, "Validation error", validationResult.error);
    return;
  }

  await AuthModel.register(res, validationResult.data);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const validationResult = await loginSchema.safeParseAsync({
    email,
    password,
  });

  if (!validationResult.success) {
    handleErrorResponse(res, "Validation error", validationResult.error, 400);
    return;
  }

  await AuthModel.login(res, validationResult.data);
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    await db.query("DELETE FROM AUTH_SESSION WHERE TOKEN = $1;", [token]);
    res.cookie("token", "", { expires: new Date(0) });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    handleErrorResponse(res, "Error logging out", error, 500);
  }
};
