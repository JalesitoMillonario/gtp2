import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, Monitor, Shield, Trash2, AlertCircle } from "lucide-react";

const API_URL = 'https://apicurso.bobinadosdumalek.es/api';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    progressReminders: true,
    autoplay: false,
    subtitles: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">No autorizado</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configuración
          </h1>
          <p className="text-gray-600">Personaliza tu experiencia de aprendizaje</p>
        </div>

        <div className="space-y-6">
          {/* Notificaciones */}
          <Card className="border border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Notificaciones</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Gestiona cómo quieres recibir actualizaciones</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 font-medium">Notificaciones por Email</Label>
                  <p className="text-sm text-gray-600">
                    Recibe emails sobre nuevas lecciones y actualizaciones
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("emailNotifications", checked)
                  }
                />
              </div>

              <Separator className="bg-gray-200" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 font-medium">Recordatorios de Progreso</Label>
                  <p className="text-sm text-gray-600">
                    Recibe recordatorios semanales sobre tu progreso
                  </p>
                </div>
                <Switch
                  checked={settings.progressReminders}
                  onCheckedChange={(checked) =>
                    handleSettingChange("progressReminders", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Reproductor */}
          <Card className="border border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Monitor className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Reproductor de Video</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Ajusta la configuración del reproductor</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 font-medium">Reproducción Automática</Label>
                  <p className="text-sm text-gray-600">
                    Reproduce la siguiente lección automáticamente
                  </p>
                </div>
                <Switch
                  checked={settings.autoplay}
                  onCheckedChange={(checked) =>
                    handleSettingChange("autoplay", checked)
                  }
                />
              </div>

              <Separator className="bg-gray-200" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 font-medium">Subtítulos</Label>
                  <p className="text-sm text-gray-600">
                    Muestra subtítulos cuando estén disponibles
                  </p>
                </div>
                <Switch
                  checked={settings.subtitles}
                  onCheckedChange={(checked) =>
                    handleSettingChange("subtitles", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacidad */}
          <Card className="border border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Privacidad y Seguridad</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Gestiona tu privacidad y datos</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 ml-2">
                  Tus datos están seguros y nunca serán compartidos con terceros
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 font-medium">Correo Verificado</Label>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-300">
                  Verificado
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Peligro */}
          <Card className="border border-red-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Zona de Peligro</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Acciones irreversibles</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Alert className="bg-red-50 border-red-200 mb-4">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 ml-2">
                  Resetear tu progreso eliminará toda tu información de avance en el curso
                </AlertDescription>
              </Alert>

              <Button
                variant="outline"
                className="w-full border-red-300 text-red-700 hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Resetear Progreso del Curso
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
