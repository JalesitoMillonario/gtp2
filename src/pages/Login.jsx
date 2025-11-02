
import React, { useState } from "react";
import { customApi, createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

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
      const res = await customApi.auth.login({
        email: form.email.trim(),
        password: form.password.trim()
      });
      const user = res?.user || {};
      if (user.status === "pending_payment") {
        navigate("/pago");
      } else {
        navigate(createPageUrl("Dashboard"));
      }
    } catch (error) {
      setErr(error?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 flex items-center justify-center px-4">
      <Card className="bg-white/95 border-0 shadow-2xl w-full max-w-md">
        <CardContent className="p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-center text-slate-900">Zona Alumno</h1>

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

          {/* Google Login */}
          <div className="mt-6 border-t border-slate-200 pt-6">
            <Button
              onClick={socialLogin}
              className="w-full bg-white text-slate-900 flex items-center justify-center gap-2 border hover:bg-slate-50"
            >
              <FcGoogle className="w-5 h-5" /> Iniciar con Google
            </Button>
          </div>

          <p className="text-sm text-slate-500 mt-6 text-center">
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
