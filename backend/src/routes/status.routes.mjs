import { Router } from "express";
import { getStatus } from "../controllers/status.controller.mjs";

const router = Router();

router.get("/status", getStatus);

export default router;