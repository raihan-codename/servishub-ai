import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import statusRouter from "./routes/status.routes.mjs";
import dbRouter from "./routes/db.routes.mjs";
import authRouter from "./routes/auth.routes.mjs";
import kategoriRouter from "./routes/kategori.routes.mjs";
import jenisPerangkatRouter from "./routes/jenisPerangkat.routes.mjs";
import merekRouter from "./routes/merek.routes.mjs";
import statusServisRouter from "./routes/statusServis.routes.mjs";
import peranRouter from "./routes/peran.routes.mjs";
import penggunaRouter from "./routes/pengguna.routes.mjs";
import tiketServisRouter from "./routes/tiketServis.routes.mjs";
import penugasanRouter from "./routes/penugasan.routes.mjs";
import catatanServisRouter from "./routes/catatan_servis.routes.mjs";
import riwayatStatusRouter from "./routes/riwayat_status.routes.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route info API
app.get("/api", (req, res) => {
    res.json({
        message: "API ServisHub berjalan!",
    });
});

// Routes API
app.use("/api", statusRouter);
app.use("/api", dbRouter);
app.use("/api", authRouter);
app.use("/api", kategoriRouter);
app.use("/api", jenisPerangkatRouter);
app.use("/api", merekRouter);
app.use("/api", statusServisRouter);
app.use("/api", peranRouter);
app.use("/api", penggunaRouter);
app.use("/api", tiketServisRouter);
app.use("/api", penugasanRouter);
app.use("/api", catatanServisRouter);
app.use("/api", riwayatStatusRouter);

// Serve built frontend static assets
if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));

    app.use((req, res, next) => {
        if (req.method === "GET" && !req.path.startsWith("/api")) {
            return res.sendFile(path.join(frontendDistPath, "index.html"));
        }
        next();
    });
} else {
    app.get("/", (req, res) => {
        res.json({
            message: "API ServisHub berjalan!",
        });
    });
}

export default app;