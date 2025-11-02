import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { customApi, createPageUrl } from "@/utils";
import {
  BookOpen,
  Download,
  Zap,
  Menu,
  LogOut,
  CircuitBoard,
  User,
  Settings,
  Award,
  TrendingUp,
  Video,
  Sparkles,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const modules = [
  {
    id: "introduccion",
    title: "Introducción",
    icon: BookOpen,
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    id: "proyecto_1",
    title: "Proyecto 1",
    icon: Zap,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "proyecto_2",
    title: "Proyecto 2",
    icon: CircuitBoard,
    gradient: "from-green-500 to-emerald-500"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    customApi.auth.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setUserLoaded(true));
  }, []);

  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => customApi.lessons.list('order'),
    initialData: [],
    enabled: userLoaded,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['progress', user?.email],
    queryFn: () => user ? customApi.progress.list(user.email) : [],
    enabled: !!user,
    initialData: [],
  });

  const getModuleProgress = (moduleId) => {
    const moduleLessons = lessons.filter(l => l.module === moduleId);
    if (moduleLessons.length === 0) return 0;

    const completedLessons = moduleLessons.filter(lesson =>
      progress.some(p => p.lesson_id === lesson.id && p.completed)
    );

    return Math.round((completedLessons.length / moduleLessons.length) * 100);
  };

  const getTotalProgress = () => {
    if (lessons.length === 0) return 0;
    const completedLessons = lessons.filter(lesson =>
      progress.some(p => p.lesson_id === lesson.id && p.completed)
    );
    return Math.round((completedLessons.length / lessons.length) * 100);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    customApi.auth.logout(createPageUrl("Landing"));
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header del Sidebar */}
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fa08262087c0b6826136b9/85babb091_images2.png"
              alt="Bobinados Dumalek"
              className="h-12 w-12 object-cover rounded-full border-2 border-cyan-400 shadow-lg"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Electrónica + IA</h2>
              <p className="text-xs text-slate-600">Masterclass</p>
            </div>
          </div>

          {user && (
            <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  Progreso Total
                </div>
                <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-0">
                  {getTotalProgress()}%
                </Badge>
              </div>
              <Progress value={getTotalProgress()} className="h-2.5" />
            </div>
          )}
        </div>

        {/* Menú del Sidebar */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-300px)]">
          {/* Principal */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Principal
            </p>
            <Link
              to={createPageUrl("Dashboard")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                currentPageName === 'Dashboard'
                  ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-300'
                  : 'border-slate-200 hover:border-cyan-300 hover:bg-slate-50'
              }`}
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 shadow-md">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-slate-900">Dashboard</span>
            </Link>
          </div>

          {/* Módulos */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Módulos del Curso
            </p>
            <div className="space-y-2">
              {modules.map((module) => {
                const ModuleIcon = module.icon;
                const moduleProgress = user ? getModuleProgress(module.id) : 0;
                const moduleLessons = lessons.filter(l => l.module === module.id);

                const queryParams = new URLSearchParams(location.search);
                const activeModuleId = queryParams.get('module');
                const isActive = location.pathname.includes('curso') && activeModuleId === module.id;

                return (
                  <Link
                    key={module.id}
                    to={createPageUrl("Curso", { module: module.id })}
                    className="block"
                  >
                    <div className={`p-4 rounded-xl transition-all duration-300 border ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-300 shadow-sm'
                        : 'border-slate-200 hover:border-cyan-300 hover:bg-slate-50'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2.5 rounded-lg bg-gradient-to-br ${module.gradient} shadow-md`}>
                          <ModuleIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 text-sm">{module.title}</div>
                          <div className="text-xs text-slate-500">{moduleLessons.length} lecciones</div>
                        </div>
                      </div>
                      {user && (
                        <div className="space-y-1.5">
                          <Progress value={moduleProgress} className="h-2" />
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Completado</span>
                            <span className="font-semibold text-cyan-600">
                              {moduleProgress}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recursos */}
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-3">
              Recursos
            </p>
            <Link
              to={createPageUrl("Descargas")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                currentPageName === 'Descargas'
                  ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300'
                  : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
              }`}
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-md">
                <Download className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-slate-900">Descargas</span>
            </Link>
          </div>
        </div>

        {/* Footer del Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4 bg-white">
          {user ? (
            <div className="space-y-2">
              <Link to={createPageUrl("Perfil")}>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                  <Avatar className="w-10 h-10 border-2 border-cyan-300">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{user.full_name || 'Usuario'}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
              </Link>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-slate-300 hover:bg-slate-100 text-slate-900"
                >
                  <Link to={createPageUrl("Configuracion")}>
                    <Settings className="w-3 h-3 mr-1" />
                    Ajustes
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-slate-300 hover:bg-red-50 hover:border-red-300 text-slate-900 hover:text-red-600"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Salir
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:ml-72">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="font-bold text-slate-900">Electrónica + IA</h1>
          <div className="w-9" />
        </header>

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
