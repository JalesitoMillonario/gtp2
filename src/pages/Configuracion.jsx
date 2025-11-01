import React, { useState, useEffect } from "react";
import { customApi } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Monitor, Shield, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    progressReminders: true,
    autoplay: false,
    subtitles: true,
  });

  useEffect(() => {
    customApi
      .get("/users/me")
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Configuración
          </h1>
          <p className="text-slate-600">Personaliza tu experiencia de aprendizaje</p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Notificaciones</CardTitle>
                  <CardDescription className="text-slate-600">
                    Gestiona cómo quieres recibir actualizaciones
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-900 font-medium">Notificaciones por Email</Label>
                  <p className="text-sm text-slate-600">
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

              <Separator className="bg-slate-200" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-900 font-medium">Recordatorios de Progreso</Label>
                  <p className="text-sm text-slate-600">
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

          {/* Video Settings */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Reproductor de Video</CardTitle>
                  <CardDescription className="text-slate-600">
                    Ajusta la configuración del reproductor
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-900 font-medium">Reproducción Automática</Label>
                  <p className="text-sm text-slate-600">
                    Reproduce la siguiente lección automáticamente
                  </p>
                </div>
                <Switch
                  checked={settings.autoplay}
                  onCheckedChange={(checked) => handleSettingChange("autoplay", checked)}
                />
              </div>

              <Separator className="bg-slate-200" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-900 font-medium">Subtítulos</Label>
                  <p className="text-sm text-slate-600">
                    Muestra subtítulos cuando estén disponibles
                  </p>
                </div>
                <Switch
                  checked={settings.subtitles}
                  onCheckedChange={(checked) => handleSettingChange("subtitles", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Privacidad y Seguridad</CardTitle>
                  <CardDescription className="text-slate-600">
                    Gestiona tu privacidad y datos
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-cyan-50/5 border-cyan-300">
                <AlertCircle className="h-4 w-4 text-cyan-400" />
                <AlertDescription className="text-cyan-800">
                  Tus datos están seguros y nunca serán compartidos con terceros
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label className="text-slate-900 font-medium">Correo Verificado</Label>
                  <p className="text-sm text-slate-600">{user?.email || "No autenticado"}</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    user ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"
                  }`}
                >
                  {user ? "Verificado" : "Sin sesión"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-white border-red-300 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-red-600">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Zona de Peligro</CardTitle>
                  <CardDescription className="text-slate-600">
                    Acciones irreversibles
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Alert className="bg-red-50/5 border-red-300 mb-4">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-800">
                  Resetear tu progreso eliminará toda tu información de avance en el curso
                </AlertDescription>
              </Alert>

              <Button
                variant="outline"
                className="w-full border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400"
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
