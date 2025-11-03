import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Landing from "./Landing";
import Login from "./Login";
import Register from "./Register";
import SocialLogin from "./SocialLogin";
import Dashboard from "./Dashboard";
import Curso from "./Curso";
import Descargas from "./Descargas";
import Configuracion from "./Configuracion";
import Perfil from "./Perfil";
import Pago from "./Pago";
import PagoExitoso from "./PagoExitoso";
import Admin from "./Admin";
import GestionarVideos from "./GestionarVideos";
import GestionarRecursos from "./GestionarRecursos";
import Layout from "./Layout";

const queryClient = new QueryClient();

export default function Pages() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/social-login" element={<SocialLogin />} />
          <Route path="/pago" element={<Pago />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />

          {/* Con Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/curso" element={<Curso />} />
            <Route path="/descargas" element={<Descargas />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/gestionarvideos" element={<GestionarVideos />} />
            <Route path="/gestionarrecursos" element={<GestionarRecursos />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
