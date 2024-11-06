import { Router } from "express";
import { login, logout, register } from "@/controllers/auth.controller";
import tokenTokenUser from "@/middlewares/validator-token-user";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", tokenTokenUser, logout);

export default authRouter;
