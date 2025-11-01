import React, { useState } from "react";
import { customApi, createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password !== form.confirm) {
      setErr("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 6) {
      setErr("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      const cleanName = String(form.full_name).trim().replace(/^"+|"+$/g, "");
      const cleanEmail = String(form.email).trim().replace(/^"+|"+$/g, "");
      const cleanPass = String(form.password).trim().replace(/^"+|"+$/g, "");

      const res = await fetch("https://apicurso.bobinadosdumalek.es/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: cleanName,
          email: cleanEmail,
          password: cleanPass,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrarse");

      localStorage.setItem("token", data.token);
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      setErr(error?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 flex items-center justify-center px-4">
      <Card className="bg-white/95 border-0 shadow-2xl w-full max-w-md">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold mb-6 text-slate-900">Crea tu Cuenta</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label>Nombre completo</Label>
              <Input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>Confirmar Contraseña</Label>
              <Input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                required
              />
            </div>
            {err && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {err}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registrando…
                </>
              ) : (
                "Registrarse"
              )}
            </Button>
          </form>
          <p className="text-sm text-slate-500 mt-4 text-center">
            ¿Ya tienes cuenta?{" "}
            <button
              className="text-cyan-700 underline"
              onClick={() => navigate("/login")}
            >
              Inicia sesión
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
