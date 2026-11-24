import { Router } from "express";
import {
  getMerek,
  getMerekByIdController,
  createMerekController,
  updateMerekController,
  deleteMerekController,
} from "../controllers/merek.controller.mjs";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.mjs";

const router = Router();

router.get("/merek", authenticate, getMerek);
router.get("/merek/:id", authenticate, getMerekByIdController);
router.post(
  "/merek",
  authenticate,
  authorizeRoles("Admin"),
  createMerekController
);
router.put(
  "/merek/:id",
  authenticate,
  authorizeRoles("Admin"),
  updateMerekController
);
router.delete(
  "/merek/:id",
  authenticate,
  authorizeRoles("Admin"),
  deleteMerekController
);

export default router;