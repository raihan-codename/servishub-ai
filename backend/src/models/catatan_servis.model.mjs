import pool from "../config/db.mjs";

// Ambil semua catatan servis
export const getAllCatatanServis = async () => {
  const [rows] = await pool.query(`
    SELECT
      cs.*,
      ts.nomor_tiket,
      p.nama_lengkap AS nama_teknisi
    FROM catatan_servis cs
    JOIN tiket_servis ts ON cs.id_tiket = ts.id_tiket
    JOIN pengguna p ON cs.id_teknisi = p.id_pengguna
    ORDER BY cs.dibuat_pada DESC
  `);

  return rows;
};

// Ambil catatan berdasarkan ID
export const getCatatanServisById = async (id) => {
  const [rows] = await pool.query(`
    SELECT
      cs.*,
      ts.nomor_tiket,
      p.nama_lengkap AS nama_teknisi
    FROM catatan_servis cs
    JOIN tiket_servis ts ON cs.id_tiket = ts.id_tiket
    JOIN pengguna p ON cs.id_teknisi = p.id_pengguna
    WHERE cs.id_catatan = ?
  `, [id]);

  return rows[0];
};

// Ambil catatan berdasarkan tiket
export const getCatatanByTiket = async (idTiket) => {
  const [rows] = await pool.query(`
    SELECT
      cs.*,
      p.nama_lengkap AS nama_teknisi
    FROM catatan_servis cs
    JOIN pengguna p ON cs.id_teknisi = p.id_pengguna
    WHERE cs.id_tiket = ?
    ORDER BY cs.dibuat_pada ASC
  `, [idTiket]);

  return rows;
};

// Tambah catatan servis
export const createCatatanServis = async (data) => {
  const {
    id_tiket,
    id_teknisi,
    diagnosis,
    tindakan_perbaikan
  } = data;

  const [result] = await pool.query(`
    INSERT INTO catatan_servis
    (id_tiket, id_teknisi, diagnosis, tindakan_perbaikan)
    VALUES (?, ?, ?, ?)
  `, [
    id_tiket,
    id_teknisi,
    diagnosis,
    tindakan_perbaikan || null
  ]);

  return result.insertId;
};

// Update catatan servis
export const updateCatatanServis = async (id, data) => {
  const {
    diagnosis,
    tindakan_perbaikan
  } = data;

  const [result] = await pool.query(`
    UPDATE catatan_servis
    SET diagnosis = ?, tindakan_perbaikan = ?
    WHERE id_catatan = ?
  `, [
    diagnosis,
    tindakan_perbaikan || null,
    id
  ]);

  return result.affectedRows;
};

// Hapus catatan servis
export const deleteCatatanServis = async (id) => {
  const [result] = await pool.query(`
    DELETE FROM catatan_servis
    WHERE id_catatan = ?
  `, [id]);

  return result.affectedRows;
};