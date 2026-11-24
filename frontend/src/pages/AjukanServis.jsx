import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AlertBanner from "../components/AlertBanner";
import { masterApi, tiketApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AjukanServis() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const isAdmin = role === "admin";

  const [loadingMaster, setLoadingMaster] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [jenisList, setJenisList] = useState([]);
  const [merekList, setMerekList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);

  const [idPelanggan, setIdPelanggan] = useState("");
  const [idJenis, setIdJenis] = useState("");
  const [idMerek, setIdMerek] = useState("");
  const [idKategori, setIdKategori] = useState("");
  const [modelPerangkat, setModelPerangkat] = useState("");
  const [nomorSeri, setNomorSeri] = useState("");
  const [keluhan, setKeluhan] = useState("");

  const loadMasterOptions = async () => {
    setLoadingMaster(true);
    setError("");
    try {
      const reqs = [
        masterApi.getJenisPerangkat(),
        masterApi.getMerek(),
        masterApi.getKategori(),
      ];
      if (isAdmin) {
        reqs.push(masterApi.getPengguna());
      }

      const [jenisRes, merekRes, katRes, userRes] = await Promise.all(reqs);
      setJenisList(jenisRes?.data || []);
      setMerekList(merekRes?.data || []);
      setKategoriList(katRes?.data || []);

      if (isAdmin && userRes?.data) {
        setPelangganList(
          userRes.data.filter(
            (u) => String(u.nama_peran || "").toLowerCase() === "pelanggan"
          )
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "Gagal memuat data perangkat, merek, dan kategori dari server."
      );
    } finally {
      setLoadingMaster(false);
    }
  };

  useEffect(() => {
    loadMasterOptions();
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await tiketApi.create({
        ...(isAdmin ? { id_pelanggan: Number(idPelanggan) } : {}),
        id_jenis_perangkat: Number(idJenis),
        id_merek: Number(idMerek),
        id_kategori: Number(idKategori),
        model_perangkat: modelPerangkat.trim(),
        nomor_seri: nomorSeri.trim() || null,
        keluhan: keluhan.trim(),
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Gagal mengajukan tiket servis.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Ajukan Servis Baru">
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900">
            Formulir Pengajuan Servis Elektronik
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Lengkapi informasi perangkat dan keluhan kerusakan agar tim teknisi dapat segera menanganinya.
          </p>

          <div className="mt-4">
            <AlertBanner
              type="error"
              message={error}
              onRetry={loadingMaster ? undefined : loadMasterOptions}
              onClose={() => setError("")}
            />
          </div>

          {loadingMaster ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {isAdmin && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Pelanggan *
                  </label>
                  <select
                    required
                    value={idPelanggan}
                    onChange={(e) => setIdPelanggan(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">-- Pilih Pelanggan --</option>
                    {pelangganList.map((p) => (
                      <option key={p.id_pengguna} value={p.id_pengguna}>
                        {p.nama_lengkap} ({p.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Jenis Perangkat *
                  </label>
                  <select
                    required
                    value={idJenis}
                    onChange={(e) => setIdJenis(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">-- Pilih Jenis --</option>
                    {jenisList.map((j) => (
                      <option key={j.id_jenis_perangkat} value={j.id_jenis_perangkat}>
                        {j.nama_jenis}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Merek *
                  </label>
                  <select
                    required
                    value={idMerek}
                    onChange={(e) => setIdMerek(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">-- Pilih Merek --</option>
                    {merekList.map((m) => (
                      <option key={m.id_merek} value={m.id_merek}>
                        {m.nama_merek}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Kategori Layanan *
                  </label>
                  <select
                    required
                    value={idKategori}
                    onChange={(e) => setIdKategori(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {kategoriList.map((k) => (
                      <option key={k.id_kategori} value={k.id_kategori}>
                        {k.nama_kategori}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Nomor Seri (Opsional)
                  </label>
                  <input
                    type="text"
                    value={nomorSeri}
                    onChange={(e) => setNomorSeri(e.target.value)}
                    placeholder="Contoh: SN-9823412"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Model / Tipe Perangkat *
                </label>
                <input
                  type="text"
                  required
                  value={modelPerangkat}
                  onChange={(e) => setModelPerangkat(e.target.value)}
                  placeholder="Contoh: ThinkPad X1 Carbon Gen 9 / Galaxy S23"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Keluhan / Deskripsi Kerusakan *
                </label>
                <textarea
                  rows={4}
                  required
                  value={keluhan}
                  onChange={(e) => setKeluhan(e.target.value)}
                  placeholder="Jelaskan gejala kerusakan yang dialami perangkat..."
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? "Mengirim..." : "Kirim Pengajuan Servis"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
