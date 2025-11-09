import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, BookOpen, Zap, Cpu, Clock, CheckCircle2, Circle } from "lucide-react";

const API_URL = 'https://apicurso.bobinadosdumalek.es/api';

export default function CoursePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(searchParams.get('module') || 'introduccion');

  const modules = [
    { 
      id: 'introduccion', 
      title: 'Introducción', 
      description: 'Fundamentos de electrónica e IA',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'proyecto_1', 
      title: 'Proyecto 1: Sistema IoT', 
      description: 'Construye un sistema IoT completo',
      icon: Cpu,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'proyecto_2', 
      title: 'Proyecto 2: Control Industrial', 
      description: 'IA en sistemas de control',
      icon: Zap,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate("/login");
          return;
        }

        const userRes = await fetch(`${API_URL}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await userRes.json();
        setUser(userData);

        const lessonsRes = await fetch(`${API_URL}/lessons`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const lessonsData = await lessonsRes.json();
        setLessons(Array.isArray(lessonsData) ? lessonsData : []);
      } catch (err) {
        console.error('Error:', err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const moduleLessons = lessons.filter(l => l.module === selectedModule).sort((a, b) => a.ord - b.ord);
  const currentModuleData = modules.find(m => m.id === selectedModule);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Cargando curso...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            Mi Curso
          </h1>
          <p className="text-lg text-slate-600">
            Aprende Electrónica + IA a tu propio ritmo
          </p>
        </div>

        {/* Module Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {modules.map(module => {
            const Icon = module.icon;
            const isSelected = selectedModule === module.id;
            const lessonCount = lessons.filter(l => l.module === module.id).length;

            return (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module.id)}
                className={`group transition-all duration-300 ${
                  isSelected ? 'scale-105' : 'hover:scale-102'
                }`}
              >
                <Card className={`h-full border-2 transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-br ' + module.color + ' text-white border-transparent shadow-2xl'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'
                }`}>
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all ${
                      isSelected
                        ? 'bg-white/20 shadow-lg'
                        : 'bg-slate-100 group-hover:bg-slate-200'
                    }`}>
                      <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {module.title}
                    </h3>
                    <p className={`text-sm mb-4 ${isSelected ? 'text-white/80' : 'text-slate-600'}`}>
                      {module.description}
                    </p>
                    <Badge className={isSelected ? 'bg-white/30 text-white border-0' : 'bg-slate-100 text-slate-600'}>
                      {lessonCount} lecciones
                    </Badge>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>

        {/* Current Module Header */}
        {currentModuleData && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              {currentModuleData.title}
            </h2>
            <p className="text-slate-600 mt-2">
              {moduleLessons.length} lecciones disponibles
            </p>
          </div>
        )}

        {/* Lessons */}
        {moduleLessons.length === 0 ? (
          <Card className="bg-white border-slate-200">
            <CardContent className="p-16 text-center">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                No hay lecciones aún
              </h3>
              <p className="text-slate-600">
                Las lecciones para este módulo estarán disponibles pronto
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {moduleLessons.map((lesson, idx) => (
              <Card 
                key={lesson.id} 
                className="bg-white hover:shadow-lg transition-all duration-300 hover:border-blue-300 border-slate-200"
              >
                <CardContent className="p-6 flex items-start gap-6">
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {lesson.title}
                    </h3>
                    {lesson.description && (
                      <p className="text-slate-600 text-sm mb-4">
                        {lesson.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.duration_minutes || 0} min
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700 border-0">
                        Módulo: {lesson.module}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => navigate(`/curso-video?lesson=${lesson.id}&module=${selectedModule}`)}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Ver Lección
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
