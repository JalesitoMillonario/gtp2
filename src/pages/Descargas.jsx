import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Search, FileCode, FileText, FileImage, File, Package } from "lucide-react";

const API_URL = 'https://apicurso.bobinadosdumalek.es/api';

export default function DescargasPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const getFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/files`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setFiles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    getFiles();
  }, []);

  const categories = [
    { value: 'all', label: 'Todos', color: 'from-slate-500 to-slate-600' },
    { value: 'codigo', label: 'Código', color: 'from-blue-500 to-cyan-500' },
    { value: 'esquemas', label: 'Esquemas', color: 'from-purple-500 to-pink-500' },
    { value: 'datasheets', label: 'Datasheets', color: 'from-green-500 to-emerald-500' },
    { value: 'documentacion', label: 'Documentación', color: 'from-orange-500 to-red-500' }
  ];

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'codigo': return FileCode;
      case 'esquemas': return FileImage;
      case 'datasheets': return FileText;
      default: return File;
    }
  };

  const getCategoryColor = (cat) => {
    const found = categories.find(c => c.value === cat);
    return found?.color || 'from-gray-500 to-slate-500';
  };

  const filteredFiles = files.filter(file => {
    const matchSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const filesByModule = {
    introduccion: filteredFiles.filter(f => f.module === 'introduccion'),
    proyecto_1: filteredFiles.filter(f => f.module === 'proyecto_1'),
    proyecto_2: filteredFiles.filter(f => f.module === 'proyecto_2')
  };

  const moduleLabels = {
    introduccion: '📚 Introducción',
    proyecto_1: '⚡ Proyecto 1',
    proyecto_2: '🔧 Proyecto 2'
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Cargando recursos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            Recursos Descargables
          </h1>
          <p className="text-lg text-slate-600">
            Código, esquemas, documentación y más para tus proyectos
          </p>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Buscar recursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-base"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-lg font-medium"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Files by Module */}
        {['introduccion', 'proyecto_1', 'proyecto_2'].map(module => {
          const moduleFiles = filesByModule[module];

          if (moduleFiles.length === 0) return null;

          return (
            <div key={module} className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-1 w-12 bg-blue-600 rounded-full" />
                <h2 className="text-3xl font-bold text-slate-900">
                  {moduleLabels[module]}
                </h2>
                <Badge className="bg-slate-100 text-slate-700">
                  {moduleFiles.length} archivo{moduleFiles.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moduleFiles.map(file => {
                  const Icon = getCategoryIcon(file.category);
                  const color = getCategoryColor(file.category);

                  return (
                    <Card key={file.id} className="bg-white hover:shadow-xl transition-all duration-300 hover:border-blue-300 border-slate-200 overflow-hidden group">
                      <CardHeader className={`bg-gradient-to-br ${color} text-white p-6`}>
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge className="bg-white/30 text-white border-0 capitalize">
                            {file.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <CardTitle className="text-slate-900 mb-2 line-clamp-2">
                          {file.name}
                        </CardTitle>
                        {file.description && (
                          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                            {file.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                          {file.file_size && (
                            <span className="text-xs text-slate-500 font-medium">
                              📦 {file.file_size}
                            </span>
                          )}
                          <Button
                            size="sm"
                            onClick={() => window.open(file.file_url, '_blank')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Descargar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredFiles.length === 0 && (
          <Card className="bg-white border-slate-200">
            <CardContent className="p-16 text-center">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                No hay recursos disponibles
              </h3>
              <p className="text-slate-600">
                Intenta cambiar los filtros o vuelve más tarde
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
