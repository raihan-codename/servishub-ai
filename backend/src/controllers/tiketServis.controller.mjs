import {
  getAllTiketServis,
  getTiketServisByPelanggan,
  getTiketServisByTeknisi,
  getTiketServisById,
  createTiketServis,
  updateTiketServis,
} from "../models/tiketServis.model.mjs";
import { getAllStatusServis, getStatusServisById } from "../models/statusServis.model.mjs";
import { createRiwayatStatus } from "../models/riwayat_status.model.mjs";

// Membuat nomor tiket otomatis
const generateNomorTiket = () => {
  const waktu = new Date();
  const tanggal = waktu.toISOString().slice(0, 10).replace(/-/g, "");
  const angkaAcak = Math.floor(1000 + Math.random() * 9000);

  return `SH-${tanggal}-${angkaAcak}`;
};

// GET - Mengambil semua tiket (difilter otomatis sesuai role pengguna yang login)
export const getTiketServis = async (req, res) => {
  try {
    const role = String(req.user?.nama_peran || "").toLowerCase();
    let data;

    if (role === "pelanggan") {
      data = await getTiketServisByPelanggan(req.user.id_pengguna);
    } else if (role === "teknisi") {
      data = await getTiketServisByTeknisi(req.user.id_pengguna);
    } else {
      data = await getAllTiketServis();
    }

    res.status(200).json({
      status: "success",
      message: "Data tiket servis berhasil diambil!",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data tiket servis!",
    });
  }
};

// GET - Mengambil tiket berdasarkan ID
export const getTiketServisByIdController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID tiket tidak valid!",
      });
    }

    const data = await getTiketServisById(id);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Tiket servis tidak ditemukan!",
      });
    }

    const role = String(req.user?.nama_peran || "").toLowerCase();
    if (role === "pelanggan" && Number(data.id_pelanggan) !== Number(req.user.id_pengguna)) {
      return res.status(403).json({
        status: "error",
        message: "Anda tidak memiliki akses ke tiket ini!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Detail tiket servis berhasil diambil!",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Gagal mengambil detail tiket servis!",
    });
  }
};

// POST - Membuat pengajuan servis
export const createTiketServisController = async (req, res) => {
  try {
    const role = String(req.user?.nama_peran || "").toLowerCase();
    const {
      id_pelanggan: bodyPelanggan,
      id_jenis_perangkat,
      id_merek,
      id_kategori,
      id_status: bodyStatus,
      model_perangkat,
      nomor_seri,
      keluhan,
    } = req.body;

    const id_pelanggan =
      role === "pelanggan" ? req.user.id_pengguna : bodyPelanggan;

    let id_status = bodyStatus;
    if (!id_status) {
      const statusList = await getAllStatusServis();
      if (!statusList || statusList.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "Data master status servis belum tersedia!",
        });
      }
      id_status = statusList[0].id_status;
    }

    // Validasi ID relasi
    const idFields = {
      id_pelanggan,
      id_jenis_perangkat,
      id_merek,
      id_kategori,
      id_status,
    };

    for (const [field, value] of Object.entries(idFields)) {
      if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
        return res.status(400).json({
          status: "error",
          message: `${field} tidak valid!`,
        });
      }
    }

    // Validasi model perangkat
    if (
      typeof model_perangkat !== "string" ||
      model_perangkat.trim() === ""
    ) {
      return res.status(400).json({
        status: "error",
        message: "Model perangkat wajib diisi!",
      });
    }

    // Validasi keluhan
    if (typeof keluhan !== "string" || keluhan.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Keluhan wajib diisi!",
      });
    }

    const nomorTiket = generateNomorTiket();

    const result = await createTiketServis({
      nomor_tiket: nomorTiket,
      id_pelanggan: Number(id_pelanggan),
      id_jenis_perangkat: Number(id_jenis_perangkat),
      id_merek: Number(id_merek),
      id_kategori: Number(id_kategori),
      id_status: Number(id_status),
      model_perangkat: model_perangkat.trim(),
      nomor_seri: nomor_seri?.trim() || null,
      keluhan: keluhan.trim(),
    });

    // Catat riwayat status awal
    await createRiwayatStatus({
      id_tiket: result.insertId,
      id_status: Number(id_status),
      diubah_oleh: req.user?.id_pengguna || Number(id_pelanggan),
      keterangan: "Tiket servis diajukan",
    });

    const createdTicket = await getTiketServisById(result.insertId);

    res.status(201).json({
      status: "success",
      message: "Pengajuan servis berhasil dibuat!",
      data: createdTicket || {
        id_tiket: result.insertId,
        nomor_tiket: nomorTiket,
        id_pelanggan: Number(id_pelanggan),
        id_jenis_perangkat: Number(id_jenis_perangkat),
        id_merek: Number(id_merek),
        id_kategori: Number(id_kategori),
        id_status: Number(id_status),
        model_perangkat: model_perangkat.trim(),
        nomor_seri: nomor_seri?.trim() || null,
        keluhan: keluhan.trim(),
      },
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        status: "error",
        message: "Data relasi pelanggan, perangkat, merek, kategori, atau status tidak ditemukan!",
      });
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        status: "error",
        message: "Nomor tiket sudah digunakan, silakan coba lagi!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal membuat pengajuan servis!",
    });
  }
};

