import {
  getAllKategori,
  createKategori,
  getKategoriById,
  updateKategori,
  deleteKategori,
} from "../models/kategori.model.mjs";

export const getKategori = async (req, res) => {
  try {
    const data = await getAllKategori();

    res.json({
      status: "success",
      message: "Data kategori layanan berhasil diambil!",
      data: data,
    });
  } catch (error) {
    console.error("Error mengambil kategori:", error);

    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data kategori layanan!",
    });
  }
};

export const createKategoriController = async (req, res) => {
  try {
    const { nama_kategori, deskripsi } = req.body;

    if (!nama_kategori || nama_kategori.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Nama kategori wajib diisi!",
      });
    }

    const result = await createKategori(
      nama_kategori.trim(),
      deskripsi?.trim() || null
    );

    res.status(201).json({
      status: "success",
      message: "Kategori layanan berhasil ditambahkan!",
      data: {
        id_kategori: result.insertId,
        nama_kategori: nama_kategori.trim(),
        deskripsi: deskripsi?.trim() || null,
      },
    });
  } catch (error) {
    console.error("Error menambahkan kategori:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        status: "error",
        message: "Nama kategori sudah tersedia!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal menambahkan kategori layanan!",
    });
  }
};

export const updateKategoriController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama_kategori, deskripsi } = req.body;

    // Validasi ID
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID kategori tidak valid!",
      });
    }

    // Validasi nama kategori
    if (!nama_kategori || nama_kategori.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Nama kategori wajib diisi!",
      });
    }

    // Periksa apakah kategori tersedia
    const kategori = await getKategoriById(id);

    if (!kategori) {
      return res.status(404).json({
        status: "error",
        message: "Kategori tidak ditemukan!",
      });
    }

    // Lakukan update
    await updateKategori(
      id,
      nama_kategori.trim(),
      deskripsi?.trim() || null
    );

    res.json({
      status: "success",
      message: "Kategori layanan berhasil diperbarui!",
      data: {
        id_kategori: id,
        nama_kategori: nama_kategori.trim(),
        deskripsi: deskripsi?.trim() || null,
      },
    });
  } catch (error) {
    console.error("Error memperbarui kategori:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        status: "error",
        message: "Nama kategori sudah digunakan!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui kategori layanan!",
    });
  }
};

export const deleteKategoriController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validasi ID
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID kategori tidak valid!",
      });
    }

    // Periksa apakah kategori tersedia
    const kategori = await getKategoriById(id);

    if (!kategori) {
      return res.status(404).json({
        status: "error",
        message: "Kategori tidak ditemukan!",
      });
    }

    // Hapus kategori
    await deleteKategori(id);

    res.json({
      status: "success",
      message: "Kategori layanan berhasil dihapus!",
      data: {
        id_kategori: id,
        nama_kategori: kategori.nama_kategori,
      },
    });
  } catch (error) {
    console.error("Error menghapus kategori:", error);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        status: "error",
        message:
          "Kategori tidak dapat dihapus karena sudah digunakan oleh tiket servis!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal menghapus kategori layanan!",
    });
  }
};