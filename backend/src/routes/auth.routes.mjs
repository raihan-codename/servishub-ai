import { Router } from "express";
import {
  loginController,
  registerController,
  getMeController,
} from "../controllers/auth.controller.mjs";
import { authenticate } from "../middlewares/auth.middleware.mjs";

const router = Router();

router.post("/auth/login", loginController);
router.post("/auth/register", registerController);
router.get("/auth/me", authenticate, getMeController);

export default router;
