import { Router } from "express";
import { testDatabase } from "../controllers/db.controller.mjs";

const router = Router();

router.get("/db-test", testDatabase);

export default router;