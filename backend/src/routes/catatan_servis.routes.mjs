import { Router } from "express";
import {
  getCatatanServis,
  getCatatanServisByIdController,
  getCatatanByTiketController,
  createCatatanServisController,
  updateCatatanServisController,
  deleteCatatanServisController,
} from "../controllers/catatan_servis.controller.mjs";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.mjs";

const router = Router();

router.get("/catatan-servis", authenticate, getCatatanServis);
router.get(
  "/catatan-servis/tiket/:idTiket",
  authenticate,
  getCatatanByTiketController
);
router.get(
  "/catatan-servis/:id",
  authenticate,
  getCatatanServisByIdController
);
router.post(
  "/catatan-servis",
  authenticate,
  authorizeRoles("Admin", "Teknisi"),
  createCatatanServisController
);
router.put(
  "/catatan-servis/:id",
  authenticate,
  authorizeRoles("Admin", "Teknisi"),
  updateCatatanServisController
);
router.delete(
  "/catatan-servis/:id",
  authenticate,
  authorizeRoles("Admin", "Teknisi"),
  deleteCatatanServisController
);

export default router;