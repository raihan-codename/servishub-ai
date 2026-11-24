import pool from "../config/db.mjs";

// GET semua status
export const getAllStatusServis = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM status_servis ORDER BY id_status ASC"
  );
  return rows;
};

// POST tambah status
export const createStatusServis = async (nama_status, keterangan) => {
  const [result] = await pool.query(
    "INSERT INTO status_servis (nama_status, keterangan) VALUES (?, ?)",
    [nama_status, keterangan]
  );
  return result;
};

// GET berdasarkan ID
export const getStatusServisById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM status_servis WHERE id_status = ?",
    [id]
  );
  return rows[0];
};

// PUT update status
export const updateStatusServis = async (id, nama_status, keterangan) => {
  const [result] = await pool.query(
    `UPDATE status_servis
     SET nama_status = ?, keterangan = ?
     WHERE id_status = ?`,
    [nama_status, keterangan, id]
  );
  return result;
};

// DELETE status
export const deleteStatusServis = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM status_servis WHERE id_status = ?",
    [id]
  );
  return result;
};