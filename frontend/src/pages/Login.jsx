import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AlertBanner from "../components/AlertBanner";

function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const loggedInUser = await login(email.trim(), password);
      const userRole = String(loggedInUser?.nama_peran || "").toLowerCase();

      if (
        redirectParam === "/ajukan-servis" &&
        (userRole === "pelanggan" || userRole === "admin")
      ) {
        navigate("/ajukan-servis", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Gagal masuk. Periksa email dan password Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl md:grid md:grid-cols-2">
        {/* Bagian kiri */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1D4ED8] p-10 text-white">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight">ServisHub</span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Solusi pengelolaan layanan servis elektronik yang lebih terstruktur,
              transparan, dan mudah dipantau.
            </p>
          </div>

          <div className="my-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-wider text-[#38BDF8] uppercase">
              Service Management
            </p>
            <h2 className="mt-2 text-lg font-bold">
              Kelola Servis dalam Satu Platform
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Ajukan perbaikan perangkat, tugaskan teknisi, catat diagnosis,
              dan pantau riwayat status pengerjaan secara langsung.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>© 2026 ServisHub</span>
            <Link to="/" className="font-medium text-[#38BDF8] hover:underline">
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* Bagian kanan: Form login */}
        <div className="flex items-center justify-center p-6 sm:p-10 md:p-12">
          <div className="w-full max-w-md">
            {/* Logo mobile */}
            <div className="mb-6 flex items-center justify-between md:hidden">
              <Link to="/" className="text-xl font-bold text-[#2563EB]">
                ServisHub
              </Link>
              <Link to="/" className="text-xs font-semibold text-[#64748B] hover:text-[#2563EB]">
                Beranda
              </Link>
            </div>

            {/* Judul */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
                Selamat datang!
              </h1>
              <p className="mt-2 text-sm text-[#64748B]">
                Silakan masuk ke akun Anda untuk melanjutkan ke dashboard.
              </p>
            </div>

            <div className="mb-5">
              <AlertBanner
                type="error"
                message={error}
                onClose={() => setError("")}
              />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#1E293B]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#1E293B]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    required
                    className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 pr-24 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                  >
                    {showPassword ? "Sembunyikan" : "Lihat"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Memproses..." : "Masuk"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#64748B]">
              Belum punya akun pelanggan?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
