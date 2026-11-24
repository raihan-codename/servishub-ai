import { Router } from "express";
import {
  getPengguna,
  getPenggunaByIdController,
  createPenggunaController,
  updatePenggunaController,
  updatePasswordPenggunaController,
  deletePenggunaController,
} from "../controllers/pengguna.controller.mjs";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.mjs";

const router = Router();

router.get("/pengguna", authenticate, authorizeRoles("Admin"), getPengguna);
router.get(
  "/pengguna/:id",
  authenticate,
  authorizeRoles("Admin"),
  getPenggunaByIdController
);
router.post(
  "/pengguna",
  authenticate,
  authorizeRoles("Admin"),
  createPenggunaController
);
router.put(
  "/pengguna/:id",
  authenticate,
  authorizeRoles("Admin"),
  updatePenggunaController
);
router.put(
  "/pengguna/:id/password",
  authenticate,
  authorizeRoles("Admin"),
  updatePasswordPenggunaController
);
router.delete(
  "/pengguna/:id",
  authenticate,
  authorizeRoles("Admin"),
  deletePenggunaController
);

export default router;