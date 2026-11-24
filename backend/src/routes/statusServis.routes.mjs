import { Router } from "express";
import {
  getStatusServis,
  getStatusServisByIdController,
  createStatusServisController,
  updateStatusServisController,
  deleteStatusServisController,
} from "../controllers/statusServis.controller.mjs";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.mjs";

const router = Router();

router.get("/status-servis", authenticate, getStatusServis);
router.get(
  "/status-servis/:id",
  authenticate,
  getStatusServisByIdController
);
router.post(
  "/status-servis",
  authenticate,
  authorizeRoles("Admin"),
  createStatusServisController
);
router.put(
  "/status-servis/:id",
  authenticate,
  authorizeRoles("Admin"),
  updateStatusServisController
);
router.delete(
  "/status-servis/:id",
  authenticate,
  authorizeRoles("Admin"),
  deleteStatusServisController
);

export default router;