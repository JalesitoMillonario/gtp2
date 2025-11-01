const API_BASE = "https://apicurso.bobinadosdumalek.es/api";

export const customApi = {
  auth: {
    async login(email, password) {
      // 🧹 Sanitizar entrada por si vienen con comillas dobles o espacios
      const cleanEmail = String(email).replace(/^"+|"+$/g, "").trim();
      const cleanPassword = String(password).replace(/^"+|"+$/g, "").trim();

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const data = await res.json().catch(() => ({
        error: "Respuesta no válida del servidor",
      }));

      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      localStorage.setItem("token", data.token);
      return data;
    },

    async register(full_name, email, password) {
      const cleanName = String(full_name).trim();
      const cleanEmail = String(email).replace(/^"+|"+$/g, "").trim();
      const cleanPassword = String(password).replace(/^"+|"+$/g, "").trim();

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: cleanName,
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      const data = await res.json().catch(() => ({
        error: "Respuesta no válida del servidor",
      }));

      if (!res.ok) throw new Error(data.error || "Error al registrarse");

      localStorage.setItem("token", data.token);
      return data;
    },

    async me() {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token");

      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("No autorizado");
      return res.json();
    },

    logout() {
      localStorage.removeItem("token");
      window.location.href = "/";
    },
  },

  async getLessons() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/lessons`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("No autorizado");
    return res.json();
  },

  async getFiles() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/files`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("No autorizado");
    return res.json();
  },
};
