import { Router } from "express";
import {
  getJenisPerangkat,
  getJenisPerangkatByIdController,
  createJenisPerangkatController,
  updateJenisPerangkatController,
  deleteJenisPerangkatController,
} from "../controllers/jenisPerangkat.controller.mjs";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.mjs";

const router = Router();

router.get("/jenis-perangkat", authenticate, getJenisPerangkat);
router.get(
  "/jenis-perangkat/:id",
  authenticate,
  getJenisPerangkatByIdController
);
router.post(
  "/jenis-perangkat",
  authenticate,
  authorizeRoles("Admin"),
  createJenisPerangkatController
);
router.put(
  "/jenis-perangkat/:id",
  authenticate,
  authorizeRoles("Admin"),
  updateJenisPerangkatController
);
router.delete(
  "/jenis-perangkat/:id",
  authenticate,
  authorizeRoles("Admin"),
  deleteJenisPerangkatController
);

export default router;