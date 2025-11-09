import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, CheckCircle2, Edit2, Trash2, Save, X } from "lucide-react";

const API_URL = 'https://apicurso.bobinadosdumalek.es/api';

export default function GestionarRecursos() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "codigo",
    module: "introduccion",
    file_url: ""
  });

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/files`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      let fileUrl = formData.file_url;

      // Si hay un archivo para subir
      if (file) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formDataUpload
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.error || 'Error al subir archivo');
        }

        fileUrl = uploadData.file_url;
      }

      // Guardar o actualizar recurso
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/files/${editingId}` : `${API_URL}/files`;

      const saveRes = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          file_url: fileUrl,
          file_size: file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : formData.file_size
        })
      });

      if (!saveRes.ok) {
        throw new Error('Error al guardar recurso');
      }

      setSuccess(true);
      resetForm();
      await loadFiles();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/files/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Error al eliminar');
      
      setSuccess(true);
      await loadFiles();
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "codigo",
      module: "introduccion",
      file_url: ""
    });
    setFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestionar Recursos</h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Nuevo Recurso
          </Button>
        </div>

        {error && (
          <Alert className="bg-red-50 border-red-200 mb-6">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200 mb-6">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 ml-2">
              ¡Recurso guardado correctamente!
            </AlertDescription>
          </Alert>
        )}

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? 'Editar' : 'Subir Nuevo'} Recurso</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  />
                  {file && <p className="text-sm text-gray-600 mt-2">📁 {file.name}</p>}
                  {!file && formData.file_url && (
                    <p className="text-sm text-gray-600 mt-2">📁 Archivo actual guardado</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recursos ({files.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <p className="text-gray-600">No hay recursos aún</p>
            ) : (
              <div className="space-y-2">
                {files.map(resource => (
                  <div key={resource.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{resource.name}</p>
                      <p className="text-xs text-gray-600">
                        {resource.category} • {resource.module} • {resource.file_size}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(resource.id);
                          setFormData({
                            name: resource.name,
                            description: resource.description || "",
                            category: resource.category,
                            module: resource.module,
                            file_url: resource.file_url,
                            file_size: resource.file_size
                          });
                          setShowForm(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(resource.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
