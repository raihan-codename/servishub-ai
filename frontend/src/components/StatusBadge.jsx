export default function StatusBadge({ status }) {
  const label = status || "Tidak Diketahui";
  const lower = label.toLowerCase();

  let colorClasses = "bg-slate-100 text-slate-700 border-slate-200";
  if (lower.includes("menunggu") || lower.includes("baru") || lower.includes("masuk") || lower.includes("antri")) {
    colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (lower.includes("diagnosis") || lower.includes("periksa") || lower.includes("cek")) {
    colorClasses = "bg-sky-50 text-sky-700 border-sky-200";
  } else if (lower.includes("proses") || lower.includes("kerjakan") || lower.includes("perbaikan")) {
    colorClasses = "bg-blue-50 text-blue-700 border-blue-200";
  } else if (lower.includes("konfirmasi") || lower.includes("sparepart") || lower.includes("tunggu")) {
    colorClasses = "bg-violet-50 text-violet-700 border-violet-200";
  } else if (lower.includes("selesai") || lower.includes("siap")) {
    colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (lower.includes("ambil") || lower.includes("tutup")) {
    colorClasses = "bg-teal-50 text-teal-700 border-teal-200";
  } else if (lower.includes("batal") || lower.includes("gagal")) {
    colorClasses = "bg-rose-50 text-rose-700 border-rose-200";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${colorClasses}`}
    >
      {label}
    </span>
  );
}
