import bcrypt from "bcryptjs";

import {
  getAllPengguna,
  getPenggunaById,
  getPenggunaByEmail,
  createPengguna,
  updatePengguna,
  updatePasswordPengguna,
  deletePengguna,
} from "../models/pengguna.model.mjs";

import { getAllPeran } from "../models/peran.model.mjs";

// GET - Mengambil semua pengguna
export const getPengguna = async (req, res) => {
  try {
    const data = await getAllPengguna();

    res.status(200).json({
      status: "success",
      message: "Data pengguna berhasil diambil!",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data pengguna!",
    });
  }
};

// GET - Mengambil pengguna berdasarkan ID
export const getPenggunaByIdController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID pengguna tidak valid!",
      });
    }

    const data = await getPenggunaById(id);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Pengguna tidak ditemukan!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data pengguna berhasil ditemukan!",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data pengguna!",
    });
  }
};

// POST - Menambahkan pengguna
export const createPenggunaController = async (req, res) => {
  try {
    const {
      id_peran,
      nama_lengkap,
      email,
      kata_sandi,
      nomor_telepon,
    } = req.body;

    if (
      !Number.isInteger(Number(id_peran)) ||
      Number(id_peran) <= 0
    ) {
      return res.status(400).json({
        status: "error",
        message: "Peran pengguna tidak valid!",
      });
    }

    if (
      typeof nama_lengkap !== "string" ||
      nama_lengkap.trim() === ""
    ) {
      return res.status(400).json({
        status: "error",
        message: "Nama lengkap wajib diisi!",
      });
    }

    if (
      typeof email !== "string" ||
      email.trim() === "" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        status: "error",
        message: "Format email tidak valid!",
      });
    }

    if (
      typeof kata_sandi !== "string" ||
      kata_sandi.length < 8
    ) {
      return res.status(400).json({
        status: "error",
        message: "Password minimal 8 karakter!",
      });
    }

    if (
      nomor_telepon !== undefined &&
      nomor_telepon !== null &&
      typeof nomor_telepon !== "string"
    ) {
      return res.status(400).json({
        status: "error",
        message: "Nomor telepon tidak valid!",
      });
    }

    // Memastikan role tersedia
    const peran = await getAllPeran();
    const peranValid = peran.some(
      (item) => item.id_peran === Number(id_peran)
    );

    if (!peranValid) {
      return res.status(400).json({
        status: "error",
        message: "Peran tidak ditemukan!",
      });
    }

    const emailNormal = email.trim().toLowerCase();

    // Memastikan email belum digunakan
    const emailAda = await getPenggunaByEmail(emailNormal);

    if (emailAda) {
      return res.status(409).json({
        status: "error",
        message: "Email sudah digunakan!",
      });
    }

    // Hash password sebelum disimpan
    const passwordHash = await bcrypt.hash(kata_sandi, 10);

    const result = await createPengguna({
      id_peran: Number(id_peran),
      nama_lengkap: nama_lengkap.trim(),
      email: emailNormal,
      kata_sandi: passwordHash,
      nomor_telepon: nomor_telepon?.trim() || null,
    });

    res.status(201).json({
      status: "success",
      message: "Pengguna berhasil ditambahkan!",
      data: {
        id_pengguna: result.insertId,
        id_peran: Number(id_peran),
        nama_lengkap: nama_lengkap.trim(),
        email: emailNormal,
        nomor_telepon: nomor_telepon?.trim() || null,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        status: "error",
        message: "Email sudah digunakan!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal menambahkan pengguna!",
    });
  }
};

// PUT - Mengubah data pengguna (tanpa password)
export const updatePenggunaController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      id_peran,
      nama_lengkap,
      email,
      nomor_telepon,
    } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID pengguna tidak valid!",
      });
    }

    if (
      !Number.isInteger(Number(id_peran)) ||
      Number(id_peran) <= 0
    ) {
      return res.status(400).json({
        status: "error",
        message: "Peran pengguna tidak valid!",
      });
    }

    if (
      typeof nama_lengkap !== "string" ||
      nama_lengkap.trim() === ""
    ) {
      return res.status(400).json({
        status: "error",
        message: "Nama lengkap wajib diisi!",
      });
    }

    if (
      typeof email !== "string" ||
      email.trim() === "" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        status: "error",
        message: "Format email tidak valid!",
      });
    }

    const penggunaLama = await getPenggunaById(id);

    if (!penggunaLama) {
      return res.status(404).json({
        status: "error",
        message: "Pengguna tidak ditemukan!",
      });
    }

    const peran = await getAllPeran();
    const peranValid = peran.some(
      (item) => item.id_peran === Number(id_peran)
    );

    if (!peranValid) {
      return res.status(400).json({
        status: "error",
        message: "Peran tidak ditemukan!",
      });
    }

    const emailNormal = email.trim().toLowerCase();
    const emailAda = await getPenggunaByEmail(emailNormal);

    if (emailAda && emailAda.id_pengguna !== id) {
      return res.status(409).json({
        status: "error",
        message: "Email sudah digunakan pengguna lain!",
      });
    }

    await updatePengguna(id, {
      id_peran: Number(id_peran),
      nama_lengkap: nama_lengkap.trim(),
      email: emailNormal,
      nomor_telepon: nomor_telepon?.trim() || null,
    });

    res.status(200).json({
      status: "success",
      message: "Data pengguna berhasil diperbarui!",
      data: {
        id_pengguna: id,
        id_peran: Number(id_peran),
        nama_lengkap: nama_lengkap.trim(),
        email: emailNormal,
        nomor_telepon: nomor_telepon?.trim() || null,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui data pengguna!",
    });
  }
};

// PUT - Mengubah password pengguna
export const updatePasswordPenggunaController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { kata_sandi } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID pengguna tidak valid!",
      });
    }

    if (
      typeof kata_sandi !== "string" ||
      kata_sandi.length < 8
    ) {
      return res.status(400).json({
        status: "error",
        message: "Password minimal 8 karakter!",
      });
    }

    const pengguna = await getPenggunaById(id);

    if (!pengguna) {
      return res.status(404).json({
        status: "error",
        message: "Pengguna tidak ditemukan!",
      });
    }

    const passwordHash = await bcrypt.hash(kata_sandi, 10);

    await updatePasswordPengguna(id, passwordHash);

    res.status(200).json({
      status: "success",
      message: "Password berhasil diperbarui!",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui password!",
    });
  }
};

// DELETE - Menghapus pengguna
export const deletePenggunaController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "ID pengguna tidak valid!",
      });
    }

    const data = await getPenggunaById(id);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Pengguna tidak ditemukan!",
      });
    }

    await deletePengguna(id);

    res.status(200).json({
      status: "success",
      message: "Pengguna berhasil dihapus!",
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        status: "error",
        message: "Pengguna tidak dapat dihapus karena masih memiliki data terkait!",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Gagal menghapus pengguna!",
    });
  }
};