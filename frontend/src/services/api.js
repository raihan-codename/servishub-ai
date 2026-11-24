const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export const TOKEN_KEY = "servishub_token";
export const USER_KEY = "servishub_user";

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(
      "Tidak dapat terhubung ke server API. Pastikan backend dan database aktif.",
      0
    );
  }

  let payload = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const fallbackMsg =
      response.status >= 500
        ? "Terjadi gangguan pada server atau koneksi database."
        : `Permintaan gagal (${response.status}).`;
    const message = payload?.message || fallbackMsg;

    if (response.status === 401 && path !== "/auth/login") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    throw new ApiError(message, response.status, payload);
  }

  return payload;
}

export const authApi = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, kata_sandi: password }),
    }),
  register: (data) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  me: () => request("/auth/me"),
};

export const tiketApi = {
  getAll: () => request("/tiket-servis"),
  getById: (id) => request(`/tiket-servis/${id}`),
  create: (data) =>
    request("/tiket-servis", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/tiket-servis/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export const penugasanApi = {
  getAll: () => request("/penugasan"),
  create: (data) =>
    request("/penugasan", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  selesai: (id) =>
    request(`/penugasan/${id}/selesai`, {
      method: "PUT",
    }),
};

export const catatanApi = {
  getByTiket: (idTiket) => request(`/catatan-servis/tiket/${idTiket}`),
  create: (data) =>
    request("/catatan-servis", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/catatan-servis/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id) =>
    request(`/catatan-servis/${id}`, {
      method: "DELETE",
    }),
};

export const riwayatApi = {
  getByTiket: (idTiket) => request(`/riwayat-status/tiket/${idTiket}`),
};

export const masterApi = {
  getKategori: () => request("/kategori"),
  createKategori: (data) =>
    request("/kategori", { method: "POST", body: JSON.stringify(data) }),
  updateKategori: (id, data) =>
    request(`/kategori/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteKategori: (id) => request(`/kategori/${id}`, { method: "DELETE" }),

  getJenisPerangkat: () => request("/jenis-perangkat"),
  createJenisPerangkat: (data) =>
    request("/jenis-perangkat", { method: "POST", body: JSON.stringify(data) }),
  updateJenisPerangkat: (id, data) =>
    request(`/jenis-perangkat/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteJenisPerangkat: (id) =>
    request(`/jenis-perangkat/${id}`, { method: "DELETE" }),

  getMerek: () => request("/merek"),
  createMerek: (data) =>
    request("/merek", { method: "POST", body: JSON.stringify(data) }),
  updateMerek: (id, data) =>
    request(`/merek/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMerek: (id) => request(`/merek/${id}`, { method: "DELETE" }),

  getStatusServis: () => request("/status-servis"),
  createStatusServis: (data) =>
    request("/status-servis", { method: "POST", body: JSON.stringify(data) }),
  updateStatusServis: (id, data) =>
    request(`/status-servis/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteStatusServis: (id) =>
    request(`/status-servis/${id}`, { method: "DELETE" }),

  getPeran: () => request("/peran"),

  getPengguna: () => request("/pengguna"),
  createPengguna: (data) =>
    request("/pengguna", { method: "POST", body: JSON.stringify(data) }),
  updatePengguna: (id, data) =>
    request(`/pengguna/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  updatePasswordPengguna: (id, kata_sandi) =>
    request(`/pengguna/${id}/password`, {
      method: "PUT",
      body: JSON.stringify({ kata_sandi }),
    }),
  deletePengguna: (id) => request(`/pengguna/${id}`, { method: "DELETE" }),
};

export const formatRupiah = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatTanggal = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
