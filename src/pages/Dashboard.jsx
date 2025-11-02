import React, { useState, useEffect } from "react";
import { customApi, createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  Play,
  Zap,
  Download,
  Target,
  Flame,
  Star,
  Calendar,
  ArrowRight,
  Sparkles,
  Trophy,
  Activity,
  Server,
  Monitor,
  Camera
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Buenos días");
    else if (hour < 20) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");
  }, []);

  useEffect(() => {
    customApi.auth.isAuthenticated().then(isAuth => {
      if (!isAuth) {
        navigate(createPageUrl("Landing"));
      } else {
        customApi.auth.me().then(setUser).catch(() => {
          navigate(createPageUrl("Landing"));
        });
      }
    });
  }, [navigate]);

  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => customApi.lessons.list('order'),
    initialData: [],
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['progress', user?.email],
    queryFn: () => user ? customApi.progress.list(user.email) : [],
    enabled: !!user,
    initialData: [],
  });

  const getTotalProgress = () => {
    if (lessons.length === 0) return 0;
    const completedLessons = lessons.filter(lesson =>
      progress.some(p => p.lesson_id === lesson.id && p.completed)
    );
    return Math.round((completedLessons.length / lessons.length) * 100);
  };

  const getModuleProgress = (moduleId) => {
    const moduleLessons = lessons.filter(l => l.module === moduleId);
    if (moduleLessons.length === 0) return 0;

    const completedLessons = moduleLessons.filter(lesson =>
      progress.some(p => p.lesson_id === lesson.id && p.completed)
    );

    return Math.round((completedLessons.length / moduleLessons.length) * 100);
  };

  const getStreak = () => {
    return 7;
  };

  const modules = [
    {
      id: "introduccion",
      title: "Introducción",
      icon: BookOpen,
      gradient: "from-cyan-500 to-blue-600",
      description: "Fundamentos de IA y Hardware"
    },
    {
      id: "proyecto_1",
      title: "Proyecto 1",
      icon: Server,
      gradient: "from-purple-500 to-pink-600",
      description: "Sistema IoT con ESP32-CAM"
    },
    {
      id: "proyecto_2",
      title: "Proyecto 2",
      icon: Award,
      gradient: "from-green-500 to-emerald-600",
      description: "IA en control industrial"
    }
  ];

  const totalProgress = getTotalProgress();
  const completedLessons = lessons.filter(lesson =>
    progress.some(p => p.lesson_id === lesson.id && p.completed)
  ).length;

  const totalMinutes = lessons.reduce((acc, l) => acc + (l.duration_minutes || 0), 0);
  const completedMinutes = lessons
    .filter(lesson => progress.some(p => p.lesson_id === lesson.id && p.completed))
    .reduce((acc, l) => acc + (l.duration_minutes || 0), 0);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-cyan-200 font-medium">Cargando tu espacio de aprendizaje...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: TrendingUp,
      label: "Progreso Total",
      value: `${totalProgress}%`,
      subtitle: `${completedLessons} de ${lessons.length} lecciones`,
      gradient: "from-cyan-500 to-blue-600",
      progress: totalProgress
    },
    {
      icon: Clock,
      label: "Tiempo Total",
      value: `${totalMinutes} min`,
      subtitle: `${completedMinutes} min completados`,
      gradient: "from-purple-500 to-pink-600",
      progress: totalMinutes > 0 ? (completedMinutes / totalMinutes) * 100 : 0
    },
    {
      icon: Flame,
      label: "Racha Actual",
      value: `${getStreak()} días`,
      subtitle: "¡Sigue así!",
      gradient: "from-orange-500 to-red-600",
      progress: (getStreak() / 30) * 100
    },
    {
      icon: Trophy,
      label: "Certificación",
      value: totalProgress >= 100 ? "100%" : `${100 - totalProgress}%`,
      subtitle: totalProgress >= 100 ? "¡Completado!" : "Para completar",
      gradient: "from-green-500 to-emerald-600",
      progress: totalProgress
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-3 flex items-center gap-3">
                {greeting}, {user.full_name?.split(' ')[0] || 'Estudiante'} 
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  👋
                </motion.span>
              </h1>
              <p className="text-xl text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Continúa tu viaje de aprendizaje
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate(createPageUrl("Curso", { module: "introduccion" }))}
                className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white font-bold px-8 py-6 text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Continuar Aprendiendo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="relative bg-gradient-to-br from-slate-900/90 to-blue-950/90 backdrop-blur-xl border-2 border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-400">
                        {stat.label}
                      </CardTitle>
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-black text-white mb-2">
                      {stat.value}
                    </div>
                    <Progress 
                      value={stat.progress} 
                      className="h-2 mb-2"
                    />
                    <p className="text-xs text-cyan-300">
                      {stat.subtitle}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Modules Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-black text-white flex items-center gap-3">
              <Target className="w-10 h-10 text-cyan-400" />
              Módulos del Curso
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {modules.map((module, index) => {
              const ModuleIcon = module.icon;
              const moduleProgress = getModuleProgress(module.id);
              const moduleLessons = lessons.filter(l => l.module === module.id);
              const completedInModule = moduleLessons.filter(lesson =>
                progress.some(p => p.lesson_id === lesson.id && p.completed)
              ).length;

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-20 rounded-3xl blur-2xl group-hover:opacity-30 transition-all duration-500`} />
                  
                  <Card className="relative bg-gradient-to-br from-slate-900/95 to-blue-950/95 backdrop-blur-xl border-2 border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${module.gradient}`} />
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${module.gradient} shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                          <ModuleIcon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                            {module.title}
                          </CardTitle>
                          <p className="text-sm text-slate-400">{module.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                        <BookOpen className="w-4 h-4" />
                        <span>{moduleLessons.length} lecciones</span>
                        <span className="mx-2">•</span>
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span>{completedInModule} completadas</span>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400 font-medium">Progreso</span>
                          <span className={`font-bold ${moduleProgress === 100 ? 'text-green-400' : 'text-cyan-400'}`}>
                            {moduleProgress}%
                          </span>
                        </div>
                        <Progress 
                          value={moduleProgress} 
                          className="h-3"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        {moduleProgress === 100 ? (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-4 py-2">
                            <Trophy className="w-4 h-4 mr-2" />
                            Completado
                          </Badge>
                        ) : moduleProgress > 0 ? (
                          <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-lg px-4 py-2">
                            <Activity className="w-4 h-4 mr-2" />
                            En Progreso
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-800 text-slate-400 border border-slate-700 px-4 py-2">
                            <Star className="w-4 h-4 mr-2" />
                            Nuevo
                          </Badge>
                        )}

                        <Button
                          onClick={() => navigate(createPageUrl("Curso", { module: module.id }))}
                          className={`bg-gradient-to-r ${module.gradient} hover:opacity-90 text-white shadow-lg group`}
                        >
                          {moduleProgress === 0 ? 'Comenzar' : 'Continuar'}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Resources Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.01 }}
        >
          <Card className="relative bg-gradient-to-br from-cyan-900/50 via-blue-900/50 to-purple-900/50 backdrop-blur-xl border-2 border-cyan-500/30 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-2xl group-hover:scale-110 transition-transform">
                    <Download className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-2">
                      Recursos Descargables
                      <Sparkles className="w-6 h-6 text-cyan-400" />
                    </h3>
                    <p className="text-lg text-cyan-200 leading-relaxed max-w-2xl">
                      Accede a códigos fuente, esquemas eléctricos, datasheets y librerías optimizadas para tus proyectos
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => navigate(createPageUrl("Descargas"))}
                  className="bg-white text-purple-900 hover:bg-slate-100 font-bold px-8 py-6 text-lg shadow-xl transition-all hover:scale-105 whitespace-nowrap group"
                >
                  <Download className="w-5 h-5 mr-2 group-hover:translate-y-1 transition-transform" />
                  Ver Recursos
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
