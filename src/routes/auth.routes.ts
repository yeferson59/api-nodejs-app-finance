import { Router } from "express";
import {
  login,
  logout,
  register,
  registerAdmin,
} from "@/controllers/auth.controller";
import tokenAuthUser from "@/middlewares/validator-token-user";
import tokenAuthAdmin from "@/middlewares/validator-token-admin";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", tokenAuthUser, logout);
authRouter.post("/register-admin", tokenAuthAdmin, registerAdmin);

export default authRouter;
