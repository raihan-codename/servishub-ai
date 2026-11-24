import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import AlertBanner from "../components/AlertBanner";
import { masterApi } from "../services/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function MasterData() {
  const [tab, setTab] = useState("kategori");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const [kategoriList, setKategoriList] = useState([]);
  const [jenisList, setJenisList] = useState([]);
  const [merekList, setMerekList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [penggunaList, setPenggunaList] = useState([]);
  const [peranList, setPeranList] = useState([]);

  // Create form states
  const [namaKategori, setNamaKategori] = useState("");
  const [deskripsiKategori, setDeskripsiKategori] = useState("");
  const [namaJenis, setNamaJenis] = useState("");
  const [namaMerek, setNamaMerek] = useState("");
  const [namaStatus, setNamaStatus] = useState("");
  const [keteranganStatus, setKeteranganStatus] = useState("");

  const [newUser, setNewUser] = useState({
    id_peran: "",
    nama_lengkap: "",
    email: "",
    kata_sandi: "",
    nomor_telepon: "",
  });

  // Edit modal states
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [katRes, jenisRes, merekRes, statusRes, userRes, peranRes] =
        await Promise.all([
          masterApi.getKategori(),
          masterApi.getJenisPerangkat(),
          masterApi.getMerek(),
          masterApi.getStatusServis(),
          masterApi.getPengguna(),
          masterApi.getPeran(),
        ]);

      setKategoriList(katRes?.data || []);
      setJenisList(jenisRes?.data || []);
      setMerekList(merekRes?.data || []);
      setStatusList(statusRes?.data || []);
      setPenggunaList(userRes?.data || []);
      setPeranList(peranRes?.data || []);
    } catch (err) {
      setError(err.message || "Gagal memuat data master.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateKategori = async (e) => {
    e.preventDefault();
    setError("");
    setFeedback("");
    if (!namaKategori.trim()) {
      setError("Nama kategori wajib diisi!");
      return;
    }
    try {
      await masterApi.createKategori({
        nama_kategori: namaKategori.trim(),
        deskripsi: deskripsiKategori.trim(),
      });
      setNamaKategori("");
      setDeskripsiKategori("");
      setFeedback("Kategori layanan berhasil ditambahkan.");
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateJenis = async (e) => {
    e.preventDefault();
    setError("");
    setFeedback("");
    if (!namaJenis.trim()) {
      setError("Nama jenis perangkat wajib diisi!");
      return;
    }
    try {
      await masterApi.createJenisPerangkat({ nama_jenis: namaJenis.trim() });
      setNamaJenis("");
      setFeedback("Jenis perangkat berhasil ditambahkan.");
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateMerek = async (e) => {
    e.preventDefault();
    setError("");
    setFeedback("");
    if (!namaMerek.trim()) {
      setError("Nama merek wajib diisi!");
      return;
    }
    try {
      await masterApi.createMerek({ nama_merek: namaMerek.trim() });
      setNamaMerek("");
      setFeedback("Merek berhasil ditambahkan.");
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateStatus = async (e) => {
    e.preventDefault();
    setError("");
    setFeedback("");
    if (!namaStatus.trim()) {
      setError("Nama status servis wajib diisi!");
      return;
    }
    try {
      await masterApi.createStatusServis({
        nama_status: namaStatus.trim(),
        keterangan: keteranganStatus.trim(),
      });
      setNamaStatus("");
      setKeteranganStatus("");
      setFeedback("Status servis berhasil ditambahkan.");
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreatePengguna = async (e) => {
    e.preventDefault();
    setError("");
    setFeedback("");

    if (!newUser.id_peran) {
      setError("Peran pengguna wajib dipilih!");
      return;
    }
    if (!newUser.nama_lengkap.trim()) {
      setError("Nama lengkap wajib diisi!");
      return;
    }
    if (!EMAIL_REGEX.test(newUser.email.trim())) {
      setError("Format email tidak valid!");
      return;
    }
    if (newUser.kata_sandi.length < 8) {
      setError("Password minimal 8 karakter!");
      return;
    }

    try {
      await masterApi.createPengguna({
        id_peran: Number(newUser.id_peran),
        nama_lengkap: newUser.nama_lengkap.trim(),
        email: newUser.email.trim(),
        kata_sandi: newUser.kata_sandi,
        nomor_telepon: newUser.nomor_telepon.trim() || null,
      });
      setNewUser({
        id_peran: "",
        nama_lengkap: "",
        email: "",
        kata_sandi: "",
        nomor_telepon: "",
      });
      setFeedback("Pengguna berhasil ditambahkan.");
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (fn, id, label) => {
    setError("");
    setFeedback("");
    try {
      await fn(id);
      setFeedback(`${label} berhasil dihapus.`);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (type, item) => {
    setEditError("");
    setError("");
    setFeedback("");

    if (type === "kategori") {
      setEditModal({ type, id: item.id_kategori, title: "Edit Kategori Layanan" });
      setEditForm({
        nama_kategori: item.nama_kategori || "",
        deskripsi: item.deskripsi || "",
      });
    } else if (type === "jenis") {
      setEditModal({ type, id: item.id_jenis_perangkat, title: "Edit Jenis Perangkat" });
      setEditForm({
        nama_jenis: item.nama_jenis || "",
      });
    } else if (type === "merek") {
      setEditModal({ type, id: item.id_merek, title: "Edit Merek" });
      setEditForm({
        nama_merek: item.nama_merek || "",
      });
    } else if (type === "status") {
      setEditModal({ type, id: item.id_status, title: "Edit Status Servis" });
      setEditForm({
        nama_status: item.nama_status || "",
        keterangan: item.keterangan || "",
      });
    } else if (type === "pengguna") {
      setEditModal({ type, id: item.id_pengguna, title: "Edit Data Pengguna" });
      setEditForm({
        id_peran: String(item.id_peran || ""),
        nama_lengkap: item.nama_lengkap || "",
        email: item.email || "",
        nomor_telepon: item.nomor_telepon || "",
        kata_sandi: "",
      });
    }
  };

  const closeEditModal = () => {
    if (savingEdit) return;
    setEditModal(null);
    setEditForm({});
    setEditError("");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editModal) return;

    setEditError("");

    // Validasi input per jenis master data
    if (editModal.type === "kategori") {
      if (!String(editForm.nama_kategori || "").trim()) {
        setEditError("Nama kategori wajib diisi!");
        return;
      }
    } else if (editModal.type === "jenis") {
      if (!String(editForm.nama_jenis || "").trim()) {
        setEditError("Nama jenis perangkat wajib diisi!");
        return;
      }
    } else if (editModal.type === "merek") {
      if (!String(editForm.nama_merek || "").trim()) {
        setEditError("Nama merek wajib diisi!");
        return;
      }
    } else if (editModal.type === "status") {
      if (!String(editForm.nama_status || "").trim()) {
        setEditError("Nama status wajib diisi!");
        return;
      }
    } else if (editModal.type === "pengguna") {
      if (!editForm.id_peran) {
        setEditError("Peran pengguna wajib dipilih!");
        return;
      }
      if (!String(editForm.nama_lengkap || "").trim()) {
        setEditError("Nama lengkap wajib diisi!");
        return;
      }
      if (!EMAIL_REGEX.test(String(editForm.email || "").trim())) {
        setEditError("Format email tidak valid!");
        return;
      }
      if (editForm.kata_sandi && editForm.kata_sandi.length < 8) {
        setEditError("Password baru minimal 8 karakter!");
        return;
      }
    }

    setSavingEdit(true);
    try {
      let successMsg = "Data berhasil diperbarui.";

      if (editModal.type === "kategori") {
        await masterApi.updateKategori(editModal.id, {
          nama_kategori: editForm.nama_kategori.trim(),
          deskripsi: editForm.deskripsi?.trim() || "",
        });
        successMsg = "Kategori layanan berhasil diperbarui.";
      } else if (editModal.type === "jenis") {
        await masterApi.updateJenisPerangkat(editModal.id, {
          nama_jenis: editForm.nama_jenis.trim(),
        });
        successMsg = "Jenis perangkat berhasil diperbarui.";
      } else if (editModal.type === "merek") {
        await masterApi.updateMerek(editModal.id, {
          nama_merek: editForm.nama_merek.trim(),
        });
        successMsg = "Merek berhasil diperbarui.";
      } else if (editModal.type === "status") {
        await masterApi.updateStatusServis(editModal.id, {
          nama_status: editForm.nama_status.trim(),
          keterangan: editForm.keterangan?.trim() || "",
        });
        successMsg = "Status servis berhasil diperbarui.";
      } else if (editModal.type === "pengguna") {
        await masterApi.updatePengguna(editModal.id, {
          id_peran: Number(editForm.id_peran),
          nama_lengkap: editForm.nama_lengkap.trim(),
          email: editForm.email.trim(),
          nomor_telepon: editForm.nomor_telepon?.trim() || null,
        });

        if (editForm.kata_sandi) {
          await masterApi.updatePasswordPengguna(editModal.id, editForm.kata_sandi);
        }

        successMsg = editForm.kata_sandi
          ? "Data dan password pengguna berhasil diperbarui."
          : "Data pengguna berhasil diperbarui.";
      }

      setEditModal(null);
      setEditForm({});
      setFeedback(successMsg);
      await loadAll();
    } catch (err) {
      setEditError(err.message || "Gagal memperbarui data.");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <DashboardLayout title="Data Master">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "kategori", label: `Kategori (${kategoriList.length})` },
            { id: "jenis", label: `Jenis Perangkat (${jenisList.length})` },
            { id: "merek", label: `Merek (${merekList.length})` },
            { id: "status", label: `Status Servis (${statusList.length})` },
            { id: "pengguna", label: `Pengguna (${penggunaList.length})` },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id);
                setError("");
                setFeedback("");
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === item.id
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <AlertBanner type="error" message={error} onRetry={loadAll} onClose={() => setError("")} />
        <AlertBanner type="success" message={feedback} onClose={() => setFeedback("")} />

        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-14">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            {/* TAB: KATEGORI LAYANAN */}
            {tab === "kategori" && (
              <div className="space-y-5">
                <form onSubmit={handleCreateKategori} className="grid gap-3 sm:grid-cols-3">
                  <input
                    type="text"
                    required
                    value={namaKategori}
                    onChange={(e) => setNamaKategori(e.target.value)}
                    placeholder="Nama kategori layanan"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={deskripsiKategori}
                    onChange={(e) => setDeskripsiKategori(e.target.value)}
                    placeholder="Deskripsi singkat"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    + Tambah Kategori
                  </button>
                </form>

                <div className="divide-y divide-slate-100 border-t border-slate-200">
                  {kategoriList.length === 0 ? (
                    <p className="py-6 text-center text-sm text-slate-400">
                      Belum ada data kategori layanan.
                    </p>
                  ) : (
                    kategoriList.map((k) => (
                      <div key={k.id_kategori} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <div>
                          <p className="font-semibold text-slate-800">{k.nama_kategori}</p>
                          {k.deskripsi && <p className="text-xs text-slate-500">{k.deskripsi}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal("kategori", k)}
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(masterApi.deleteKategori, k.id_kategori, "Kategori")}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: JENIS PERANGKAT */}
            {tab === "jenis" && (
              <div className="space-y-5">
                <form onSubmit={handleCreateJenis} className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    required
                    value={namaJenis}
                    onChange={(e) => setNamaJenis(e.target.value)}
                    placeholder="Nama jenis perangkat (misal: Laptop, Smartphone)"
                    className="min-w-[240px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    + Tambah Jenis
                  </button>
                </form>

                <div className="divide-y divide-slate-100 border-t border-slate-200">
                  {jenisList.length === 0 ? (
                    <p className="py-6 text-center text-sm text-slate-400">
                      Belum ada data jenis perangkat.
                    </p>
                  ) : (
                    jenisList.map((j) => (
                      <div key={j.id_jenis_perangkat} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <p className="font-semibold text-slate-800">{j.nama_jenis}</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal("jenis", j)}
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(masterApi.deleteJenisPerangkat, j.id_jenis_perangkat, "Jenis perangkat")}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: MEREK */}
            {tab === "merek" && (
              <div className="space-y-5">
                <form onSubmit={handleCreateMerek} className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    required
                    value={namaMerek}
                    onChange={(e) => setNamaMerek(e.target.value)}
                    placeholder="Nama merek (misal: ASUS, Apple, Samsung)"
                    className="min-w-[240px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    + Tambah Merek
                  </button>
                </form>

                <div className="divide-y divide-slate-100 border-t border-slate-200">
                  {merekList.length === 0 ? (
                    <p className="py-6 text-center text-sm text-slate-400">
                      Belum ada data merek.
                    </p>
                  ) : (
                    merekList.map((m) => (
                      <div key={m.id_merek} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <p className="font-semibold text-slate-800">{m.nama_merek}</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal("merek", m)}
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(masterApi.deleteMerek, m.id_merek, "Merek")}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: STATUS SERVIS */}
            {tab === "status" && (
              <div className="space-y-5">
                <form onSubmit={handleCreateStatus} className="grid gap-3 sm:grid-cols-3">
                  <input
                    type="text"
                    required
                    value={namaStatus}
                    onChange={(e) => setNamaStatus(e.target.value)}
                    placeholder="Nama status servis (misal: Sedang Dicek)"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={keteranganStatus}
                    onChange={(e) => setKeteranganStatus(e.target.value)}
                    placeholder="Keterangan singkat (opsional)"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    + Tambah Status
                  </button>
                </form>

                <div className="divide-y divide-slate-100 border-t border-slate-200">
                  {statusList.length === 0 ? (
                    <p className="py-6 text-center text-sm text-slate-400">
                      Belum ada data status servis.
                    </p>
                  ) : (
                    statusList.map((s) => (
                      <div key={s.id_status} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <div>
                          <p className="font-semibold text-slate-800">{s.nama_status}</p>
                          {s.keterangan && <p className="text-xs text-slate-500">{s.keterangan}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal("status", s)}
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(masterApi.deleteStatusServis, s.id_status, "Status servis")}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: PENGGUNA */}
            {tab === "pengguna" && (
              <div className="space-y-5">
                <form onSubmit={handleCreatePengguna} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                  <select
                    required
                    value={newUser.id_peran}
                    onChange={(e) => setNewUser({ ...newUser, id_peran: e.target.value })}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">-- Peran --</option>
                    {peranList.map((r) => (
                      <option key={r.id_peran} value={r.id_peran}>
                        {r.nama_peran}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    value={newUser.nama_lengkap}
                    onChange={(e) => setNewUser({ ...newUser, nama_lengkap: e.target.value })}
                    placeholder="Nama lengkap"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Email"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <input
                    type="tel"
                    value={newUser.nomor_telepon}
                    onChange={(e) => setNewUser({ ...newUser, nomor_telepon: e.target.value })}
                    placeholder="No. Telepon (opsional)"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newUser.kata_sandi}
                    onChange={(e) => setNewUser({ ...newUser, kata_sandi: e.target.value })}
                    placeholder="Password (min. 8)"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    + Tambah User
                  </button>
                </form>

                <div className="overflow-x-auto border-t border-slate-200 pt-2">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs font-semibold text-slate-400 uppercase">
                        <th className="py-2 pr-3">Nama</th>
                        <th className="py-2 pr-3">Email</th>
                        <th className="py-2 pr-3">Telepon</th>
                        <th className="py-2 pr-3">Peran</th>
                        <th className="py-2 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {penggunaList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-sm text-slate-400">
                            Belum ada data pengguna.
                          </td>
                        </tr>
                      ) : (
                        penggunaList.map((u) => (
                          <tr key={u.id_pengguna}>
                            <td className="py-2.5 pr-3 font-semibold text-slate-800">{u.nama_lengkap}</td>
                            <td className="py-2.5 pr-3 text-slate-600">{u.email}</td>
                            <td className="py-2.5 pr-3 text-slate-500">{u.nomor_telepon || "-"}</td>
                            <td className="py-2.5 pr-3">
                              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                                {u.nama_peran}
                              </span>
                            </td>
                            <td className="py-2.5 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditModal("pengguna", u)}
                                  className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(masterApi.deletePengguna, u.id_pengguna, "Pengguna")}
                                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL EDIT MASTER DATA */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">{editModal.title}</h3>
              <button
                type="button"
                onClick={closeEditModal}
                disabled={savingEdit}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Tutup modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 p-6">
              <AlertBanner
                type="error"
                message={editError}
                onClose={() => setEditError("")}
              />

              {editModal.type === "kategori" && (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Nama Kategori *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.nama_kategori || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, nama_kategori: e.target.value })
                      }
                      placeholder="Masukkan nama kategori"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Deskripsi
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.deskripsi || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, deskripsi: e.target.value })
                      }
                      placeholder="Deskripsi singkat kategori layanan"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </>
              )}

              {editModal.type === "jenis" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Nama Jenis Perangkat *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.nama_jenis || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nama_jenis: e.target.value })
                    }
                    placeholder="Contoh: Laptop, Smartphone"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}

              {editModal.type === "merek" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Nama Merek *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.nama_merek || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nama_merek: e.target.value })
                    }
                    placeholder="Contoh: ASUS, Samsung, Apple"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}

              {editModal.type === "status" && (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Nama Status *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.nama_status || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, nama_status: e.target.value })
                      }
                      placeholder="Masukkan nama status servis"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Keterangan
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.keterangan || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, keterangan: e.target.value })
                      }
                      placeholder="Keterangan status (opsional)"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </>
              )}

              {editModal.type === "pengguna" && (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Peran *
                    </label>
                    <select
                      required
                      value={editForm.id_peran || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, id_peran: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">-- Pilih Peran --</option>
                      {peranList.map((r) => (
                        <option key={r.id_peran} value={r.id_peran}>
                          {r.nama_peran}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.nama_lengkap || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, nama_lengkap: e.target.value })
                      }
                      placeholder="Nama lengkap pengguna"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={editForm.email || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      placeholder="nama@email.com"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={editForm.nomor_telepon || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, nomor_telepon: e.target.value })
                      }
                      placeholder="08xxxxxxxxxx (opsional)"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Password Baru (Opsional)
                    </label>
                    <input
                      type="password"
                      minLength={8}
                      value={editForm.kata_sandi || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, kata_sandi: e.target.value })
                      }
                      placeholder="Kosongkan jika tidak ingin mengubah password (min. 8 karakter)"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={savingEdit}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {savingEdit ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
