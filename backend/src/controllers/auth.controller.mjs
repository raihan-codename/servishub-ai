import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  getPenggunaByEmail,
  getPenggunaById,
  createPengguna,
} from "../models/pengguna.model.mjs";
import { getAllPeran } from "../models/peran.model.mjs";

export const loginController = async (req, res) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        status: "error",
        message: "Konfigurasi JWT_SECRET belum diatur di server.",
      });
    }

    const email = req.body?.email;
    const password = req.body?.kata_sandi ?? req.body?.password;

    if (typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Email wajib diisi!",
      });
    }

    if (typeof password !== "string" || password === "") {
      return res.status(400).json({
        status: "error",
        message: "Password wajib diisi!",
      });
    }

    const pengguna = await getPenggunaByEmail(email.trim().toLowerCase());
    if (!pengguna) {
      return res.status(401).json({
        status: "error",
        message: "Email atau password salah!",
      });
    }

    const passwordCocok = await bcrypt.compare(password, pengguna.kata_sandi);
    if (!passwordCocok) {
      return res.status(401).json({
        status: "error",
        message: "Email atau password salah!",
      });
    }

    const userPayload = {
      id_pengguna: pengguna.id_pengguna,
      id_peran: pengguna.id_peran,
      nama_peran: pengguna.nama_peran,
      nama_lengkap: pengguna.nama_lengkap,
      email: pengguna.email,
      nomor_telepon: pengguna.nomor_telepon,
    };

    const token = jwt.sign(userPayload, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    res.status(200).json({
      status: "success",
      message: "Login berhasil!",
      data: {
        token,
        user: userPayload,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message:
        error.code === "ECONNREFUSED" || error.code === "ER_ACCESS_DENIED_ERROR"
          ? "Database tidak tersedia. Periksa koneksi MySQL server."
          : "Gagal memproses login. Silakan coba lagi.",
    });
  }
};

export const registerController = async (req, res) => {
  try {
    const nama_lengkap = req.body?.nama_lengkap;
    const email = req.body?.email;
    const password = req.body?.kata_sandi ?? req.body?.password;
    const nomor_telepon = req.body?.nomor_telepon;

    if (typeof nama_lengkap !== "string" || nama_lengkap.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Nama lengkap wajib diisi!",
      });
    }

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        status: "error",
        message: "Format email tidak valid!",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Password minimal 8 karakter!",
      });
    }

    const emailNormal = email.trim().toLowerCase();
    const existing = await getPenggunaByEmail(emailNormal);
    if (existing) {
      return res.status(409).json({
        status: "error",
        message: "Email sudah terdaftar!",
      });
    }

    const peranList = await getAllPeran();
    const pelangganRole = peranList.find(
      (item) => String(item.nama_peran).toLowerCase() === "pelanggan"
    );

    if (!pelangganRole) {
      return res.status(500).json({
        status: "error",
        message: "Peran Pelanggan belum tersedia di database.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await createPengguna({
      id_peran: pelangganRole.id_peran,
      nama_lengkap: nama_lengkap.trim(),
      email: emailNormal,
      kata_sandi: passwordHash,
      nomor_telepon: nomor_telepon?.trim() || null,
    });

    res.status(201).json({
      status: "success",
      message: "Registrasi berhasil! Silakan login.",
      data: {
        id_pengguna: result.insertId,
        id_peran: pelangganRole.id_peran,
        nama_peran: pelangganRole.nama_peran,
        nama_lengkap: nama_lengkap.trim(),
        email: emailNormal,
        nomor_telepon: nomor_telepon?.trim() || null,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal melakukan registrasi.",
    });
  }
};

export const getMeController = async (req, res) => {
  try {
    const user = await getPenggunaById(req.user.id_pengguna);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Pengguna tidak ditemukan.",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil profil pengguna.",
    });
  }
};
