import { Router } from "express";
import {
  getTiketServis,
  getTiketServisByIdController,
  createTiketServisController,
  updateTiketServisController,
} from "../controllers/tiketServis.controller.mjs";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.mjs";

const router = Router();

router.get("/tiket-servis", authenticate, getTiketServis);
router.get("/tiket-servis/:id", authenticate, getTiketServisByIdController);
router.post(
  "/tiket-servis",
  authenticate,
  authorizeRoles("Admin", "Pelanggan"),
  createTiketServisController
);
router.put(
  "/tiket-servis/:id",
  authenticate,
  authorizeRoles("Admin", "Teknisi"),
  updateTiketServisController
);
router.patch(
  "/tiket-servis/:id",
  authenticate,
  authorizeRoles("Admin", "Teknisi"),
  updateTiketServisController
);

export default router;