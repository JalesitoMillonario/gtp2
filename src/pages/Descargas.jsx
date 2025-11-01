import React, { useState, useEffect } from "react";
import { customApi, createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Search,
  FileCode,
  FileText,
  FileImage,
  File,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DescargasPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    customApi.auth.isAuthenticated().then(isAuth => {
      if (!isAuth) {
        navigate(createPageUrl("Landing"));
      } else {
        customApi.auth.me().then(setUser).catch(() => {
          navigate(createPageUrl("Landing"));
        });
      }
    });
  }, [navigate]);

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: () => customApi.files.list(),
    initialData: [],
  });

  const getCategoryIcon = (category) => {
    const icons = {
      codigo: FileCode,
      esquemas: FileImage,
      datasheets: FileText,
      diagramas: FileImage,
      documentacion: FileText,
      recursos: File,
      librerias: FileCode
    };
    return icons[category] || File;
  };

  const getCategoryColor = (category) => {
    const colors = {
      codigo: "from-blue-500 to-cyan-500",
      esquemas: "from-purple-500 to-pink-500",
      datasheets: "from-green-500 to-emerald-500",
      diagramas: "from-orange-500 to-red-500",
      documentacion: "from-yellow-500 to-orange-500",
      recursos: "from-indigo-500 to-purple-500",
      librerias: "from-cyan-500 to-blue-500"
    };
    return colors[category] || "from-gray-500 to-slate-500";
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "Todas las categorías" },
    { value: "codigo", label: "Código Fuente" },
    { value: "esquemas", label: "Esquemas" },
    { value: "datasheets", label: "Datasheets" },
    { value: "diagramas", label: "Diagramas" },
    { value: "documentacion", label: "Documentación" },
    { value: "recursos", label: "Recursos" },
    { value: "librerias", label: "Librerías" }
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Recursos Descargables
          </h1>
          <p className="text-slate-600">
            Códigos, esquemas, datasheets y más materiales para tus proyectos
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Buscar archivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-300"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-64 border-slate-300">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Cargando archivos...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <Card className="bg-white border-slate-200 p-12 text-center">
            <Download className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No se encontraron archivos
            </h3>
            <p className="text-slate-600">
              {searchTerm || selectedCategory !== "all"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Los recursos estarán disponibles próximamente"}
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => {
              const IconComponent = getCategoryIcon(file.category);
              const colorGradient = getCategoryColor(file.category);

              return (
                <Card 
                  key={file.id}
                  className="bg-white border-slate-200 hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${colorGradient} shadow-md flex-shrink-0`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-slate-900 text-lg mb-2 truncate">
                          {file.name}
                        </CardTitle>
                        <Badge className="bg-slate-100 text-slate-600 border-slate-300 capitalize">
                          {file.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {file.description && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {file.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {file.file_size && (
                        <span className="text-sm text-slate-500">{file.file_size}</span>
                      )}
                      <Button
                        size="sm"
                        onClick={() => window.open(file.file_url, '_blank')}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
