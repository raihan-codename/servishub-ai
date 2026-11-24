import pool from "../config/db.mjs";

export const getAllKategori = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM kategori_layanan ORDER BY id_kategori ASC"
  );

  return rows;
};

export const createKategori = async (nama_kategori, deskripsi) => {
  const [result] = await pool.query(
    `INSERT INTO kategori_layanan (nama_kategori, deskripsi)
     VALUES (?, ?)`,
    [nama_kategori, deskripsi]
  );

  return result;
};

// Mengambil kategori berdasarkan ID
export const getKategoriById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM kategori_layanan WHERE id_kategori = ?",
    [id]
  );

  return rows[0];
};

// Mengubah kategori berdasarkan ID
export const updateKategori = async (id, nama_kategori, deskripsi) => {
  const [result] = await pool.query(
    `UPDATE kategori_layanan
     SET nama_kategori = ?, deskripsi = ?
     WHERE id_kategori = ?`,
    [nama_kategori, deskripsi, id]
  );

  return result;
};

// Menghapus kategori berdasarkan ID
export const deleteKategori = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM kategori_layanan WHERE id_kategori = ?",
    [id]
  );

  return result;
};