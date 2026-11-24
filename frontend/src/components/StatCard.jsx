export default function StatCard({ title, value, subtitle, accent = "blue", icon }) {
  const accentMap = {
    blue: "bg-[#EFF6FF] text-[#2563EB]",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-sky-50 text-sky-600",
    slate: "bg-slate-100 text-[#64748B]",
  };

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs transition hover:border-[#2563EB]/30 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#64748B]">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-[#64748B]">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              accentMap[accent] || accentMap.blue
            }`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
