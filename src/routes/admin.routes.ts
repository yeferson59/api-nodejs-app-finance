import { Router } from "express";
import {
  createAdmin,
  getAdmin,
  getAdmins,
  removeAdmin,
  updateAdmin,
} from "@/controllers/admin.controller";

const adminRouter = Router();

adminRouter.get("", getAdmins);
adminRouter.get("/:id", getAdmin);
adminRouter.post("", createAdmin);
adminRouter.patch("/:id", updateAdmin);
adminRouter.delete("/:id", removeAdmin);

export default adminRouter;
