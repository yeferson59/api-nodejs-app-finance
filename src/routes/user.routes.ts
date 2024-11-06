import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "@/controllers/user.controller";

const userRouter = Router();

userRouter.get("", getAllUsers);
userRouter.get("/:id", getUser);
userRouter.post("", createUser);
userRouter.patch("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
