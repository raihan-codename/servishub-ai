import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroImage from "../assets/hero_electronics_service.jpg";

export default function LandingPage() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);

  const handleAjukanServis = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/ajukan-servis");
      return;
    }
    if (role === "teknisi") {
      navigate("/dashboard");
      return;
    }
    navigate("/ajukan-servis");
  };

  const services = [
    {
      title: "Laptop dan Komputer",
      description:
        "Penanganan terstruktur untuk kendala perangkat keras, layar, baterai, sistem operasi, serta pemeliharaan laptop dan komputer desktop.",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Smartphone",
      description:
        "Pengajuan dan pemantauan servis perangkat seluler mulai dari pemeriksaan kerusakan fisik, modul pengisian daya, hingga fungsi perangkat lunak.",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Perangkat Elektronik Lainnya",
      description:
        "Mendukung pencatatan kategori perangkat dan merek elektronik secara fleksibel sesuai layanan perbaikan yang tersedia.",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      ),
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Ajukan Servis",
      description:
        "Pelanggan memilih jenis perangkat, merek, kategori layanan, dan menuliskan keluhan kerusakan untuk mendapatkan nomor tiket.",
    },
    {
      number: "02",
      title: "Pemeriksaan dan Penugasan Teknisi",
      description:
        "Admin memeriksa tiket servis yang masuk dan menugaskan teknisi yang bertanggung jawab menangani perangkat tersebut.",
    },
    {
      number: "03",
      title: "Diagnosis dan Perbaikan",
      description:
        "Teknisi mendiagnosis kerusakan, mencatat tindakan perbaikan, serta memperbarui status pengerjaan dan estimasi biaya.",
    },
    {
      number: "04",
      title: "Pantau Status Servis",
      description:
        "Pelanggan memantau perkembangan status perbaikan, hasil diagnosis teknisi, hingga riwayat status secara berurutan.",
    },
  ];

  const advantages = [
    {
      title: "Proses Pengajuan Lebih Mudah",
      description:
        "Setiap permintaan servis tercatat rapi melalui formulir terstruktur dengan nomor tiket unik yang dibuat otomatis.",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Status Servis Dapat Dipantau",
      description:
        "Setiap pembaruan status tersimpan otomatis dalam riwayat status sehingga pelanggan selalu mengetahui tahap pengerjaan.",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Penanganan Servis Lebih Terorganisir",
      description:
        "Pembagian peran antara Pelanggan, Admin, dan Teknisi memastikan setiap tiket ditangani sesuai tugas dan wewenangnya.",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      title: "Informasi Diagnosis Lebih Transparan",
      description:
        "Catatan diagnosis, tindakan perbaikan, serta estimasi dan biaya akhir tercatat langsung pada detail tiket servis.",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Brand */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white shadow-xs">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-[#0F172A]">
              ServisHub
            </span>
          </Link>

          {/* Zone 2: Nav Links */}
          <nav className="hidden items-center gap-7 text-sm font-medium text-[#64748B] md:flex">
            <a
              href="#beranda"
              className="whitespace-nowrap transition hover:text-[#2563EB]"
            >
              Beranda
            </a>
            <a
              href="#layanan"
              className="whitespace-nowrap transition hover:text-[#2563EB]"
            >
              Layanan
            </a>
            <a
              href="#tentang"
              className="whitespace-nowrap transition hover:text-[#2563EB]"
            >
              Tentang
            </a>
            <a
              href="#cara-kerja"
              className="whitespace-nowrap transition hover:text-[#2563EB]"
            >
              Cara Kerja
            </a>
          </nav>

          {/* Zone 3: Auth Actions */}
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="whitespace-nowrap rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
              >
                Buka Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="whitespace-nowrap rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#1E293B] transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="whitespace-nowrap rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-lg border border-[#E2E8F0] p-2 text-[#1E293B] transition hover:bg-slate-50 md:hidden"
            aria-label="Toggle navigasi"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-[#E2E8F0] bg-white px-4 py-4 md:hidden">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-[#1E293B]">
              <a
                href="#beranda"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                Beranda
              </a>
              <a
                href="#layanan"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                Layanan
              </a>
              <a
                href="#tentang"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                Tentang
              </a>
              <a
                href="#cara-kerja"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                Cara Kerja
              </a>
            </nav>

            <div className="mt-4 flex flex-col gap-2 border-t border-[#E2E8F0] pt-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Buka Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-center text-sm font-semibold text-[#1E293B]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* 2. HERO SECTION */}
        <section
          id="beranda"
          className="relative overflow-hidden border-b border-[#E2E8F0] bg-gradient-to-b from-white via-[#F8FAFC] to-[#EFF6FF]/60"
        >
          {/* Subtle technical circuit grid background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(#CBD5E1 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-24">
            <div className="lg:col-span-6">
              <p className="text-sm font-semibold tracking-wide text-[#2563EB]">
                Manajemen Layanan Servis Perangkat Elektronik
              </p>

              <h1
                className="mt-3 text-balance font-extrabold tracking-tight text-[#0F172A]"
                style={{ fontSize: "clamp(2.125rem, 4vw, 3.35rem)", lineHeight: 1.12 }}
              >
                Perbaikan Perangkat Lebih Mudah, Layanan Lebih Terorganisir
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#64748B] sm:text-lg">
                ServisHub menghubungkan pelanggan, admin, dan teknisi dalam satu
                sistem digital — mulai dari pengajuan tiket perbaikan, penugasan
                teknisi, pencatatan diagnosis, hingga pemantauan status servis.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={handleAjukanServis}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-[0.99]"
                >
                  <span>Ajukan Servis</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>

                <a
                  href="#layanan"
                  className="inline-flex items-center rounded-xl border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-semibold text-[#1E293B] transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
                >
                  Lihat Layanan
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#E2E8F0] pt-6 text-xs font-medium text-[#64748B]">
                <span>Pelanggan</span>
                <span aria-hidden="true">·</span>
                <span>Admin Pengelola</span>
                <span aria-hidden="true">·</span>
                <span>Teknisi Servis</span>
                <span aria-hidden="true">·</span>
                <span>Riwayat Status Real-Time</span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#0F172A] shadow-xl">
                {!heroImgError ? (
                  <img
                    src={heroImage}
                    alt="Ilustrasi meja kerja perbaikan perangkat elektronik ServisHub dengan laptop, motherboard, dan peralatan teknisi"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1D4ED8] p-8 text-center text-white">
                    <svg
                      className="h-14 w-14 text-[#38BDF8]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                    <p className="mt-4 text-lg font-bold">
                      ServisHub Digital Service Management
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      Pengajuan, diagnosis, dan pemantauan perangkat elektronik
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. LAYANAN */}
        <section id="layanan" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#2563EB]">
                Kategori Perangkat
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
                Layanan Perbaikan yang Terstruktur
              </h2>
              <p className="mt-3 text-base text-[#64748B]">
                Kelola permintaan servis berbagai jenis perangkat elektronik
                dengan kategori layanan dan pencatatan merek yang terdata rapi.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 transition duration-200 hover:border-[#2563EB]/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                      {service.icon}
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-[#0F172A]">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#64748B]">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#E2E8F0] pt-4">
                    <button
                      type="button"
                      onClick={handleAjukanServis}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]"
                    >
                      <span>Ajukan untuk perangkat ini</span>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. CARA KERJA */}
        <section
          id="cara-kerja"
          className="border-y border-[#E2E8F0] bg-white py-16 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#2563EB]">
                Alur Kerja Sistem
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
                Cara Kerja ServisHub
              </h2>
              <p className="mt-3 text-base text-[#64748B]">
                Empat tahapan jelas dari saat perangkat diajukan hingga status
                perbaikan selesai.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6"
                >
                  <span className="font-mono text-sm font-semibold text-[#2563EB] tabular-nums">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-[#0F172A]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. TENTANG & KEUNGGULAN SERVISHUB */}
        <section id="tentang" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5">
                <p className="text-sm font-semibold text-[#2563EB]">
                  Tentang ServisHub
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
                  Satu Platform untuk Mengelola Siklus Servis Elektronik
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#64748B] sm:text-base">
                  ServisHub dirancang untuk membantu pengelolaan layanan
                  perbaikan elektronik agar tidak lagi bergantung pada catatan
                  terpisah. Setiap tiket memiliki jejak penugasan, diagnosis
                  teknisi, informasi biaya, dan riwayat status yang terhubung.
                </p>

                <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#0F172A] p-6 text-white">
                  <p className="text-sm font-semibold text-[#38BDF8]">
                    Akses Berbasis Peran
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Sistem memisahkan tampilan dan hak akses untuk Pelanggan,
                    Admin, serta Teknisi guna menjaga alur kerja tetap fokus
                    dan aman.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
                {advantages.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[#E2E8F0] bg-white p-6"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                      {item.icon}
                    </div>
                    <h3 className="mt-4 text-base font-bold text-[#0F172A]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. CTA SECTION */}
        <section className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1D4ED8] px-6 py-12 text-white shadow-lg sm:px-12 sm:py-14">
              <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Mulai Ajukan dan Pantau Perbaikan Perangkat Anda
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                    Masuk ke akun Anda atau buat akun pelanggan untuk membuat
                    tiket servis baru dan mengikuti progres penanganan teknisi.
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAjukanServis}
                    className="whitespace-nowrap rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#38BDF8] hover:text-[#0F172A]"
                  >
                    Ajukan Servis
                  </button>
                  {isAuthenticated ? (
                    <Link
                      to="/dashboard"
                      className="whitespace-nowrap rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      Buka Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      className="whitespace-nowrap rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      Daftar Akun
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="border-t border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-sm font-bold text-white">
                  S
                </div>
                <span className="text-base font-bold text-[#0F172A]">
                  ServisHub
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
                Aplikasi manajemen layanan servis perangkat elektronik untuk
                pengajuan tiket, penugasan teknisi, diagnosis, dan pemantauan
                status perbaikan.
              </p>
            </div>

            <div className="flex flex-wrap gap-10 text-sm">
              <div>
                <p className="font-semibold text-[#0F172A]">Navigasi</p>
                <ul className="mt-3 space-y-2 text-[#64748B]">
                  <li>
                    <a href="#beranda" className="hover:text-[#2563EB]">
                      Beranda
                    </a>
                  </li>
                  <li>
                    <a href="#layanan" className="hover:text-[#2563EB]">
                      Layanan
                    </a>
                  </li>
                  <li>
                    <a href="#cara-kerja" className="hover:text-[#2563EB]">
                      Cara Kerja
                    </a>
                  </li>
                  <li>
                    <a href="#tentang" className="hover:text-[#2563EB]">
                      Tentang
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-[#0F172A]">Akses Sistem</p>
                <ul className="mt-3 space-y-2 text-[#64748B]">
                  {isAuthenticated ? (
                    <li>
                      <Link to="/dashboard" className="hover:text-[#2563EB]">
                        Dashboard
                      </Link>
                    </li>
                  ) : (
                    <>
                      <li>
                        <Link to="/login" className="hover:text-[#2563EB]">
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link to="/register" className="hover:text-[#2563EB]">
                          Daftar Akun
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#E2E8F0] pt-6 text-xs text-[#64748B]">
            © 2026 ServisHub. Manajemen Layanan Servis Elektronik.
          </div>
        </div>
      </footer>
    </div>
  );
}
