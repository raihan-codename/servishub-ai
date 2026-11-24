import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import TicketTable from "../components/TicketTable";
import TicketDetailModal from "../components/TicketDetailModal";
import AlertBanner from "../components/AlertBanner";
import { masterApi, penugasanApi, tiketApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, role } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [penugasanList, setPenugasanList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTiketId, setSelectedTiketId] = useState(null);
  const [adminTab, setAdminTab] = useState("semua");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [tiketRes, penugasanRes, statusRes] = await Promise.all([
        tiketApi.getAll(),
        penugasanApi.getAll(),
        masterApi.getStatusServis(),
      ]);

      setTickets(tiketRes?.data || []);
      setPenugasanList(penugasanRes?.data || []);
      setStatusList(statusRes?.data || []);
    } catch (err) {
      setError(
        err.message || "Gagal memuat data dashboard. Pastikan backend dan MySQL aktif."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Map id_tiket -> penugasan aktif (atau terakhir)
  const penugasanMap = useMemo(() => {
    const map = {};
    for (const p of penugasanList) {
      if (!map[p.id_tiket] || p.berakhir_pada === null) {
        map[p.id_tiket] = p;
      }
    }
    return map;
  }, [penugasanList]);

  const activeAssignmentIds = useMemo(() => {
    return new Set(
      penugasanList
        .filter((p) => p.berakhir_pada === null)
        .map((p) => Number(p.id_tiket))
    );
  }, [penugasanList]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const selesai = tickets.filter((t) => {
      const s = String(t.nama_status || "").toLowerCase();
      return s.includes("selesai") || s.includes("ambil");
    }).length;
    const belumDitugaskan = tickets.filter(
      (t) => !penugasanMap[t.id_tiket]
    ).length;
    const sedangAktif = total - selesai;
    return { total, selesai, belumDitugaskan, sedangAktif };
  }, [tickets, penugasanMap]);

  const displayedTickets = useMemo(() => {
    if (role !== "admin") return tickets;
    if (adminTab === "unassigned") {
      return tickets.filter((t) => !penugasanMap[t.id_tiket]);
    }
    if (adminTab === "active") {
      return tickets.filter((t) => activeAssignmentIds.has(Number(t.id_tiket)));
    }
    if (adminTab === "done") {
      return tickets.filter((t) => {
        const s = String(t.nama_status || "").toLowerCase();
        return s.includes("selesai") || s.includes("ambil");
      });
    }
    return tickets;
  }, [tickets, role, adminTab, penugasanMap, activeAssignmentIds]);

  const pageTitle =
    role === "admin"
      ? "Dashboard Admin"
      : role === "teknisi"
      ? "Dashboard Teknisi"
      : "Dashboard Pelanggan";

  return (
    <DashboardLayout title={pageTitle}>
      <div className="space-y-6">
        {/* Header Sambutan & Aksi Utama */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
              {user?.nama_peran} Workspace
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
              Halo, {user?.nama_lengkap}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {role === "admin" &&
                "Pantau tiket servis masuk, tugaskan teknisi, dan kelola status pengerjaan."}
              {role === "teknisi" &&
                "Lihat daftar perangkat yang ditugaskan, isi diagnosis, dan perbarui progres perbaikan."}
              {role === "pelanggan" &&
                "Ajukan permintaan servis baru dan pantau perkembangan perbaikan perangkat Anda."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={loadData}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Muat Ulang
            </button>
            {(role === "pelanggan" || role === "admin") && (
              <Link
                to="/ajukan-servis"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700"
              >
                + Ajukan Servis Baru
              </Link>
            )}
          </div>
        </div>

        <AlertBanner type="error" message={error} onRetry={loadData} />

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={role === "teknisi" ? "Total Tugas Saya" : "Total Tiket Servis"}
            value={stats.total}
            subtitle="Keseluruhan tiket tercatat"
            accent="blue"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          {role === "admin" && (
            <StatCard
              title="Belum Ditugaskan"
              value={stats.belumDitugaskan}
              subtitle="Menunggu penugasan teknisi"
              accent="amber"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          )}
          <StatCard
            title="Dalam Proses"
            value={stats.sedangAktif}
            subtitle="Menunggu atau sedang dikerjakan"
            accent="violet"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <StatCard
            title="Selesai / Diambil"
            value={stats.selesai}
            subtitle="Perbaikan telah rampung"
            accent="emerald"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Filter Tab Khusus Admin */}
        {role === "admin" && (
          <div className="flex flex-wrap gap-2">
            {[
              { id: "semua", label: `Semua Tiket (${tickets.length})` },
              {
                id: "unassigned",
                label: `Belum Ditugaskan (${stats.belumDitugaskan})`,
              },
              {
                id: "active",
                label: `Sedang Ditangani (${activeAssignmentIds.size})`,
              },
              { id: "done", label: `Selesai (${stats.selesai})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAdminTab(tab.id)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  adminTab === tab.id
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Daftar Tiket */}
        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-sm text-slate-500">Memuat daftar tiket servis...</p>
            </div>
          </div>
        ) : (
          <TicketTable
            tickets={displayedTickets}
            penugasanMap={penugasanMap}
            statusList={statusList}
            showCustomerColumn={role !== "pelanggan"}
            showTechnicianColumn={true}
            actionLabel={
              role === "admin"
                ? "Kelola & Tugaskan"
                : role === "teknisi"
                ? "Diagnosis & Update"
                : "Pantau Progres"
            }
            onSelectTicket={(id) => setSelectedTiketId(id)}
          />
        )}
      </div>

      {selectedTiketId && (
        <TicketDetailModal
          tiketId={selectedTiketId}
          onClose={() => setSelectedTiketId(null)}
          onUpdated={loadData}
        />
      )}
    </DashboardLayout>
  );
}
