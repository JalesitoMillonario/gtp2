import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";

const API_URL = 'https://apicurso.bobinadosdumalek.es/api';

export default function GestionarRecursos() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "codigo",
    module: "introduccion",
    file_url: ""
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!file) {
        throw new Error('Selecciona un archivo');
      }

      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const token = localStorage.getItem('token');
      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Error al subir archivo');
      }

      // Guardar recurso en BD
      const saveRes = await fetch(`${API_URL}/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          file_url: uploadData.file_url,
          file_size: uploadData.file_size
        })
      });

      if (!saveRes.ok) {
        throw new Error('Error al guardar recurso');
      }

      setSuccess(true);
      setFile(null);
      setFormData({
        name: "",
        description: "",
        category: "codigo",
        module: "introduccion",
        file_url: ""
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestionar Recursos</h1>

        <Card>
          <CardHeader>
            <CardTitle>Subir Nuevo Recurso</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="bg-red-50 border-red-200 mb-6">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200 mb-6">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700 ml-2">
                  ¡Recurso subido correctamente!
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <Label>Nombre del recurso</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Código proyecto 1"
                  required
                />
              </div>

              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descripción del recurso"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Categoría</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="codigo">Código Fuente</option>
                    <option value="esquemas">Esquemas</option>
                    <option value="datasheets">Datasheets</option>
                    <option value="diagramas">Diagramas</option>
                    <option value="documentacion">Documentación</option>
                    <option value="recursos">Recursos</option>
                    <option value="librerias">Librerías</option>
                  </select>
                </div>

                <div>
                  <Label>Módulo</Label>
                  <select
                    value={formData.module}
                    onChange={(e) => setFormData({...formData, module: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="introduccion">Introducción</option>
                    <option value="proyecto_1">Proyecto 1</option>
                    <option value="proyecto_2">Proyecto 2</option>
                  </select>
                </div>
              </div>

              <div>
                <Label>Archivo</Label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                {file && <p className="text-sm text-gray-600 mt-2">📁 {file.name}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Recurso
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
