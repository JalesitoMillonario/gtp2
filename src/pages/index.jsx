import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./Layout";
import Landing from "./Landing";
import Login from "./Login";
import Register from "./Register";
import SocialLogin from "./SocialLogin";
import Pago from "./Pago";
import Dashboard from "./Dashboard";
import Curso from "./Curso";
import Descargas from "./Descargas";
import Configuracion from "./Configuracion";
import Perfil from "./Perfil";
import GestionarVideos from "./GestionarVideos";

const queryClient = new QueryClient();

const pagesConfig = {
  defaultPage: "Landing",
  pages: [
    { name: "Landing", path: "/", component: Landing },
    { name: "Dashboard", path: "/dashboard", component: Dashboard },
    { name: "Curso", path: "/curso", component: Curso },
    { name: "Descargas", path: "/descargas", component: Descargas },
    { name: "Configuracion", path: "/configuracion", component: Configuracion },
    { name: "Perfil", path: "/perfil", component: Perfil },
    { name: "GestionarVideos", path: "/gestionarvideos", component: GestionarVideos },
  ]
};

export default function Pages() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas sin Layout */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/social-login" element={<SocialLogin />} />
          <Route path="/pago" element={<Pago />} />

          {/* Páginas internas con Layout */}
          {pagesConfig.pages
            .filter((page) => !["Landing"].includes(page.name))
            .map((page) => (
              <Route
                key={page.path}
                path={page.path}
                element={
                  <Layout currentPageName={page.name}>
                    <page.component />
                  </Layout>
                }
              />
            ))}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export { pagesConfig };
