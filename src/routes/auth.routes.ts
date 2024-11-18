import { Router } from "express";
import {
  login,
  logout,
  register,
  registerAdmin,
} from "@/controllers/auth.controller";
import tokenAuthUser from "@/middlewares/validator-token-user";
import tokenAuthAdmin from "@/middlewares/validator-token-admin";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", tokenAuthUser, logout);
router.post("/register-admin", tokenAuthAdmin, registerAdmin);

export default router;
