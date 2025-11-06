import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { customApi, createPageUrl } from "@/utils";
import { 
  Zap, 
  Cpu, 
  BookOpen, 
  Award,
  CheckCircle2,
  Users,
  Clock,
  Loader2
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    customApi.auth.isAuthenticated().then(isAuth => {
      if (isAuth) navigate(createPageUrl("curso?module=introduccion"));
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await customApi.auth.login(loginData.email, loginData.password);
      navigate(createPageUrl("curso?module=introduccion"));
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (registerData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      await customApi.auth.register(
        registerData.email,
        registerData.password,
        registerData.full_name
      );
      navigate(createPageUrl("curso?module=introduccion"));
    } catch (err) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white relative overflow-hidden">
      {/* ✨ Degradado sutil animado */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-700/30 via-purple-700/20 to-transparent blur-3xl animate-pulse-slow"></div>

      <div className="relative container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16 pt-8">
          <div className="flex justify-center mb-8">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fa08262087c0b6826136b9/85babb091_images2.png"
              alt="Logo"
              className="h-24 w-auto drop-shadow-[0_0_30px_rgba(56,189,248,0.4)]"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            Fusión entre{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Electrónica e Inteligencia Artificial
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Aprende a integrar IA con hardware: desde servidores con GPU hasta proyectos IoT con ESP32-CAM. 
          </p>
        </div>

        {/* Beneficios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { icon: Zap, title: "Proyectos Reales", color: "from-cyan-400 to-blue-500", desc: "Crea hardware inteligente con IA integrada." },
            { icon: Cpu, title: "Machine Learning", color: "from-purple-400 to-pink-500", desc: "Entrena y ejecuta modelos en tus propios dispositivos." },
            { icon: BookOpen, title: "Contenido Estructurado", color: "from-green-400 to-emerald-500", desc: "Videos, esquemas y prácticas paso a paso." },
            { icon: Award, title: "Certificación", color: "from-yellow-400 to-orange-500", desc: "Demuestra tus habilidades con proyectos completos." }
          ].map((b, i) => {
            const Icon = b.icon;
            return (
              <Card key={i} className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-cyan-400/40 transition-all duration-300 hover:scale-[1.03]">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{b.title}</h3>
                  <p className="text-slate-300">{b.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Login/Register */}
        <div className="max-w-md mx-auto mb-24">
          <Card className="bg-white/10 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardContent className="p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-900/40 border border-white/10">
                  <TabsTrigger value="login">Zona Alumno</TabsTrigger>
                  <TabsTrigger value="register">Registrarse</TabsTrigger>
                </TabsList>

                {/* Login */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        required
                        className="bg-slate-900/50 text-white border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-password">Contraseña</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                        className="bg-slate-900/50 text-white border-white/20"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    <Button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Iniciando...
                        </>
                      ) : "Entrar en Zona Alumno"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Registro */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="register-name">Nombre Completo</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Tu nombre"
                        value={registerData.full_name}
                        onChange={(e) => setRegisterData({...registerData, full_name: e.target.value})}
                        required
                        className="bg-slate-900/50 text-white border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        required
                        className="bg-slate-900/50 text-white border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-password">Contraseña</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        required
                        className="bg-slate-900/50 text-white border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-confirm">Confirmar Contraseña</Label>
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder="Repite tu contraseña"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        required
                        className="bg-slate-900/50 text-white border-white/20"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    <Button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registrando...
                        </>
                      ) : "Crear Cuenta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 text-sm">
          <p>© 2025 Bobinados Dumalek · Electrónica + IA Masterclass</p>
        </div>
      </div>
    </div>
  );
}