// PUT/PATCH - Mengubah status atau biaya tiket servis + mencatat riwayat_status
export const updateTiketServisController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID tiket tidak valid!",
      });
    }

    const tiketLama = await getTiketServisById(id);
    if (!tiketLama) {
      return res.status(404).json({
        status: "error",
        message: "Tiket servis tidak ditemukan!",
      });
    }

    const {
      id_status,
      estimasi_biaya,
      biaya_akhir,
      id_kategori,
      model_perangkat,
      nomor_seri,
      keluhan,
      keterangan,
    } = req.body;

    const updatePayload = {};

    if (id_status !== undefined) {
      const statusId = Number(id_status);
      if (!Number.isInteger(statusId) || statusId <= 0) {
        return res.status(400).json({
          status: "error",
          message: "ID status tidak valid!",
        });
      }

      const statusData = await getStatusServisById(statusId);
      if (!statusData) {
        return res.status(400).json({
          status: "error",
          message: "Status servis tidak ditemukan!",
        });
      }

      updatePayload.id_status = statusId;
    }

    if (estimasi_biaya !== undefined) {
      if (estimasi_biaya === null || estimasi_biaya === "") {
        updatePayload.estimasi_biaya = null;
      } else {
        const nilai = Number(estimasi_biaya);
        if (Number.isNaN(nilai) || nilai < 0) {
          return res.status(400).json({
            status: "error",
            message: "Estimasi biaya tidak valid!",
          });
        }
        updatePayload.estimasi_biaya = nilai;
      }
    }

    if (biaya_akhir !== undefined) {
      if (biaya_akhir === null || biaya_akhir === "") {
        updatePayload.biaya_akhir = null;
      } else {
        const nilai = Number(biaya_akhir);
        if (Number.isNaN(nilai) || nilai < 0) {
          return res.status(400).json({
            status: "error",
            message: "Biaya akhir tidak valid!",
          });
        }
        updatePayload.biaya_akhir = nilai;
      }
    }

    if (id_kategori !== undefined) {
      const katId = Number(id_kategori);
      if (!Number.isInteger(katId) || katId <= 0) {
        return res.status(400).json({
          status: "error",
          message: "ID kategori tidak valid!",
        });
      }
      updatePayload.id_kategori = katId;
    }

    if (model_perangkat !== undefined) {
      if (typeof model_perangkat !== "string" || model_perangkat.trim() === "") {
        return res.status(400).json({
          status: "error",
          message: "Model perangkat tidak boleh kosong!",
        });
      }
      updatePayload.model_perangkat = model_perangkat.trim();
    }

    if (nomor_seri !== undefined) {
      updatePayload.nomor_seri = nomor_seri?.trim() || null;
    }

    if (keluhan !== undefined) {
      if (typeof keluhan !== "string" || keluhan.trim() === "") {
        return res.status(400).json({
          status: "error",
          message: "Keluhan tidak boleh kosong!",
        });
      }
      updatePayload.keluhan = keluhan.trim();
    }

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Tidak ada data yang diperbarui!",
      });
    }

    await updateTiketServis(id, updatePayload);

    // Catat ke riwayat_status jika status berubah (atau ada keterangan perubahan status)
    if (
      updatePayload.id_status !== undefined &&
      (Number(updatePayload.id_status) !== Number(tiketLama.id_status) ||
        (typeof keterangan === "string" && keterangan.trim() !== ""))
    ) {
      await createRiwayatStatus({
        id_tiket: id,
        id_status: updatePayload.id_status,
        diubah_oleh: req.user.id_pengguna,
        keterangan:
          typeof keterangan === "string" && keterangan.trim() !== ""
            ? keterangan.trim()
            : "Status tiket diperbarui",
      });
    }

    const updatedTicket = await getTiketServisById(id);

    res.status(200).json({
      status: "success",
      message: "Tiket servis berhasil diperbarui!",
      data: updatedTicket,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        status: "error",
        message: "Data relasi tidak ditemukan!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui tiket servis!",
    });
  }
};