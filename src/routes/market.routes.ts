import { getStock } from "@/controllers/market.controller";
import { Router } from "express";

const router = Router();

router.get("/stock/:ticket", getStock);
router.get("/:id");
router.post("");
router.patch("/:id");
router.delete("/:id");

export default router;
