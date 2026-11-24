import pool from "../config/db.mjs";

// Mengambil semua jenis perangkat
export const getAllJenisPerangkat = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM jenis_perangkat ORDER BY id_jenis_perangkat ASC"
  );

  return rows;
};

// Menambahkan jenis perangkat
export const createJenisPerangkat = async (nama_jenis) => {
  const [result] = await pool.query(
    "INSERT INTO jenis_perangkat (nama_jenis) VALUES (?)",
    [nama_jenis]
  );

  return result;
};

// Mengambil jenis perangkat berdasarkan ID
export const getJenisPerangkatById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM jenis_perangkat WHERE id_jenis_perangkat = ?",
    [id]
  );

  return rows[0];
};

// Mengubah jenis perangkat
export const updateJenisPerangkat = async (id, nama_jenis) => {
  const [result] = await pool.query(
    `UPDATE jenis_perangkat
     SET nama_jenis = ?
     WHERE id_jenis_perangkat = ?`,
    [nama_jenis, id]
  );

  return result;
};

// Menghapus jenis perangkat
export const deleteJenisPerangkat = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM jenis_perangkat WHERE id_jenis_perangkat = ?",
    [id]
  );

  return result;
};