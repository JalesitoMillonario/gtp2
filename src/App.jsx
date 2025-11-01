import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Páginas
import LandingPage from "@/pages/Landing";      // tu landing animada
import LoginPage from "@/pages/Login";          // zona alumno (login)
import RegisterPage from "@/pages/Register";    // registro
import DashboardPage from "@/pages/DashboardPage"; // progreso / cursos
import Dashboard from "@/pages/Dashboard";         // centro de descargas
import CoursePage from "@/pages/CoursePage";       // lecciones

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Landing principal */}
          <Route path="/" element={<LandingPage />} />

          {/* Autenticación */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Curso y paneles */}
          <Route path="/curso" element={<CoursePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/descargas" element={<Dashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
