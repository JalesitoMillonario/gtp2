import React, { useState } from "react";
import { customApi, createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const cleanEmail = String(form.email).trim().replace(/^"+|"+$/g, "");
      const cleanPassword = String(form.password).trim().replace(/^"+|"+$/g, "");
      await customApi.auth.login(cleanEmail, cleanPassword);
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      setErr(error?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 flex items-center justify-center px-4">
      <Card className="bg-white/95 border-0 shadow-2xl w-full max-w-md">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold mb-6 text-slate-900">Zona Alumno</h1>
          <form onSubmit={onSubmit} className="space-y-4">
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
            {err && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {err}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Entrando…
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
          <p className="text-sm text-slate-500 mt-4 text-center">
            ¿No tienes cuenta?{" "}
            <button
              className="text-cyan-700 underline"
              onClick={() => navigate("/register")}
            >
              Regístrate
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
