import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import VideoPlayer from "../components/course/VideoPlayer";

const API_URL = 'https://apicurso.bobinadosdumalek.es/api';

export default function CursoVideoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [lesson, setLesson] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const lessonId = searchParams.get('lesson');
  const moduleId = searchParams.get('module');

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
        const foundLesson = lessonsData.find(l => l.id === parseInt(lessonId));
        setLesson(foundLesson);
      } catch (err) {
        console.error('Error:', err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [lessonId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando video...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Lección no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Button
          onClick={() => navigate(`/curso?module=${moduleId}`)}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al curso
        </Button>

        <VideoPlayer
          lesson={lesson}
          progress={null}
          onProgressUpdate={() => {}}
          onComplete={() => {}}
        />
      </div>
    </div>
  );
}
