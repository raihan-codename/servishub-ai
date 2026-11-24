import pool from "../config/db.mjs";

// Ambil semua riwayat status
export const getAllRiwayatStatus = async () => {
  const [rows] = await pool.query(`
    SELECT
      rs.*,
      ts.nomor_tiket,
      ss.nama_status,
      p.nama_lengkap AS nama_pengubah
    FROM riwayat_status rs
    JOIN tiket_servis ts ON rs.id_tiket = ts.id_tiket
    JOIN status_servis ss ON rs.id_status = ss.id_status
    JOIN pengguna p ON rs.diubah_oleh = p.id_pengguna
    ORDER BY rs.diubah_pada DESC
  `);

  return rows;
};

// Ambil riwayat berdasarkan tiket
export const getRiwayatByTiket = async (idTiket) => {
  const [rows] = await pool.query(`
    SELECT
      rs.*,
      ss.nama_status,
      p.nama_lengkap AS nama_pengubah
    FROM riwayat_status rs
    JOIN status_servis ss ON rs.id_status = ss.id_status
    JOIN pengguna p ON rs.diubah_oleh = p.id_pengguna
    WHERE rs.id_tiket = ?
    ORDER BY rs.diubah_pada ASC
  `, [idTiket]);

  return rows;
};

// Tambah riwayat status
export const createRiwayatStatus = async (data) => {
  const {
    id_tiket,
    id_status,
    diubah_oleh,
    keterangan
  } = data;

  const [result] = await pool.query(`
    INSERT INTO riwayat_status
    (id_tiket, id_status, diubah_oleh, keterangan)
    VALUES (?, ?, ?, ?)
  `, [
    id_tiket,
    id_status,
    diubah_oleh,
    keterangan || null
  ]);

  return result.insertId;
};