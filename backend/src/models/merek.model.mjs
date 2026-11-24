import pool from "../config/db.mjs";

// GET - Mengambil semua merek
export const getAllMerek = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM merek ORDER BY id_merek ASC"
  );

  return rows;
};

// POST - Menambahkan merek
export const createMerek = async (nama_merek) => {
  const [result] = await pool.query(
    "INSERT INTO merek (nama_merek) VALUES (?)",
    [nama_merek]
  );

  return result;
};

// GET - Mengambil merek berdasarkan ID
export const getMerekById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM merek WHERE id_merek = ?",
    [id]
  );

  return rows[0];
};

// PUT - Mengubah merek
export const updateMerek = async (id, nama_merek) => {
  const [result] = await pool.query(
    `UPDATE merek
     SET nama_merek = ?
     WHERE id_merek = ?`,
    [nama_merek, id]
  );

  return result;
};

// DELETE - Menghapus merek
export const deleteMerek = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM merek WHERE id_merek = ?",
    [id]
  );

  return result;
};