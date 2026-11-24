import {
  getAllJenisPerangkat,
  createJenisPerangkat,
  getJenisPerangkatById,
  updateJenisPerangkat,
  deleteJenisPerangkat,
} from "../models/jenisPerangkat.model.mjs";

// GET - Mengambil semua jenis perangkat
export const getJenisPerangkat = async (req, res) => {
  try {
    const data = await getAllJenisPerangkat();

    res.status(200).json({
      status: "success",
      message: "Data jenis perangkat berhasil diambil!",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data jenis perangkat!",
    });
  }
};

// GET - Mengambil jenis perangkat berdasarkan ID
export const getJenisPerangkatByIdController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID jenis perangkat tidak valid!",
      });
    }

    const data = await getJenisPerangkatById(id);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Jenis perangkat tidak ditemukan!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data jenis perangkat berhasil ditemukan!",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data jenis perangkat!",
    });
  }
};

// POST - Menambahkan jenis perangkat
export const createJenisPerangkatController = async (req, res) => {
  try {
    const { nama_jenis } = req.body;

    if (typeof nama_jenis !== "string" || nama_jenis.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Nama jenis perangkat wajib diisi!",
      });
    }

    const namaJenis = nama_jenis.trim();

    const result = await createJenisPerangkat(namaJenis);

    res.status(201).json({
      status: "success",
      message: "Jenis perangkat berhasil ditambahkan!",
      data: {
        id_jenis_perangkat: result.insertId,
        nama_jenis: namaJenis,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        status: "error",
        message: "Nama jenis perangkat sudah digunakan!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal menambahkan jenis perangkat!",
    });
  }
};

// PUT - Mengubah jenis perangkat
export const updateJenisPerangkatController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama_jenis } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID jenis perangkat tidak valid!",
      });
    }

    if (typeof nama_jenis !== "string" || nama_jenis.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Nama jenis perangkat wajib diisi!",
      });
    }

    const dataLama = await getJenisPerangkatById(id);

    if (!dataLama) {
      return res.status(404).json({
        status: "error",
        message: "Jenis perangkat tidak ditemukan!",
      });
    }

    const namaJenis = nama_jenis.trim();

    await updateJenisPerangkat(id, namaJenis);

    res.status(200).json({
      status: "success",
      message: "Jenis perangkat berhasil diperbarui!",
      data: {
        id_jenis_perangkat: id,
        nama_jenis: namaJenis,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        status: "error",
        message: "Nama jenis perangkat sudah digunakan!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui jenis perangkat!",
    });
  }
};

// DELETE - Menghapus jenis perangkat
export const deleteJenisPerangkatController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID jenis perangkat tidak valid!",
      });
    }

    const data = await getJenisPerangkatById(id);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Jenis perangkat tidak ditemukan!",
      });
    }

    await deleteJenisPerangkat(id);

    res.status(200).json({
      status: "success",
      message: "Jenis perangkat berhasil dihapus!",
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        status: "error",
        message: "Jenis perangkat tidak dapat dihapus karena masih digunakan!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal menghapus jenis perangkat!",
    });
  }
};