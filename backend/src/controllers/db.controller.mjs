import pool from "../config/db.mjs";

export const testDatabase = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT DATABASE() AS database_aktif, NOW() AS waktu_server"
    );

    res.json({
      status: "success",
      message: "Koneksi database berhasil!",
      data: rows[0],
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      status: "error",
      message: "Koneksi database gagal!",
      error: error.code || error.message || String(error),
    });
  }
};