import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Akses ditolak. Token autentikasi tidak ditemukan.",
      });
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Akses ditolak. Token tidak valid.",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        status: "error",
        message: "Konfigurasi JWT_SECRET belum diatur di server.",
      });
    }

    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Sesi login telah berakhir. Silakan login kembali.",
      });
    }

    return res.status(401).json({
      status: "error",
      message: "Token autentikasi tidak valid.",
    });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles.map((role) => role.toLowerCase());

  return (req, res, next) => {
    if (!req.user || !req.user.nama_peran) {
      return res.status(403).json({
        status: "error",
        message: "Akses ditolak. Peran pengguna tidak ditemukan.",
      });
    }

    const userRole = String(req.user.nama_peran).toLowerCase();
    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        status: "error",
        message: "Anda tidak memiliki izin untuk mengakses fitur ini.",
      });
    }

    next();
  };
};
