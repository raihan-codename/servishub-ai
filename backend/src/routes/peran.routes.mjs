import { Router } from "express";
import { getPeran } from "../controllers/peran.controller.mjs";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.mjs";

const router = Router();

router.get("/peran", authenticate, authorizeRoles("Admin"), getPeran);

export default router;