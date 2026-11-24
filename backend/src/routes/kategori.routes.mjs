import { Router } from "express";
import {
  getKategori,
  createKategoriController,
  updateKategoriController,
  deleteKategoriController,
} from "../controllers/kategori.controller.mjs";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.mjs";

const router = Router();

router.get("/kategori", authenticate, getKategori);
router.post(
  "/kategori",
  authenticate,
  authorizeRoles("Admin"),
  createKategoriController
);
router.put(
  "/kategori/:id",
  authenticate,
  authorizeRoles("Admin"),
  updateKategoriController
);
router.delete(
  "/kategori/:id",
  authenticate,
  authorizeRoles("Admin"),
  deleteKategoriController
);

export default router;