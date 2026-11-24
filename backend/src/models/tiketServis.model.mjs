import pool from "../config/db.mjs";

const BASE_SELECT = `
  SELECT
    t.id_tiket,
    t.nomor_tiket,
    t.id_pelanggan,
    p.nama_lengkap AS nama_pelanggan,
    t.id_jenis_perangkat,
    jp.nama_jenis,
    t.id_merek,
    m.nama_merek,
    t.id_kategori,
    k.nama_kategori,
    t.id_status,
    s.nama_status,
    t.model_perangkat,
    t.nomor_seri,
    t.keluhan,
    t.estimasi_biaya,
    t.biaya_akhir,
    t.dibuat_pada,
    t.diperbarui_pada
  FROM tiket_servis t
  JOIN pengguna p ON t.id_pelanggan = p.id_pengguna
  JOIN jenis_perangkat jp
    ON t.id_jenis_perangkat = jp.id_jenis_perangkat
  JOIN merek m ON t.id_merek = m.id_merek
  JOIN kategori_layanan k ON t.id_kategori = k.id_kategori
  JOIN status_servis s ON t.id_status = s.id_status
`;

// GET - Mengambil semua tiket servis
export const getAllTiketServis = async () => {
  const [rows] = await pool.query(`
    ${BASE_SELECT}
    ORDER BY t.id_tiket DESC
  `);

  return rows;
};

// GET - Mengambil tiket servis milik pelanggan tertentu
export const getTiketServisByPelanggan = async (idPelanggan) => {
  const [rows] = await pool.query(
    `${BASE_SELECT}
     WHERE t.id_pelanggan = ?
     ORDER BY t.id_tiket DESC`,
    [idPelanggan]
  );

  return rows;
};

// GET - Mengambil tiket servis yang ditugaskan ke teknisi tertentu
export const getTiketServisByTeknisi = async (idTeknisi) => {
  const [rows] = await pool.query(
    `SELECT DISTINCT
      t.id_tiket,
      t.nomor_tiket,
      t.id_pelanggan,
      p.nama_lengkap AS nama_pelanggan,
      t.id_jenis_perangkat,
      jp.nama_jenis,
      t.id_merek,
      m.nama_merek,
      t.id_kategori,
      k.nama_kategori,
      t.id_status,
      s.nama_status,
      t.model_perangkat,
      t.nomor_seri,
      t.keluhan,
      t.estimasi_biaya,
      t.biaya_akhir,
      t.dibuat_pada,
      t.diperbarui_pada
    FROM tiket_servis t
    JOIN pengguna p ON t.id_pelanggan = p.id_pengguna
    JOIN jenis_perangkat jp
      ON t.id_jenis_perangkat = jp.id_jenis_perangkat
    JOIN merek m ON t.id_merek = m.id_merek
    JOIN kategori_layanan k ON t.id_kategori = k.id_kategori
    JOIN status_servis s ON t.id_status = s.id_status
    JOIN penugasan_teknisi pt ON pt.id_tiket = t.id_tiket
    WHERE pt.id_teknisi = ?
    ORDER BY t.id_tiket DESC`,
    [idTeknisi]
  );

  return rows;
};

// GET - Mengambil tiket berdasarkan ID
export const getTiketServisById = async (id) => {
  const [rows] = await pool.query(
    `${BASE_SELECT}
     WHERE t.id_tiket = ?`,
    [id]
  );

  return rows[0];
};

// POST - Membuat tiket servis
export const createTiketServis = async (data) => {
  const [result] = await pool.query(`
    INSERT INTO tiket_servis (
      nomor_tiket,
      id_pelanggan,
      id_jenis_perangkat,
      id_merek,
      id_kategori,
      id_status,
      model_perangkat,
      nomor_seri,
      keluhan
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.nomor_tiket,
    data.id_pelanggan,
    data.id_jenis_perangkat,
    data.id_merek,
    data.id_kategori,
    data.id_status,
    data.model_perangkat,
    data.nomor_seri,
    data.keluhan,
  ]);

  return result;
};

// PUT/PATCH - Memperbarui tiket servis
export const updateTiketServis = async (id, data) => {
  const allowedFields = [
    "id_status",
    "estimasi_biaya",
    "biaya_akhir",
    "id_kategori",
    "model_perangkat",
    "nomor_seri",
    "keluhan",
  ];

  const updates = [];
  const values = [];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (updates.length === 0) {
    return { affectedRows: 0 };
  }

  values.push(id);

  const [result] = await pool.query(
    `UPDATE tiket_servis
     SET ${updates.join(", ")}
     WHERE id_tiket = ?`,
    values
  );

  return result;
};