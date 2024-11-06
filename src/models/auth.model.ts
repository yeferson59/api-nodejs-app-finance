import { typeLogin, typeSignUp } from "@/schemas/auth";
import UserModel from "./user.model";
import db from "@/config/db";
import {
  handleErrorResponse,
  setAuthCookie,
  setTokenDb,
  tokenCookie,
  validatePassword,
} from "@/lib/auth-functions.js";
import { Response } from "express";
import { getUserByEmail } from "@/controllers/user.controller.js";

export default class AuthModel {
  static async register(res: Response, data: typeSignUp) {
    try {
      const user = await UserModel.createUser(data);
      const {
        rows: [role],
      } = await db.query("SELECT NAME FROM AUTH_ROLE WHERE ID = $1", [
        user.role_id,
      ]);

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const session = await tokenCookie({
        userId: user.id,
        role: role.name,
        createdAt: user.created_at,
        expiresAt,
      });

      setAuthCookie(res, session);

      await setTokenDb(session, user.id, expiresAt);

      res.status(200).json({
        id: user.id,
        name: user.name,
        lastName: user.last_name,
        email: user.email,
        role: role.name,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        token: session,
      });
    } catch (error) {
      console.error(error);
      handleErrorResponse(res, "Error registering user", error, 500);
    }
  }

  static async login(res: Response, data: typeLogin) {
    try {
      const user = await getUserByEmail(data.email);
      if (!user) {
        handleErrorResponse(res, "User not found", null, 404);
        return;
      }

      const isPasswordValid = await validatePassword(
        data.password,
        user.password
      );
      if (!isPasswordValid) {
        handleErrorResponse(res, "Invalid password", null, 400);
        return;
      }

      const {
        rows: [role],
      } = await db.query("SELECT NAME FROM AUTH_ROLE WHERE ID = $1", [
        user.role_id,
      ]);

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const session = await tokenCookie({
        userId: user.id,
        role: role.name,
        createdAt: user.created_at,
        expiresAt,
      });

      setAuthCookie(res, session);
      await setTokenDb(session, user.id, expiresAt);

      res.status(200).json({
        id: user.id,
        name: user.name,
        lastName: user.last_name,
        email: user.email,
        role: role.name,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        token: session,
      });
    } catch (error) {
      console.error(error);
      handleErrorResponse(res, "Error logging in", error, 500);
    }
  }
}
