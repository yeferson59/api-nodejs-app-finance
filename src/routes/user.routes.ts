import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "@/controllers/user.controller";

const router = Router();

router.get("", getAllUsers);
router.get("/:id", getUser);
router.post("", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
