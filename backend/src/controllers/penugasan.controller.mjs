import {
  getAllPenugasan,
  getPenugasanById,
  getPenugasanAktifByTiket,
  createPenugasan,
  endPenugasan,
} from "../models/penugasan.model.mjs";

// GET - Semua penugasan
export const getPenugasanController = async (req, res) => {
  try {
    const data = await getAllPenugasan();

    res.status(200).json({
      status: "success",
      message: "Data penugasan berhasil diambil!",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data penugasan!",
    });
  }
};

// GET - Penugasan berdasarkan ID
export const getPenugasanByIdController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID penugasan tidak valid!",
      });
    }

    const data = await getPenugasanById(id);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Penugasan tidak ditemukan!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Detail penugasan berhasil diambil!",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil detail penugasan!",
    });
  }
};

// POST - Menugaskan teknisi
export const createPenugasanController = async (req, res) => {
  try {
    const {
      id_tiket,
      id_teknisi,
      ditugaskan_oleh: bodyDitugaskanOleh,
    } = req.body;

    const ditugaskan_oleh = bodyDitugaskanOleh ?? req.user?.id_pengguna;

    const fields = {
      id_tiket,
      id_teknisi,
      ditugaskan_oleh,
    };

    for (const [field, value] of Object.entries(fields)) {
      if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
        return res.status(400).json({
          status: "error",
          message: `${field} tidak valid!`,
        });
      }
    }

    // Cek apakah tiket sudah memiliki teknisi aktif
    const penugasanAktif = await getPenugasanAktifByTiket(
      Number(id_tiket)
    );

    if (penugasanAktif) {
      return res.status(409).json({
        status: "error",
        message: "Tiket masih memiliki penugasan teknisi aktif!",
      });
    }

    const result = await createPenugasan({
      id_tiket: Number(id_tiket),
      id_teknisi: Number(id_teknisi),
      ditugaskan_oleh: Number(ditugaskan_oleh),
    });

    res.status(201).json({
      status: "success",
      message: "Teknisi berhasil ditugaskan!",
      data: {
        id_penugasan: result.insertId,
        id_tiket: Number(id_tiket),
        id_teknisi: Number(id_teknisi),
        ditugaskan_oleh: Number(ditugaskan_oleh),
      },
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        status: "error",
        message: "Data tiket atau pengguna tidak ditemukan!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal membuat penugasan!",
    });
  }
};

// PUT - Mengakhiri penugasan
export const endPenugasanController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID penugasan tidak valid!",
      });
    }

    const data = await getPenugasanById(id);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Penugasan tidak ditemukan!",
      });
    }

    if (data.berakhir_pada !== null) {
      return res.status(409).json({
        status: "error",
        message: "Penugasan sudah berakhir!",
      });
    }

    await endPenugasan(id);

    res.status(200).json({
      status: "success",
      message: "Penugasan berhasil diakhiri!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengakhiri penugasan!",
    });
  }
};