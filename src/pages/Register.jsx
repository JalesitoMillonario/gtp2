import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password !== form.confirm)
      return setErr("Las contraseñas no coinciden");
    if (form.password.length < 6)
      return setErr("La contraseña debe tener al menos 6 caracteres");

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
          status: "pending_payment",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrarse");
      localStorage.setItem("token", data.token);

      // Redirigir a SocialLogin para verificación del estado
      navigate(`/social-login?token=${data.token}`);
    } catch (error) {
      setErr(error?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  const socialRegister = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-3xl"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          x: "-50%",
          y: "-50%",
        }}
        transition={{ type: "spring", damping: 50, stiffness: 100 }}
      />
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full bg-purple-500/10 blur-3xl"
        style={{
          left: `${100 - mousePosition.x}%`,
          top: `${100 - mousePosition.y}%`,
          x: "-50%",
          y: "-50%",
        }}
        transition={{ type: "spring", damping: 40, stiffness: 70 }}
      />

      <motion.div
        className="relative z-10 bg-white/10 backdrop-blur-2xl border border-cyan-500/20 rounded-3xl p-10 w-full max-w-md shadow-2xl text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6">
          <Sparkles className="mx-auto text-cyan-400 w-6 h-6 mb-3 animate-pulse" />
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Únete a la Masterclass
          </h1>
          <p className="text-slate-300 text-sm">
            Transforma tu carrera con Electrónica + Inteligencia Artificial ⚡
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-left">
          <div>
            <Label>Nombre completo</Label>
            <Input
              type="text"
              value={form.full_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, full_name: e.target.value }))
              }
              required
              className="bg-white/10 border-cyan-500/20 text-white placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
              className="bg-white/10 border-cyan-500/20 text-white placeholder:text-slate-400"
            />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              required
              className="bg-white/10 border-cyan-500/20 text-white"
            />
          </div>
          <div>
            <Label>Confirmar Contraseña</Label>
            <Input
              type="password"
              value={form.confirm}
              onChange={(e) =>
                setForm((f) => ({ ...f, confirm: e.target.value }))
              }
              required
              className="bg-white/10 border-cyan-500/20 text-white"
            />
          </div>

          {err && (
            <div className="p-3 bg-red-50/10 border border-red-500/30 rounded-lg text-sm text-red-400">
              {err}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-6 text-lg mt-4"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Registrando…
              </>
            ) : (
              <>
                🚀 Crear mi cuenta <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 border-t border-cyan-500/10 pt-6">
          <Button
            onClick={socialRegister}
            className="w-full bg-white text-slate-900 flex items-center justify-center gap-2 border hover:bg-slate-50"
          >
            <FcGoogle className="w-5 h-5" /> Registrarme con Google
          </Button>
        </div>

        <div className="mt-6 text-sm text-slate-400 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-cyan-300">
            <CheckCircle2 className="w-4 h-4" /> Acceso de por vida
          </div>
          <div className="flex items-center gap-2 text-cyan-300">
            <CheckCircle2 className="w-4 h-4" /> Certificado oficial
          </div>
        </div>

        <p className="text-sm text-slate-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <button
            className="text-cyan-400 underline"
            onClick={() => navigate("/login")}
          >
            Inicia sesión
          </button>
        </p>
      </motion.div>
    </div>
  );
}
