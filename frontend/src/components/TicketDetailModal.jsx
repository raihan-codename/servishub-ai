import { useEffect, useState } from "react";
import {
  tiketApi,
  penugasanApi,
  catatanApi,
  riwayatApi,
  masterApi,
  formatRupiah,
  formatTanggal,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "./StatusBadge";
import AlertBanner from "./AlertBanner";

export default function TicketDetailModal({
  tiketId,
  onClose,
  onUpdated,
}) {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const isTeknisi = role === "teknisi";
  const canEdit = isAdmin || isTeknisi;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const [tiket, setTiket] = useState(null);
  const [catatanList, setCatatanList] = useState([]);
  const [riwayatList, setRiwayatList] = useState([]);
  const [penugasanList, setPenugasanList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [teknisiList, setTeknisiList] = useState([]);

  // Form states
  const [selectedTeknisi, setSelectedTeknisi] = useState("");
  const [statusId, setStatusId] = useState("");
  const [estimasiBiaya, setEstimasiBiaya] = useState("");
  const [biayaAkhir, setBiayaAkhir] = useState("");
  const [keteranganStatus, setKeteranganStatus] = useState("");

  const [diagnosis, setDiagnosis] = useState("");
  const [tindakanPerbaikan, setTindakanPerbaikan] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadDetail = async () => {
    if (!tiketId) return;
    setLoading(true);
    setError("");
    try {
      const requests = [
        tiketApi.getById(tiketId),
        catatanApi.getByTiket(tiketId),
        riwayatApi.getByTiket(tiketId),
        penugasanApi.getAll(),
        masterApi.getStatusServis(),
      ];

      if (isAdmin) {
        requests.push(masterApi.getPengguna());
      }

      const [tiketRes, catatanRes, riwayatRes, penugasanRes, statusRes, penggunaRes] =
        await Promise.all(requests);

      const t = tiketRes?.data;
      setTiket(t);
      setCatatanList(catatanRes?.data || []);
      setRiwayatList(riwayatRes?.data || []);
      setPenugasanList(
        (penugasanRes?.data || []).filter(
          (p) => Number(p.id_tiket) === Number(tiketId)
        )
      );
      setStatusList(statusRes?.data || []);

      if (t) {
        setStatusId(String(t.id_status || ""));
        setEstimasiBiaya(
          t.estimasi_biaya !== null && t.estimasi_biaya !== undefined
            ? String(t.estimasi_biaya)
            : ""
        );
        setBiayaAkhir(
          t.biaya_akhir !== null && t.biaya_akhir !== undefined
            ? String(t.biaya_akhir)
            : ""
        );
      }

      if (isAdmin && penggunaRes?.data) {
        setTeknisiList(
          penggunaRes.data.filter(
            (u) => String(u.nama_peran || "").toLowerCase() === "teknisi"
          )
        );
      }
    } catch (err) {
      setError(err.message || "Gagal memuat detail tiket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [tiketId]);

  const activePenugasan = penugasanList.find((p) => p.berakhir_pada === null);

  const handleAssignTeknisi = async (e) => {
    e.preventDefault();
    if (!selectedTeknisi) return;
    setSubmitting(true);
    setError("");
    setFeedback("");
    try {
      await penugasanApi.create({
        id_tiket: Number(tiketId),
        id_teknisi: Number(selectedTeknisi),
      });
      setSelectedTeknisi("");
      setFeedback("Teknisi berhasil ditugaskan.");
      await loadDetail();
      onUpdated?.();
    } catch (err) {
      setError(err.message || "Gagal menugaskan teknisi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelesaiPenugasan = async (idPenugasan) => {
    setSubmitting(true);
    setError("");
    setFeedback("");
    try {
      await penugasanApi.selesai(idPenugasan);
      setFeedback("Penugasan berhasil diselesaikan.");
      await loadDetail();
      onUpdated?.();
    } catch (err) {
      setError(err.message || "Gagal menyelesaikan penugasan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTiket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setFeedback("");
    try {
      await tiketApi.update(tiketId, {
        id_status: statusId ? Number(statusId) : undefined,
        estimasi_biaya: estimasiBiaya === "" ? null : Number(estimasiBiaya),
        biaya_akhir: biayaAkhir === "" ? null : Number(biayaAkhir),
        keterangan: keteranganStatus.trim() || undefined,
      });
      setKeteranganStatus("");
      setFeedback("Status & biaya tiket berhasil diperbarui dan tercatat di riwayat.");
      await loadDetail();
      onUpdated?.();
    } catch (err) {
      setError(err.message || "Gagal memperbarui tiket.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCatatan = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) return;
    setSubmitting(true);
    setError("");
    setFeedback("");
    try {
      await catatanApi.create({
        id_tiket: Number(tiketId),
        diagnosis: diagnosis.trim(),
        tindakan_perbaikan: tindakanPerbaikan.trim() || null,
      });
      setDiagnosis("");
      setTindakanPerbaikan("");
      setFeedback("Catatan diagnosis & perbaikan berhasil ditambahkan.");
      await loadDetail();
      onUpdated?.();
    } catch (err) {
      setError(err.message || "Gagal menyimpan catatan servis.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!tiketId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-xs sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">
              {tiket ? tiket.nomor_tiket : "Detail Tiket Servis"}
            </h2>
            {tiket && <StatusBadge status={tiket.nama_status} />}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Tutup modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
          <AlertBanner type="error" message={error} onRetry={loadDetail} onClose={() => setError("")} />
          <AlertBanner type="success" message={feedback} onClose={() => setFeedback("")} />

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : (
            tiket && (
              <>
                {/* Ringkasan Perangkat & Keluhan */}
                <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Pelanggan</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      {tiket.nama_pelanggan}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Perangkat</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      {tiket.nama_jenis} · {tiket.nama_merek} {tiket.model_perangkat}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Kategori & No. Seri</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-700">
                      {tiket.nama_kategori} {tiket.nomor_seri ? `(${tiket.nomor_seri})` : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Estimasi Biaya</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      {formatRupiah(tiket.estimasi_biaya)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Biaya Akhir</p>
                    <p className="mt-0.5 text-sm font-semibold text-emerald-700">
                      {formatRupiah(tiket.biaya_akhir)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Tanggal Pengajuan</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-700">
                      {formatTanggal(tiket.dibuat_pada)}
                    </p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <p className="text-xs font-medium text-slate-400">Keluhan Pelanggan</p>
                    <p className="mt-1 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                      {tiket.keluhan}
                    </p>
                  </div>
                </div>

                {/* Penugasan Teknisi */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Penugasan Teknisi
                    </h3>
                    {activePenugasan && canEdit && (
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleSelesaiPenugasan(activePenugasan.id_penugasan)}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        Tandai Tugas Selesai
                      </button>
                    )}
                  </div>

                  {penugasanList.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">
                      Belum ada teknisi yang ditugaskan.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {penugasanList.map((p) => (
                        <div
                          key={p.id_penugasan}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
                        >
                          <div>
                            <span className="font-semibold text-slate-800">
                              {p.nama_teknisi}
                            </span>
                            <span className="text-xs text-slate-400">
                              {" "}· ditugaskan oleh {p.nama_admin} ({formatTanggal(p.ditugaskan_pada)})
                            </span>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              p.berakhir_pada === null
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {p.berakhir_pada === null ? "Aktif" : `Selesai (${formatTanggal(p.berakhir_pada)})`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {isAdmin && !activePenugasan && (
                    <form onSubmit={handleAssignTeknisi} className="mt-4 flex flex-wrap gap-2">
                      <select
                        value={selectedTeknisi}
                        onChange={(e) => setSelectedTeknisi(e.target.value)}
                        required
                        className="min-w-[200px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      >
                        <option value="">-- Pilih Teknisi --</option>
                        {teknisiList.map((t) => (
                          <option key={t.id_pengguna} value={t.id_pengguna}>
                            {t.nama_lengkap} ({t.email})
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        disabled={submitting || !selectedTeknisi}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                      >
                        Tugaskan Teknisi
                      </button>
                    </form>
                  )}
                </div>

                {/* Form Update Status & Biaya (Admin / Teknisi) */}
                {canEdit && (
                  <form
                    onSubmit={handleUpdateTiket}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <h3 className="text-sm font-bold text-slate-900">
                      Perbarui Status & Biaya Servis
                    </h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Status Servis
                        </label>
                        <select
                          value={statusId}
                          onChange={(e) => setStatusId(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >
                          {statusList.map((s) => (
                            <option key={s.id_status} value={s.id_status}>
                              {s.nama_status}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Estimasi Biaya (Rp)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={estimasiBiaya}
                          onChange={(e) => setEstimasiBiaya(e.target.value)}
                          placeholder="0"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Biaya Akhir (Rp)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={biayaAkhir}
                          onChange={(e) => setBiayaAkhir(e.target.value)}
                          placeholder="0"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={keteranganStatus}
                        onChange={(e) => setKeteranganStatus(e.target.value)}
                        placeholder="Catatan perubahan status (opsional, tampil di riwayat)"
                        className="min-w-[220px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                )}

                {/* Catatan Servis / Diagnosis */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Catatan Diagnosis & Tindakan Perbaikan
                  </h3>

                  {catatanList.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">
                      Belum ada catatan diagnosis dari teknisi.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {catatanList.map((c) => (
                        <div
                          key={c.id_catatan}
                          className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">
                              Teknisi: {c.nama_teknisi}
                            </span>
                            <span>{formatTanggal(c.dibuat_pada)}</span>
                          </div>
                          <p className="mt-1.5 text-sm text-slate-800">
                            <span className="font-semibold">Diagnosis:</span> {c.diagnosis}
                          </p>
                          {c.tindakan_perbaikan && (
                            <p className="mt-1 text-sm text-slate-700">
                              <span className="font-semibold">Tindakan:</span> {c.tindakan_perbaikan}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {canEdit && (
                    <form onSubmit={handleAddCatatan} className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                        Tambah Catatan Baru
                      </p>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Diagnosis Kerusakan *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          placeholder="Contoh: IC Power bermasalah dan baterai drop..."
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Tindakan Perbaikan
                        </label>
                        <textarea
                          rows={2}
                          value={tindakanPerbaikan}
                          onChange={(e) => setTindakanPerbaikan(e.target.value)}
                          placeholder="Contoh: Penggantian komponen IC Power dan kalibrasi daya..."
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                      >
                        Simpan Catatan Diagnosis
                      </button>
                    </form>
                  )}
                </div>

                {/* Timeline Riwayat Status */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Riwayat Status Tiket
                  </h3>
                  {riwayatList.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">
                      Belum ada riwayat perubahan status.
                    </p>
                  ) : (
                    <ol className="mt-3 space-y-3 border-l-2 border-blue-200 pl-4">
                      {riwayatList.map((r) => (
                        <li key={r.id_riwayat} className="relative">
                          <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <StatusBadge status={r.nama_status} />
                            <span className="text-xs text-slate-400">
                              {formatTanggal(r.diubah_pada)}
                            </span>
                          </div>
                          {r.keterangan && (
                            <p className="mt-1 text-sm text-slate-700">{r.keterangan}</p>
                          )}
                          <p className="mt-0.5 text-xs text-slate-400">
                            Oleh: {r.nama_pengubah}
                          </p>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
