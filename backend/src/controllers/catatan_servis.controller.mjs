import {
  getAllCatatanServis,
  getCatatanServisById,
  getCatatanByTiket,
  createCatatanServis,
  updateCatatanServis,
  deleteCatatanServis
} from "../models/catatan_servis.model.mjs";

// GET semua catatan
export const getCatatanServis = async (req, res) => {
  try {
    const data = await getAllCatatanServis();

    res.status(200).json({
      status: "success",
      data
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// GET catatan berdasarkan ID
export const getCatatanServisByIdController = async (req, res) => {
  try {
    const data = await getCatatanServisById(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Catatan servis tidak ditemukan"
      });
    }

    res.status(200).json({
      status: "success",
      data
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// GET catatan berdasarkan tiket
export const getCatatanByTiketController = async (req, res) => {
  try {
    const data = await getCatatanByTiket(req.params.idTiket);

    res.status(200).json({
      status: "success",
      data
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// POST tambah catatan
export const createCatatanServisController = async (req, res) => {
  try {
    const {
      id_tiket,
      id_teknisi: bodyTeknisi,
      diagnosis,
      tindakan_perbaikan
    } = req.body;

    const id_teknisi = bodyTeknisi ?? req.user?.id_pengguna;

    if (!id_tiket || !id_teknisi || !diagnosis?.trim()) {
      return res.status(400).json({
        status: "error",
        message: "ID tiket, ID teknisi, dan diagnosis wajib diisi"
      });
    }

    const id = await createCatatanServis({
      id_tiket,
      id_teknisi,
      diagnosis: diagnosis.trim(),
      tindakan_perbaikan: tindakan_perbaikan?.trim() || null,
    });

    res.status(201).json({
      status: "success",
      message: "Catatan servis berhasil ditambahkan",
      data: { id_catatan: id }
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        status: "error",
        message: "Tiket atau teknisi tidak ditemukan"
      });
    }

    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// PUT update catatan
export const updateCatatanServisController = async (req, res) => {
  try {
    const { diagnosis, tindakan_perbaikan } = req.body;

    if (!diagnosis?.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Diagnosis wajib diisi"
      });
    }

    const result = await updateCatatanServis(
      req.params.id,
      { diagnosis, tindakan_perbaikan }
    );

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "Catatan servis tidak ditemukan"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Catatan servis berhasil diperbarui"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// DELETE catatan
export const deleteCatatanServisController = async (req, res) => {
  try {
    const result = await deleteCatatanServis(req.params.id);

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "Catatan servis tidak ditemukan"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Catatan servis berhasil dihapus"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};