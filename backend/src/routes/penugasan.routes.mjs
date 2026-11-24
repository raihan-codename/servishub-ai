import { Router } from "express";
import {
  getPenugasanController,
  getPenugasanByIdController,
  createPenugasanController,
  endPenugasanController,
} from "../controllers/penugasan.controller.mjs";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.mjs";

const router = Router();

router.get("/penugasan", authenticate, getPenugasanController);
router.get("/penugasan/:id", authenticate, getPenugasanByIdController);
router.post(
  "/penugasan",
  authenticate,
  authorizeRoles("Admin"),
  createPenugasanController
);
router.put(
  "/penugasan/:id/selesai",
  authenticate,
  authorizeRoles("Admin", "Teknisi"),
  endPenugasanController
);

export default router;