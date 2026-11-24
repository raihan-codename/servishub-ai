import { Router } from "express";
import {
  getRiwayatStatus,
  getRiwayatByTiketController,
  createRiwayatStatusController,
} from "../controllers/riwayat_status.controller.mjs";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.mjs";

const router = Router();

router.get("/riwayat-status", authenticate, getRiwayatStatus);
router.get(
  "/riwayat-status/tiket/:idTiket",
  authenticate,
  getRiwayatByTiketController
);
router.post(
  "/riwayat-status",
  authenticate,
  authorizeRoles("Admin", "Teknisi"),
  createRiwayatStatusController
);

export default router;