import pool from "../config/db.mjs";

export const getAllPeran = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM peran ORDER BY id_peran ASC"
  );

  return rows;
};