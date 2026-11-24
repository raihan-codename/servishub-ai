import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AlertBanner from "../components/AlertBanner";

export default function Register() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register({
        nama_lengkap: namaLengkap.trim(),
        email: email.trim(),
        nomor_telepon: nomorTelepon.trim() || null,
        kata_sandi: password,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Registrasi gagal. Silakan periksa data Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-xl">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <span className="text-base font-bold text-[#0F172A]">ServisHub</span>
            </Link>
            <Link to="/" className="text-xs font-semibold text-[#64748B] hover:text-[#2563EB]">
              Beranda
            </Link>
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#0F172A]">
            Daftar Akun Pelanggan
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Buat akun untuk mengajukan dan memantau servis perangkat Anda.
          </p>
        </div>

        <div className="mb-4">
          <AlertBanner
            type="error"
            message={error}
            onClose={() => setError("")}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1E293B]">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1E293B]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1E293B]">
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={nomorTelepon}
              onChange={(e) => setNomorTelepon(e.target.value)}
              placeholder="08xxxxxxxxxx (opsional)"
              className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1E293B]">
              Password (min. 8 karakter)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#2563EB] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:opacity-60"
          >
            {submitting ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#64748B]">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
