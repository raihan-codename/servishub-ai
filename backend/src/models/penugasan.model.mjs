import pool from "../config/db.mjs";

// GET - Semua penugasan
export const getAllPenugasan = async () => {
  const [rows] = await pool.query(`
    SELECT
      pt.id_penugasan,
      pt.id_tiket,
      t.nomor_tiket,
      pt.id_teknisi,
      teknisi.nama_lengkap AS nama_teknisi,
      pt.ditugaskan_oleh,
      admin.nama_lengkap AS nama_admin,
      pt.ditugaskan_pada,
      pt.berakhir_pada
    FROM penugasan_teknisi pt
    JOIN tiket_servis t ON pt.id_tiket = t.id_tiket
    JOIN pengguna teknisi ON pt.id_teknisi = teknisi.id_pengguna
    JOIN pengguna admin ON pt.ditugaskan_oleh = admin.id_pengguna
    ORDER BY pt.id_penugasan DESC
  `);

  return rows;
};

// GET - Penugasan berdasarkan ID
export const getPenugasanById = async (id) => {
  const [rows] = await pool.query(`
    SELECT
      pt.id_penugasan,
      pt.id_tiket,
      t.nomor_tiket,
      pt.id_teknisi,
      teknisi.nama_lengkap AS nama_teknisi,
      pt.ditugaskan_oleh,
      admin.nama_lengkap AS nama_admin,
      pt.ditugaskan_pada,
      pt.berakhir_pada
    FROM penugasan_teknisi pt
    JOIN tiket_servis t ON pt.id_tiket = t.id_tiket
    JOIN pengguna teknisi ON pt.id_teknisi = teknisi.id_pengguna
    JOIN pengguna admin ON pt.ditugaskan_oleh = admin.id_pengguna
    WHERE pt.id_penugasan = ?
  `, [id]);

  return rows[0];
};

// GET - Cek penugasan aktif pada tiket
export const getPenugasanAktifByTiket = async (id_tiket) => {
  const [rows] = await pool.query(
    `SELECT * FROM penugasan_teknisi
     WHERE id_tiket = ? AND berakhir_pada IS NULL`,
    [id_tiket]
  );

  return rows[0];
};

// POST - Membuat penugasan
export const createPenugasan = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO penugasan_teknisi
    (id_tiket, id_teknisi, ditugaskan_oleh)
    VALUES (?, ?, ?)`,
    [
      data.id_tiket,
      data.id_teknisi,
      data.ditugaskan_oleh,
    ]
  );

  return result;
};

// PUT - Mengakhiri penugasan
export const endPenugasan = async (id) => {
  const [result] = await pool.query(
    `UPDATE penugasan_teknisi
     SET berakhir_pada = CURRENT_TIMESTAMP
     WHERE id_penugasan = ?`,
    [id]
  );

  return result;
};