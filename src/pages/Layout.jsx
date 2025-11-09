import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, Home, BookOpen, Download, Settings, User, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_URL = 'https://apicurso.bobinadosdumalek.es/api';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [needsPayment, setNeedsPayment] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_URL}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('No autorizado');
        const data = await res.json();
        setUser(data);

        if (data.role !== 'admin' && data.is_paid !== 1) {
          setNeedsPayment(true);
          const protectedPaths = ['/curso', '/descargas', '/dashboard'];
          if (protectedPaths.some(path => location.pathname.startsWith(path))) {
            navigate("/pago");
          }
        }
      } catch (err) {
        console.error('Error:', err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: BookOpen, label: 'Mi Curso', href: '/curso?module=introduccion' },
    { icon: Download, label: 'Recursos', href: '/descargas' },
    { icon: Settings, label: 'Configuración', href: '/configuracion' },
    ...(user?.role === 'admin' ? [
      { icon: Shield, label: 'Panel Admin', href: '/admin' }
    ] : [])
  ];

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '?');

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-white border-r border-slate-200 shadow-sm transition-transform duration-300 z-40 flex flex-col`}>
        
        {/* Logo y Título */}
        <div className="p-6 border-b border-slate-100">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow overflow-hidden bg-white border border-slate-200">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLUynrIbpNwiuzgjhzYhHFgPMyQyQHPoSg5w&s" 
                alt="Logo Dumalek"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Bobinados Dumalek</h2>
              <p className="text-xs text-slate-600 font-medium">Electrónica + IA</p>
            </div>
          </Link>
        </div>

        {/* Alert de pago pendiente */}
        {needsPayment && (
          <div className="p-4">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-xs ml-2">
                Completa tu pago para acceder al curso
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const disabled = needsPayment && ['/curso', '/descargas', '/dashboard'].some(path => item.href.startsWith(path));
              
              return (
                <Link
                  key={item.href}
                  to={disabled ? '/pago' : item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : disabled
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          {user && (
            <>
              <div className="px-4 py-3 bg-slate-50 rounded-lg">
                <p className="font-medium text-slate-900 text-sm truncate">{user.full_name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    Administrador
                  </span>
                )}
                {user.is_paid === 1 && user.role !== 'admin' && (
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    ✓ Acceso completo
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Link to="/perfil" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-slate-600 border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm">Perfil</span>
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex-1 justify-start text-slate-600 border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="text-sm">Salir</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 lg:hidden z-30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Bar Mobile */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between lg:hidden shadow-sm">
          <div>
            <h1 className="font-bold text-slate-900">ESP+GPT</h1>
            <p className="text-xs text-slate-600">Electrónica + IA</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-slate-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600" />
            )}
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
