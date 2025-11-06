import React, { useState, useEffect } from "react";
import { customApi } from "@/utils";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Award, 
  Calendar,
  Edit2,
  Save,
  X
} from "lucide-react";

export default function PerfilPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    customApi.auth.isAuthenticated().then(isAuth => {
      if (!isAuth) {
        navigate(createPageUrl("Landing"));
      } else {
        customApi.auth.me()
          .then(userData => {
            setUser(userData);
            setEditedName(userData.full_name || "");
          })
          .catch(() => navigate(createPageUrl("Landing")));
      }
    });
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Aquí deberías implementar la actualización en tu API
      // await customApi.users.update({ full_name: editedName });
      const updatedUser = await customApi.auth.me();
      setUser(updatedUser);
      setEditing(false);
    } catch (error) {
      alert("Error al actualizar perfil: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Mi Perfil
          </h1>
          <p className="text-slate-600">Gestiona tu información personal y configuración</p>
        </div>

        <div className="grid gap-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900">Información Personal</CardTitle>
                {!editing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                    className="border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center">
                  <Avatar className="w-32 h-32 border-4 border-cyan-300 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-3xl font-bold">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <Badge className="mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-0">
                    {user.role === 'admin' ? 'Administrador' : 'Estudiante'}
                  </Badge>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="grid gap-4">
                    <div>
                      <Label className="text-slate-600 flex items-center gap-2 mb-2">
                        <User className="w-4 h-4" />
                        Nombre Completo
                      </Label>
                      {editing ? (
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Tu nombre"
                          className="border-slate-300"
                        />
                      ) : (
                        <p className="text-lg font-medium text-slate-900">
                          {user.full_name || 'Sin nombre'}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-slate-600 flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <p className="text-lg font-medium text-slate-900">{user.email}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        El email no se puede modificar
                      </p>
                    </div>

                    <div>
                      <Label className="text-slate-600 flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4" />
                        Miembro desde
                      </Label>
                      <p className="text-lg font-medium text-slate-900">
                        {new Date(user.created_date || Date.now()).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {editing && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditing(false);
                          setEditedName(user.full_name || "");
                        }}
                        className="border-slate-300"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-600" />
                Logros y Certificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Completa el curso para obtener tu certificado de finalización
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
