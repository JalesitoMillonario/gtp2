import React, { useState, useEffect } from "react";
import { customApi, createPageUrl } from "@/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  CheckCircle2, 
  Circle, 
  ChevronRight,
  Clock,
  Sparkles
} from "lucide-react";
import VideoPlayer from "../components/course/VideoPlayer";
import LessonSidebar from "../components/course/LessonSidebar";

export default function CoursePage() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentModule, setCurrentModule] = useState("introduccion");
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    customApi.auth.isAuthenticated().then(isAuth => {
      if (!isAuth) {
        navigate(createPageUrl("Landing"));
      } else {
        customApi.auth.me()
          .then(setUser)
          .catch(() => navigate(createPageUrl("Landing")))
          .finally(() => setUserLoaded(true));
      }
    });
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const module = urlParams.get('module');
    if (module) {
      setCurrentModule(module);
      setSelectedLesson(null);
    }
  }, [location.search]);

  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const data = await customApi.lessons.list('order');
      return data || [];
    },
    initialData: [],
    retry: 2,
    staleTime: 30000,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['progress', user?.email],
    queryFn: async () => {
      if (!user) return [];
      const data = await customApi.progress.list(user.email);
      return data || [];
    },
    enabled: !!user,
    initialData: [],
    retry: 2,
  });

  const markCompletedMutation = useMutation({
    mutationFn: async ({ lessonId, completed }) => {
      if (!user) return;
      
      const existing = progress.find(p => p.lesson_id === lessonId);
      
      if (existing) {
        return customApi.progress.update(existing.id, {
          completed,
          progress_percentage: completed ? 100 : existing.progress_percentage,
          last_watched: new Date().toISOString()
        });
      } else {
        return customApi.progress.create({
          user_email: user.email,
          lesson_id: lessonId,
          completed,
          progress_percentage: completed ? 100 : 0,
          last_watched: new Date().toISOString()
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['progress', user?.email]);
    }
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ lessonId, percentage }) => {
      if (!user) return;
      
      const existing = progress.find(p => p.lesson_id === lessonId);
      
      if (existing) {
        return customApi.progress.update(existing.id, {
          progress_percentage: percentage,
          last_watched: new Date().toISOString()
        });
      } else {
        return customApi.progress.create({
          user_email: user.email,
          lesson_id: lessonId,
          completed: false,
          progress_percentage: percentage,
          last_watched: new Date().toISOString()
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['progress', user?.email]);
    }
  });

  const moduleLessons = lessons.filter(l => l.module === currentModule);
  
  useEffect(() => {
    if (moduleLessons.length > 0 && !selectedLesson) {
      const lastWatched = progress
        .filter(p => moduleLessons.some(l => l.id === p.lesson_id))
        .sort((a, b) => new Date(b.last_watched) - new Date(a.last_watched))[0];
      
      if (lastWatched) {
        const lesson = moduleLessons.find(l => l.id === lastWatched.lesson_id);
        setSelectedLesson(lesson);
      } else {
        setSelectedLesson(moduleLessons[0]);
      }
    }
  }, [moduleLessons, progress, selectedLesson]);

  const getLessonProgress = (lessonId) => {
    return progress.find(p => p.lesson_id === lessonId);
  };

  const getModuleTitle = (moduleId) => {
    const titles = {
      introduccion: "Introducción",
      proyecto_1: "Proyecto 1",
      proyecto_2: "Proyecto 2"
    };
    return titles[moduleId] || moduleId;
  };

  if (isLoading || !userLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {getModuleTitle(currentModule)}
          </h1>
          <p className="text-slate-600">
            {moduleLessons.length} lecciones · Aprende a conectar electrónica con inteligencia artificial
          </p>
        </div>

        {moduleLessons.length === 0 ? (
          <Card className="bg-white border-slate-200 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No hay lecciones disponibles aún
            </h3>
            <p className="text-slate-600">
              Las lecciones para este módulo estarán disponibles próximamente
            </p>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {selectedLesson && (
                <VideoPlayer
                  lesson={selectedLesson}
                  progress={getLessonProgress(selectedLesson.id)}
                  onProgressUpdate={(percentage) => {
                    if (user) {
                      updateProgressMutation.mutate({
                        lessonId: selectedLesson.id,
                        percentage
                      });
                    }
                  }}
                  onComplete={() => {
                    if (user) {
                      markCompletedMutation.mutate({
                        lessonId: selectedLesson.id,
                        completed: true
                      });
                    }
                  }}
                />
              )}
            </div>

            <div>
              <LessonSidebar
                lessons={moduleLessons}
                selectedLesson={selectedLesson}
                progress={progress}
                onSelectLesson={setSelectedLesson}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
