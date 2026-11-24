import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onToggleSidebar, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const roleColors = {
    admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
    teknisi: "bg-amber-50 text-amber-700 border-amber-200",
    pelanggan: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const roleKey = String(user?.nama_peran || "").toLowerCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
          aria-label="Buka menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-900 sm:text-lg">
            {title || "Dashboard"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">
            {user?.nama_lengkap || "Pengguna"}
          </p>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>

        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            roleColors[roleKey] || "bg-slate-100 text-slate-700 border-slate-200"
          }`}
        >
          {user?.nama_peran || "User"}
        </span>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
        >
          Keluar
        </button>
      </div>
    </header>
  );
}
