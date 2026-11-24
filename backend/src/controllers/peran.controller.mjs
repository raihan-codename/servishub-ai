import { getAllPeran } from "../models/peran.model.mjs";

export const getPeran = async (req, res) => {
  try {
    const data = await getAllPeran();

    res.status(200).json({
      status: "success",
      message: "Data peran berhasil diambil!",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data peran!",
    });
  }
};