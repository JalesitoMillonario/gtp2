import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileCode,
  FileText,
  Image,
  Search,
  Folder,
  HardDrive,
  Sparkles,
  FolderOpen,
  ChevronRight,
  Home,
  Package,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { customApi } from "@/api/customApi";

const categoryIcons = {
  codigo: FileCode,
  esquemas: Image,
  datasheets: FileText,
  diagramas: Image,
  documentacion: FileText,
  recursos: Folder,
  librerias: Package,
};

const categoryColors = {
  codigo: "text-green-600 bg-green-100 border-green-200",
  esquemas: "text-blue-600 bg-blue-100 border-blue-200",
  datasheets: "text-purple-600 bg-purple-100 border-purple-200",
  diagramas: "text-cyan-600 bg-cyan-100 border-cyan-200",
  documentacion: "text-yellow-600 bg-yellow-100 border-yellow-200",
  recursos: "text-pink-600 bg-pink-100 border-pink-200",
  librerias: "text-orange-600 bg-orange-100 border-orange-200",
};

export default function DownloadsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");
  const [currentFolder, setCurrentFolder] = useState("");

  useEffect(() => {
    customApi.auth
      .me()
      .catch(() => navigate("/Landing"));
  }, [navigate]);

  const { data: files = [], isLoading, refetch } = useQuery({
    queryKey: ["dashboard-files"],
    queryFn: async () => {
      const data = await customApi.getFiles();
      return data || [];
    },
    initialData: [],
    retry: 2,
    staleTime: 5000,
  });

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = selectedModule === "all" || file.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  const organizeByFolders = (files, currentPath) => {
    const folders = {};
    const filesInCurrentFolder = [];

    files.forEach((file) => {
      const fileName = file.name;
      const pathParts = fileName.split("/");

      if (currentPath === "") {
        if (pathParts.length === 1) {
          filesInCurrentFolder.push(file);
        } else {
          const folderName = pathParts[0];
          if (!folders[folderName]) folders[folderName] = [];
          folders[folderName].push(file);
        }
      } else {
        const currentParts = currentPath.split("/");
        const isInCurrentFolder =
          pathParts.slice(0, currentParts.length).join("/") === currentPath;

        if (isInCurrentFolder) {
          if (pathParts.length === currentParts.length + 1) {
            filesInCurrentFolder.push(file);
          } else {
            const folderName = pathParts[currentParts.length];
            if (!folders[folderName]) folders[folderName] = [];
            folders[folderName].push(file);
          }
        }
      }
    });

    return { folders, files: filesInCurrentFolder };
  };

  const { folders, files: filesInFolder } = organizeByFolders(filteredFiles, currentFolder);

  const groupedFiles = filesInFolder.reduce((acc, file) => {
    if (!acc[file.category]) acc[file.category] = [];
    acc[file.category].push(file);
    return acc;
  }, {});

  const totalSize = files.reduce((sum, file) => {
    const size = parseFloat(file.file_size?.replace(/[^0-9.]/g, "") || 0);
    return sum + size;
  }, 0);

  const navigateToFolder = (folderName) =>
    setCurrentFolder(currentFolder ? `${currentFolder}/${folderName}` : folderName);

  const navigateUp = () => {
    const parts = currentFolder.split("/");
    parts.pop();
    setCurrentFolder(parts.join("/"));
  };

  const navigateToRoot = () => setCurrentFolder("");
  const getBreadcrumbs = () => (currentFolder === "" ? [] : currentFolder.split("/"));

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando archivos...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Centro de Descargas
            </h1>
            <p className="text-slate-600">Todos los recursos del curso en un solo lugar</p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            🔄 Recargar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total de Archivos</p>
                <p className="text-3xl font-bold text-gray-900">{files.length}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-cyan-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600 mb-1">Tamaño Total</p>
                <p className="text-3xl font-bold text-gray-900">{totalSize.toFixed(1)} MB</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Folder className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600 mb-1">Categorías</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Object.keys(groupedFiles).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-white border-slate-200 mb-8 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  placeholder="Buscar archivos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-100 border-slate-300 text-gray-900 placeholder:text-slate-500"
                />
              </div>
              <Tabs value={selectedModule} onValueChange={setSelectedModule}>
                <TabsList className="bg-slate-100 w-full md:w-auto">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="introduccion">Intro</TabsTrigger>
                  <TabsTrigger value="proyecto_1">P1</TabsTrigger>
                  <TabsTrigger value="proyecto_2">P2</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Folders */}
        {Object.keys(folders).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-cyan-600" />
              Carpetas
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.keys(folders).map((folderName) => (
                <Card
                  key={folderName}
                  className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 hover:border-cyan-400 cursor-pointer group shadow-sm"
                  onClick={() => navigateToFolder(folderName)}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Folder className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{folderName}</h3>
                      <p className="text-sm text-slate-600">
                        {folders[folderName].length} archivo
                        {folders[folderName].length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-cyan-600 group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        <div className="space-y-8">
          {Object.entries(groupedFiles).map(([category, categoryFiles]) => {
            const CategoryIcon = categoryIcons[category] || FileText;
            const colorClasses =
              categoryColors[category] ||
              "text-slate-600 bg-slate-100 border-slate-200";

            return (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${colorClasses}`}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 capitalize">
                    {category.replace(/_/g, " ")}
                  </h2>
                  <Badge variant="outline" className="ml-auto text-slate-600 border-slate-300">
                    {categoryFiles.length} archivo
                    {categoryFiles.length !== 1 ? "s" : ""}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {categoryFiles.map((file) => {
                    const displayName = file.name.split("/").pop();
                    return (
                      <Card
                        key={file.id}
                        className="bg-white border-slate-200 hover:border-cyan-400 transition-all duration-300 group shadow-sm"
                      >
                        <CardContent className="p-6 flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <CategoryIcon
                                className={`w-5 h-5 flex-shrink-0 ${colorClasses.split(" ")[0]}`}
                              />
                              <h3 className="font-semibold text-gray-900 truncate">
                                {displayName}
                              </h3>
                            </div>
                            {file.description && (
                              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                {file.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              {file.file_size && <span>{file.file_size}</span>}
                              {file.module && file.module !== "general" && (
                                <Badge
                                  variant="outline"
                                  className="text-xs border-slate-300 text-slate-600"
                                >
                                  {file.module.replace(/_/g, " ")}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            size="icon"
                            asChild
                            className="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 border border-cyan-200 group-hover:border-cyan-400 transition-all duration-300"
                          >
                            <a
                              href={file.file_url}
                              download={displayName}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
