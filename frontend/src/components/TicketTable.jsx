import { useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import { formatRupiah, formatTanggal } from "../services/api";

export default function TicketTable({
  tickets = [],
  penugasanMap = {},
  statusList = [],
  showCustomerColumn = true,
  showTechnicianColumn = true,
  actionLabel = "Lihat Detail",
  onSelectTicket,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      const matchStatus =
        !statusFilter || String(t.id_status) === String(statusFilter);
      const matchQuery =
        !q ||
        String(t.nomor_tiket || "").toLowerCase().includes(q) ||
        String(t.model_perangkat || "").toLowerCase().includes(q) ||
        String(t.nama_merek || "").toLowerCase().includes(q) ||
        String(t.nama_pelanggan || "").toLowerCase().includes(q) ||
        String(t.keluhan || "").toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [tickets, search, statusFilter]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari no. tiket, perangkat, keluhan..."
            className="w-full rounded-lg border border-slate-300 py-2 pr-3 pl-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <svg
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="">Semua Status</option>
            {statusList.map((s) => (
              <option key={s.id_status} value={s.id_status}>
                {s.nama_status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="px-4 py-3">No. Tiket</th>
              <th className="px-4 py-3">Perangkat</th>
              {showCustomerColumn && <th className="px-4 py-3">Pelanggan</th>}
              {showTechnicianColumn && <th className="px-4 py-3">Teknisi</th>}
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Biaya</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTickets.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  Tidak ada tiket servis yang ditemukan.
                </td>
              </tr>
            ) : (
              filteredTickets.map((tiket) => {
                const penugasan = penugasanMap[tiket.id_tiket];
                const biayaTampil =
                  tiket.biaya_akhir !== null && tiket.biaya_akhir !== undefined
                    ? formatRupiah(tiket.biaya_akhir)
                    : tiket.estimasi_biaya !== null &&
                      tiket.estimasi_biaya !== undefined
                    ? `Est. ${formatRupiah(tiket.estimasi_biaya)}`
                    : "-";

                return (
                  <tr
                    key={tiket.id_tiket}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-blue-700 whitespace-nowrap">
                      {tiket.nomor_tiket}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-800">
                        {tiket.nama_merek} {tiket.model_perangkat}
                      </p>
                      <p className="text-xs text-slate-400">
                        {tiket.nama_jenis} · {tiket.nama_kategori}
                      </p>
                    </td>
                    {showCustomerColumn && (
                      <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">
                        {tiket.nama_pelanggan}
                      </td>
                    )}
                    {showTechnicianColumn && (
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {penugasan ? (
                          <span className="text-sm font-medium text-slate-700">
                            {penugasan.nama_teknisi}
                          </span>
                        ) : (
                          <span className="text-xs italic text-slate-400">
                            Belum ditugaskan
                          </span>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={tiket.nama_status} />
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">
                      {biayaTampil}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                      {formatTanggal(tiket.dibuat_pada)}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectTicket(tiket.id_tiket)}
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                      >
                        {actionLabel}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
