import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Pizza, ShoppingCart, Wallet, Tags, Menu, X, Flame, History, LogOut } from "lucide-react";
import { Toaster } from "sonner";
import { useAuth } from "../context/auth";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, testid: "nav-dashboard", end: true },
  { to: "/ventas", label: "Ventas", icon: ShoppingCart, testid: "nav-ventas" },
  { to: "/gastos", label: "Gastos", icon: Wallet, testid: "nav-gastos" },
  { to: "/historial", label: "Historial", icon: History, testid: "nav-historial" },
  { to: "/variedades", label: "Variedades", icon: Pizza, testid: "nav-variedades" },
  { to: "/categorias", label: "Categorías", icon: Tags, testid: "nav-categorias" },
  { to: "/costos", label: "Costos", icon: Flame, testid: "nav-costos" },
];


export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-stone-200 bg-white" data-testid="sidebar-desktop">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between border-b border-stone-200 bg-white px-4 h-14">
        <Link to="/" className="flex items-center shrink-0" aria-label="Ir al inicio">
          <img src="/Giovanni.png" alt="Giovanni" className="h-20 sm:h-20 md:h-14 object-contain" />
        </Link>
        <button
          data-testid="boton-menu-mobile"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-stone-100 active:scale-95 transition"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex" data-testid="mobile-drawer">

          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-white h-full flex flex-col border-r border-stone-200 fade-up">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto" data-testid="contenido-principal">
          <Outlet />
        </div>
      </main>

      <Toaster richColors position="top-right" />
    </div>
  );
}

function SidebarContent() {
  const { user, logout } = useAuth();

  return (
    <>
      <div className="px-2 py-2 border-b border-stone-200">
        <Link to="/" className="block border-b bg-white" aria-label="Ir al inicio">
          <img
            src="/Giovanni.png"
            alt="Giovanni"
            className="w-44 object-contain mx-auto my-3 transition hover:scale-[1.02]"
          />
        </Link>
        <div className="text-center text-[11px] uppercase tracking-[0.18em] text-stone-500 mt-2">Control de pizzería</div>
      </div>

      <nav className="flex-1 p-3 space-y-1" data-testid="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            data-testid={item.testid}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                ? "bg-orange-50 text-orange-700"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-stone-200 space-y-3">
        <div className="rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
          <div className="font-semibold text-stone-700 mb-1">Sesión activa</div>
          <div className="truncate">{user?.email}</div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </>
  );
}
