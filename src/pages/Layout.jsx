import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { customApi, createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Cpu,
  Download,
  User,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customApi.auth.isAuthenticated().then(isAuth => {
      if (!isAuth) {
        navigate(createPageUrl("Landing"));
      } else {
        customApi.auth.me()
          .then(setUser)
          .catch(() => navigate(createPageUrl("Landing")))
          .finally(() => setLoading(false));
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await customApi.auth.logout();
    navigate(createPageUrl("Landing"));
  };

  const navItems = [
    { label: "Inicio", icon: Home, path: createPageUrl("Dashboard") },
    { label: "Curso", icon: Cpu, path: createPageUrl("Curso") },
    { label: "Descargas", icon: Download, path: createPageUrl("Descargas") },
    { label: "Perfil", icon: User, path: createPageUrl("Perfil") },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyan-200">Cargando tu área personal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white">
      {/* 🔹 NAVBAR SUPERIOR */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-white/10 shadow-lg"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(createPageUrl("Dashboard"))}>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fa08262087c0b6826136b9/85babb091_images2.png"
              alt="Dumalek"
              className="w-10 h-10 rounded-full border border-cyan-400"
            />
            <h1 className="font-bold text-lg text-cyan-300">Zona Alumno</h1>
          </div>

          {/* NAVEGACIÓN */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname.includes(item.path);
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 text-sm font-medium transition-all ${
                    active
                      ? "text-cyan-400 border-b-2 border-cyan-400 pb-1"
                      : "text-slate-300 hover:text-cyan-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* PERFIL */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-slate-300">
              {user?.full_name && <span>{user.full_name.split(" ")[0]}</span>}
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-cyan-500 text-cyan-300 hover:bg-cyan-500/20 px-3 py-1"
            >
              <LogOut className="w-4 h-4 mr-1" /> Salir
            </Button>
          </div>
        </div>
      </motion.header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="pt-20 pb-10 px-4 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}
