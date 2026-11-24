import {
  getAllStatusServis,
  createStatusServis,
  getStatusServisById,
  updateStatusServis,
  deleteStatusServis,
} from "../models/statusServis.model.mjs";

// GET semua status
export const getStatusServis = async (req, res) => {
  try {
    const data = await getAllStatusServis();
    res.status(200).json({
      status: "success",
      message: "Data status servis berhasil diambil!",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data status servis!",
    });
  }
};

// GET status berdasarkan ID
export const getStatusServisByIdController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID status tidak valid!",
      });
    }

    const data = await getStatusServisById(id);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Status servis tidak ditemukan!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Status servis berhasil ditemukan!",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil status servis!",
    });
  }
};

// POST tambah status
export const createStatusServisController = async (req, res) => {
  try {
    const { nama_status, keterangan } = req.body;

    if (typeof nama_status !== "string" || nama_status.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Nama status wajib diisi!",
      });
    }

    const namaStatus = nama_status.trim();
    const keteranganStatus =
      typeof keterangan === "string" && keterangan.trim() !== ""
        ? keterangan.trim()
        : null;

    const result = await createStatusServis(namaStatus, keteranganStatus);

    res.status(201).json({
      status: "success",
      message: "Status servis berhasil ditambahkan!",
      data: {
        id_status: result.insertId,
        nama_status: namaStatus,
        keterangan: keteranganStatus,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        status: "error",
        message: "Nama status sudah digunakan!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal menambahkan status servis!",
    });
  }
};

// PUT update status
export const updateStatusServisController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama_status, keterangan } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID status tidak valid!",
      });
    }

    if (typeof nama_status !== "string" || nama_status.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Nama status wajib diisi!",
      });
    }

    const dataLama = await getStatusServisById(id);

    if (!dataLama) {
      return res.status(404).json({
        status: "error",
        message: "Status servis tidak ditemukan!",
      });
    }

    const namaStatus = nama_status.trim();
    const keteranganStatus =
      typeof keterangan === "string" && keterangan.trim() !== ""
        ? keterangan.trim()
        : null;

    await updateStatusServis(id, namaStatus, keteranganStatus);

    res.status(200).json({
      status: "success",
      message: "Status servis berhasil diperbarui!",
      data: {
        id_status: id,
        nama_status: namaStatus,
        keterangan: keteranganStatus,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        status: "error",
        message: "Nama status sudah digunakan!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui status servis!",
    });
  }
};

// DELETE status
export const deleteStatusServisController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID status tidak valid!",
      });
    }

    const data = await getStatusServisById(id);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Status servis tidak ditemukan!",
      });
    }

    await deleteStatusServis(id);

    res.status(200).json({
      status: "success",
      message: "Status servis berhasil dihapus!",
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        status: "error",
        message: "Status tidak dapat dihapus karena masih digunakan!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal menghapus status servis!",
    });
  }
};