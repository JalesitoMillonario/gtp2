import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Video, FileUp, BarChart3 } from "lucide-react";

const API_URL = 'https://apicurso.bobinadosdumalek.es/api';

export default function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

        const data = await res.json();
        
        if (data.role !== 'admin') {
          navigate("/dashboard");
          return;
        }

        setUser(data);
      } catch (err) {
        console.error('Error:', err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Bienvenido, {user.full_name}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/gestionarvideos")}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Gestionar Lecciones</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Crea, edita o elimina lecciones del curso
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Ir →
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/gestionarrecursos")}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileUp className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Gestionar Recursos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Sube archivos, documentos y recursos
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Ir →
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Ver analíticas del curso
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled>
                Próximamente
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border border-gray-200">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate("/gestionarvideos")}
                variant="outline"
                className="w-full justify-start">
                + Nueva Lección
              </Button>
              <Button 
                onClick={() => navigate("/gestionarrecursos")}
                variant="outline"
                className="w-full justify-start">
                + Nuevo Recurso
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
