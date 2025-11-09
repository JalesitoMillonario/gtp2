import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Edit2, Trash2, Save, X, Upload, Video, CheckCircle2, FolderOpen, ExternalLink } from "lucide-react";

const API_URL = 'https://apicurso.bobinadosdumalek.es/api';

export default function GestionarVideos() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [serverVideos, setServerVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [showServerVideos, setShowServerVideos] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    module: "introduccion",
    ord: 1,
    video_url: "",
    description: "",
    duration_minutes: 0
  });

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const res = await fetch(`${API_URL}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const userData = await res.json();
        
        if (userData.role !== 'admin') {
          navigate("/dashboard");
          return;
        }

        setUser(userData);
        await loadLessons(token);
        await loadServerVideos(token);
      } catch (err) {
        setError(err.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const loadLessons = async (token) => {
    try {
      const res = await fetch(`${API_URL}/lessons`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const loadServerVideos = async (token) => {
    try {
      const res = await fetch(`${API_URL}/videos/list`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setServerVideos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando videos del servidor:', err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setError("");
      } else {
        setError("Por favor, sube solo archivos de video");
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setError("");
      } else {
        setError("Por favor, sube solo archivos de video");
      }
    }
  };

  const selectServerVideo = (videoUrl) => {
    setFormData({...formData, video_url: videoUrl});
    setShowServerVideos(false);
    setSuccess('✅ Video del servidor seleccionado');
    setTimeout(() => setSuccess(''), 2000);
  };

  const uploadVideo = async () => {
    if (!videoFile) return null;

    setUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('token');
      const formDataUpload = new FormData();
      formDataUpload.append('video', videoFile);

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.video_url);
          } else {
            reject(new Error('Error al subir video'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Error de red')));

        xhr.open('POST', `${API_URL}/upload/video`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formDataUpload);
      });
    } catch (err) {
      throw err;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let videoUrl = formData.video_url;

      // Si hay un video para subir
      if (videoFile) {
        videoUrl = await uploadVideo();
      }

      if (!videoUrl) {
        throw new Error('Debes subir un video, seleccionar uno del servidor o proporcionar una URL');
      }

      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `${API_URL}/lessons/${editingId}` 
        : `${API_URL}/lessons`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          video_url: videoUrl
        })
      });

      if (!res.ok) throw new Error('Error al guardar');

      setSuccess('✅ Lección guardada correctamente');
      resetForm();
      await loadLessons(token);
      await loadServerVideos(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/lessons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Error al eliminar');
      setSuccess('✅ Lección eliminada');
      await loadLessons(token);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      module: "introduccion",
      ord: 1,
      video_url: "",
      description: "",
      duration_minutes: 0
    });
    setVideoFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestionar Lecciones</h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Lección
          </Button>
        </div>

        {error && (
          <Alert className="bg-red-50 border-red-200 mb-6">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200 mb-6">
            <AlertDescription className="text-green-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {success}
            </AlertDescription>
          </Alert>
        )}

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? 'Editar' : 'Nueva'} Lección</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* OPCIONES DE VIDEO */}
                <div>
                  <Label className="mb-2 block">Video de la Lección</Label>
                  
                  {/* Botón para ver videos del servidor */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowServerVideos(!showServerVideos)}
                    className="mb-4 w-full"
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    {showServerVideos ? 'Ocultar' : 'Seleccionar'} videos del servidor ({serverVideos.length})
                  </Button>

                  {/* Lista de videos del servidor */}
                  {showServerVideos && (
                    <div className="mb-4 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50">
                      {serverVideos.length === 0 ? (
                        <p className="text-gray-600 text-sm">No hay videos en el servidor</p>
                      ) : (
                        <div className="space-y-2">
                          {serverVideos.map((video, idx) => (
                            <div
                              key={idx}
                              onClick={() => selectServerVideo(video.url)}
                              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <Video className="w-5 h-5 text-blue-600" />
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{video.filename}</p>
                                  <p className="text-xs text-gray-500">{video.size}</p>
                                </div>
                              </div>
                              <ExternalLink className="w-4 h-4 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* DRAG & DROP ZONE */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {videoFile ? (
                      <div className="flex flex-col items-center gap-3">
                        <Video className="w-12 h-12 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">{videoFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setVideoFile(null)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Quitar
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Arrastra un video aquí o haz clic para seleccionar
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          MP4, AVI, MOV, WMV (máx. 500MB)
                        </p>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="video-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('video-upload').click()}
                        >
                          Seleccionar Video
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Barra de progreso */}
                  {uploading && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Subiendo video...</span>
                        <span className="text-blue-600 font-medium">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* O URL de YouTube */}
                  <div className="mt-4">
                    <Label className="text-sm text-gray-600">O proporciona una URL de YouTube</Label>
                    <Input
                      value={formData.video_url}
                      onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                      placeholder="https://youtube.com/watch?v=..."
                      className="mt-2"
                    />
                    {formData.video_url && (
                      <p className="text-xs text-gray-500 mt-2">
                        📹 URL actual: {formData.video_url.substring(0, 50)}...
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Título</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Introducción a IoT"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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

                  <div>
                    <Label>Orden</Label>
                    <Input
                      type="number"
                      value={formData.ord}
                      onChange={(e) => setFormData({...formData, ord: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Descripción</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Duración (minutos)</Label>
                  <Input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={loading || uploading} 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading || uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {uploading ? `Subiendo ${uploadProgress}%...` : 'Guardando...'}
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
            <CardTitle>Lecciones ({lessons.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {lessons.length === 0 ? (
              <p className="text-gray-600">No hay lecciones aún</p>
            ) : (
              <div className="space-y-2">
                {lessons.map(lesson => (
                  <div key={lesson.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{lesson.title}</p>
                      <p className="text-xs text-gray-600">
                        {lesson.module} • {lesson.duration_minutes}min
                        {lesson.video_url?.includes('/uploads/videos/') && (
                          <span className="ml-2 text-green-600">📹 Video propio</span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(lesson.id);
                          setFormData({
                            title: lesson.title,
                            module: lesson.module,
                            ord: lesson.ord,
                            video_url: lesson.video_url,
                            description: lesson.description || "",
                            duration_minutes: lesson.duration_minutes || 0
                          });
                          setShowForm(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(lesson.id)}
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
