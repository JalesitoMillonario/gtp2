import React, { useState, useEffect } from "react";
import { customApi, createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  Download
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    customApi.auth.isAuthenticated().then(isAuth => {
      if (!isAuth) {
        navigate(createPageUrl("Landing"));
      } else {
        customApi.auth.me().then(setUser).catch(() => navigate(createPageUrl("Landing")));
      }
    });
  }, [navigate]);

  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons"],
    queryFn: () => customApi.lessons.list("order"),
    initialData: [],
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["progress", user?.email],
    queryFn: () => (user ? customApi.progress.list(user.email) : []),
    enabled: !!user,
    initialData: [],
  });

  const totalProgress = lessons.length
    ? Math.round(
        (lessons.filter(l => progress.some(p => p.lesson_id === l.id && p.completed)).length /
          lessons.length) *
          100
      )
    : 0;

  const modules = [
    { id: "introduccion", title: "Introducción", icon: BookOpen, color: "from-cyan-500 to-blue-500" },
    { id: "proyecto_1", title: "Proyecto 1", icon: Zap, color: "from-purple-500 to-pink-500" },
    { id: "proyecto_2", title: "Proyecto 2", icon: Award, color: "from-green-500 to-emerald-500" }
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          Bienvenido, {user.full_name || "Estudiante"} 👋
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Progreso Total</CardTitle>
              <TrendingUp className="w-5 h-5 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{totalProgress}%</div>
              <Progress value={totalProgress} className="h-2" />
              <p className="text-xs text-slate-500 mt-2">Progreso general del curso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Tiempo Total</CardTitle>
              <Clock className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {lessons.reduce((a, l) => a + (l.duration_minutes || 0), 0)} min
              </div>
              <p className="text-xs text-slate-500">Duración estimada del curso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Certificación</CardTitle>
              <Award className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {totalProgress >= 100 ? "✓" : "—"}
              </div>
              <p className="text-xs text-slate-500">
                {totalProgress >= 100 ? "Certificado disponible" : "Completa el curso para obtenerlo"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Módulos del Curso</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {modules.map((m) => {
              const Icon = m.icon;
              const modLessons = lessons.filter(l => l.module === m.id);
              const modProgress = modLessons.length
                ? Math.round(
                    (modLessons.filter(l => progress.some(p => p.lesson_id === l.id && p.completed)).length /
                      modLessons.length) *
                      100
                  )
                : 0;

              return (
                <Card
                  key={m.id}
                  onClick={() => navigate(createPageUrl("curso", { module: m.id }))}
                  className="cursor-pointer hover:shadow-lg transition-all"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${m.color} shadow-md`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>{m.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={modProgress} className="h-2 mb-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">{modProgress}% completado</span>
                      {modProgress === 100 ? (
                        <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Completado
                        </Badge>
                      ) : (
                        <Badge className="bg-cyan-500/20 text-cyan-600 border-cyan-500/30">
                          <Play className="w-3 h-3 mr-1" /> En progreso
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Download className="w-5 h-5 text-cyan-600" /> Recursos Descargables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Accede a códigos, esquemas, datasheets y otros archivos del curso.
            </p>
            <Button
              onClick={() => navigate(createPageUrl("Descargas"))}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              <Download className="w-4 h-4 mr-2" /> Ir al Centro de Descargas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
