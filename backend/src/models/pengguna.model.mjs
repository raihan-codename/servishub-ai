import pool from "../config/db.mjs";

// Mengambil semua pengguna (tanpa password)
export const getAllPengguna = async () => {
  const [rows] = await pool.query(`
    SELECT
      p.id_pengguna,
      p.id_peran,
      r.nama_peran,
      p.nama_lengkap,
      p.email,
      p.nomor_telepon,
      p.dibuat_pada,
      p.diperbarui_pada
    FROM pengguna p
    JOIN peran r ON p.id_peran = r.id_peran
    ORDER BY p.id_pengguna ASC
  `);

  return rows;
};

// Mengambil pengguna berdasarkan ID
export const getPenggunaById = async (id) => {
  const [rows] = await pool.query(
    `SELECT
      p.id_pengguna,
      p.id_peran,
      r.nama_peran,
      p.nama_lengkap,
      p.email,
      p.nomor_telepon,
      p.dibuat_pada,
      p.diperbarui_pada
    FROM pengguna p
    JOIN peran r ON p.id_peran = r.id_peran
    WHERE p.id_pengguna = ?`,
    [id]
  );

  return rows[0];
};

// Mengambil pengguna berdasarkan email (untuk login)
export const getPenggunaByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT
      p.*,
      r.nama_peran
    FROM pengguna p
    JOIN peran r ON p.id_peran = r.id_peran
    WHERE p.email = ?`,
    [email]
  );

  return rows[0];
};

// Menambahkan pengguna
export const createPengguna = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO pengguna
    (id_peran, nama_lengkap, email, kata_sandi, nomor_telepon)
    VALUES (?, ?, ?, ?, ?)`,
    [
      data.id_peran,
      data.nama_lengkap,
      data.email,
      data.kata_sandi,
      data.nomor_telepon,
    ]
  );

  return result;
};

// Mengubah pengguna
export const updatePengguna = async (id, data) => {
  const [result] = await pool.query(
    `UPDATE pengguna
    SET id_peran = ?,
        nama_lengkap = ?,
        email = ?,
        nomor_telepon = ?
    WHERE id_pengguna = ?`,
    [
      data.id_peran,
      data.nama_lengkap,
      data.email,
      data.nomor_telepon,
      id,
    ]
  );

  return result;
};

// Mengubah password pengguna
export const updatePasswordPengguna = async (id, kata_sandi) => {
  const [result] = await pool.query(
    `UPDATE pengguna
    SET kata_sandi = ?
    WHERE id_pengguna = ?`,
    [kata_sandi, id]
  );

  return result;
};

// Menghapus pengguna
export const deletePengguna = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM pengguna WHERE id_pengguna = ?",
    [id]
  );

  return result;
};