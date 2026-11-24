import {
  getAllRiwayatStatus,
  getRiwayatByTiket,
  createRiwayatStatus
} from "../models/riwayat_status.model.mjs";

// GET semua riwayat
export const getRiwayatStatus = async (req, res) => {
  try {
    const data = await getAllRiwayatStatus();

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

// GET riwayat berdasarkan tiket
export const getRiwayatByTiketController = async (req, res) => {
  try {
    const data = await getRiwayatByTiket(req.params.idTiket);

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

// POST tambah riwayat
export const createRiwayatStatusController = async (req, res) => {
  try {
    const {
      id_tiket,
      id_status,
      diubah_oleh: bodyDiubahOleh,
      keterangan
    } = req.body;

    const diubah_oleh = bodyDiubahOleh ?? req.user?.id_pengguna;

    if (!id_tiket || !id_status || !diubah_oleh) {
      return res.status(400).json({
        status: "error",
        message: "ID tiket, status, dan pengguna wajib diisi"
      });
    }

    const id = await createRiwayatStatus({
      id_tiket,
      id_status,
      diubah_oleh,
      keterangan
    });

    res.status(201).json({
      status: "success",
      message: "Riwayat status berhasil ditambahkan",
      data: {
        id_riwayat: id
      }
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        status: "error",
        message: "Tiket, status, atau pengguna tidak ditemukan"
      });
    }

    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};