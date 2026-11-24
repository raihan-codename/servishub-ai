import {
  getAllMerek,
  createMerek,
  getMerekById,
  updateMerek,
  deleteMerek,
} from "../models/merek.model.mjs";

// GET - Semua merek
export const getMerek = async (req, res) => {
  try {
    const data = await getAllMerek();

    res.status(200).json({
      status: "success",
      message: "Data merek berhasil diambil!",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data merek!",
    });
  }
};

// GET - Merek berdasarkan ID
export const getMerekByIdController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID merek tidak valid!",
      });
    }

    const data = await getMerekById(id);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Merek tidak ditemukan!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data merek berhasil ditemukan!",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data merek!",
    });
  }
};

// POST - Tambah merek
export const createMerekController = async (req, res) => {
  try {
    const { nama_merek } = req.body;

    if (typeof nama_merek !== "string" || nama_merek.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Nama merek wajib diisi!",
      });
    }

    const namaMerek = nama_merek.trim();
    const result = await createMerek(namaMerek);

    res.status(201).json({
      status: "success",
      message: "Merek berhasil ditambahkan!",
      data: {
        id_merek: result.insertId,
        nama_merek: namaMerek,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        status: "error",
        message: "Nama merek sudah digunakan!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal menambahkan merek!",
    });
  }
};

// PUT - Mengubah merek
export const updateMerekController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama_merek } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID merek tidak valid!",
      });
    }

    if (typeof nama_merek !== "string" || nama_merek.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Nama merek wajib diisi!",
      });
    }

    const dataLama = await getMerekById(id);

    if (!dataLama) {
      return res.status(404).json({
        status: "error",
        message: "Merek tidak ditemukan!",
      });
    }

    const namaMerek = nama_merek.trim();
    await updateMerek(id, namaMerek);

    res.status(200).json({
      status: "success",
      message: "Merek berhasil diperbarui!",
      data: {
        id_merek: id,
        nama_merek: namaMerek,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        status: "error",
        message: "Nama merek sudah digunakan!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui merek!",
    });
  }
};

// DELETE - Menghapus merek
export const deleteMerekController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID merek tidak valid!",
      });
    }

    const data = await getMerekById(id);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Merek tidak ditemukan!",
      });
    }

    await deleteMerek(id);

    res.status(200).json({
      status: "success",
      message: "Merek berhasil dihapus!",
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        status: "error",
        message: "Merek tidak dapat dihapus karena masih digunakan!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal menghapus merek!",
    });
  }
};