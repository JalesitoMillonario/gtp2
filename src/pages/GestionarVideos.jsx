import React, { useState, useEffect } from "react";
import { customApi, createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function GestionarVideosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    module: "introduccion",
    order: 1,
    video_url: "",
    description: "",
    duration_minutes: 0
  });

  useEffect(() => {
    customApi.auth.me()
      .then(userData => {
        setUser(userData);
        if (userData.role !== 'admin') {
          navigate(createPageUrl("Dashboard"));
        }
      })
      .catch(() => navigate(createPageUrl("Landing")));
  }, [navigate]);

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => customApi.lessons.list('order'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => customApi.lessons.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['lessons']);
      setShowDialog(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => customApi.lessons.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['lessons']);
      setEditingLesson(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => customApi.lessons.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['lessons']);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      module: "introduccion",
      order: 1,
      video_url: "",
      description: "",
      duration_minutes: 0
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingLesson) {
      updateMutation.mutate({ id: editingLesson.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      module: lesson.module,
      order: lesson.order,
      video_url: lesson.video_url,
      description: lesson.description || "",
      duration_minutes: lesson.duration_minutes || 0
    });
  };

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar esta lección?")) {
      deleteMutation.mutate(id);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Gestionar Videos
            </h1>
            <p className="text-slate-600">Administra las lecciones del curso</p>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Lección
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nueva Lección</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Módulo</Label>
                    <Select
                      value={formData.module}
                      onValueChange={(value) => setFormData({...formData, module: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="introduccion">Introducción</SelectItem>
                        <SelectItem value="proyecto_1">Proyecto 1</SelectItem>
                        <SelectItem value="proyecto_2">Proyecto 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Orden</Label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>URL del Video</Label>
                  <Input
                    value={formData.video_url}
                    onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                    placeholder="https://youtube.com/watch?v=... o archivo subido"
                    required
                  />
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
                <div className="flex gap-3">
                  <Button type="submit" disabled={createMutation.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    {createMutation.isPending ? 'Guardando...' : 'Crear Lección'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDialog(false);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Cargando lecciones...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="bg-white border-slate-200">
                {editingLesson?.id === lesson.id ? (
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label>Título</Label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Módulo</Label>
                          <Select
                            value={formData.module}
                            onValueChange={(value) => setFormData({...formData, module: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="introduccion">Introducción</SelectItem>
                              <SelectItem value="proyecto_1">Proyecto 1</SelectItem>
                              <SelectItem value="proyecto_2">Proyecto 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Orden</Label>
                          <Input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label>URL del Video</Label>
                        <Input
                          value={formData.video_url}
                          onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                          required
                        />
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
                      <div className="flex gap-3">
                        <Button type="submit" disabled={updateMutation.isPending}>
                          <Save className="w-4 h-4 mr-2" />
                          {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingLesson(null);
                            resetForm();
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                ) : (
                  <>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                            <Video className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-slate-900">{lesson.title}</CardTitle>
                            <div className="flex gap-2 mt-1">
                              <Badge className="bg-slate-100 text-slate-600 capitalize">
                                {lesson.module}
                              </Badge>
                              <Badge variant="outline">Orden: {lesson.order}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(lesson)}
                            className="border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(lesson.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {lesson.description && (
                      <CardContent>
                        <p className="text-slate-600 text-sm">{lesson.description}</p>
                        <p className="text-slate-500 text-xs mt-2">
                          Duración: {lesson.duration_minutes || 0} minutos
                        </p>
                      </CardContent>
                    )}
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
