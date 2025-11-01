// =========================
// 🌐 API CONFIGURATION
// =========================

const API_URL = "https://apicurso.bobinadosdumalek.es/api";

// Helper para peticiones con manejo de token
async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Si la sesión expira, borrar token
  if (res.status === 401) {
    localStorage.removeItem("token");
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || res.statusText);
  }

  return res.json();
}

// =========================
// 🧠 API Abstraction
// =========================

export const customApi = {
  get: (endpoint: string) => request(endpoint),
  post: (endpoint: string, body: any) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (endpoint: string, body: any) =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  del: (endpoint: string) =>
    request(endpoint, {
      method: "DELETE",
    }),

  // Auth helpers
  auth: {
    async isAuthenticated() {
      try {
        const me = await request("/users/me");
        return !!me;
      } catch {
        return false;
      }
    },

    async login(credentials: { email: string; password: string }) {
      const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      if (data?.token) localStorage.setItem("token", data.token);
      return data;
    },

    async register(user: {
      full_name: string;
      email: string;
      password: string;
    }) {
      const data = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(user),
      });
      if (data?.token) localStorage.setItem("token", data.token);
      return data;
    },

    logout() {
      localStorage.removeItem("token");
    },
  },
};

// =========================
// 🧭 Helpers
// =========================

export function createPageUrl(pageName: string) {
  const pages: Record<string, string> = {
    Landing: "/",
    Dashboard: "/dashboard",
    Curso: "/curso",
    Descargas: "/descargas",
    Configuracion: "/configuracion",
    Perfil: "/perfil",
    GestionarVideos: "/gestionarvideos",
    Login: "/login",
    Register: "/register",
  };
  return pages[pageName] || "/";
}

