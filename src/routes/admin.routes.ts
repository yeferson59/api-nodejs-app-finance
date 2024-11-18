import { Router } from "express";
import {
  createAdmin,
  getAdmin,
  getAdmins,
  removeAdmin,
  updateAdmin,
} from "@/controllers/admin.controller";

const router = Router();

router.get("", getAdmins);
router.get("/:id", getAdmin);
router.post("", createAdmin);
router.patch("/:id", updateAdmin);
router.delete("/:id", removeAdmin);

export default router;
