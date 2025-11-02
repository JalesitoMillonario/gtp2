import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Sparkles, 
  Shield, 
  Award, 
  Users, 
  Zap,
  CreditCard,
  Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { customApi } from "@/utils";

export default function PagoPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    customApi.auth.me()
      .then(setUser)
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // Aquí conectarás con Stripe
      const response = await customApi.payments.createCheckoutSession({
        priceId: "price_xxx", // Tu price ID de Stripe
        successUrl: `${window.location.origin}/pago-exitoso`,
        cancelUrl: `${window.location.origin}/pago`,
      });

      // Redirigir a Stripe Checkout
      window.location.href = response.url;
    } catch (err) {
      console.error("Error al procesar pago:", err);
      setError("Error al procesar el pago. Intenta de nuevo.");
      setLoading(false);
    }
  };

  const benefits = [
    { icon: CheckCircle2, text: "Acceso de por vida a todo el contenido" },
    { icon: Award, text: "Certificado oficial al completar" },
    { icon: Users, text: "Comunidad privada de estudiantes" },
    { icon: Zap, text: "Actualizaciones y contenido nuevo gratis" },
    { icon: Shield, text: "Garantía de 30 días - Devolución completa" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-5xl font-black text-white mb-4">
            ¡Último Paso!
          </h1>
          <p className="text-xl text-slate-300">
            Completa tu acceso a la Masterclass de Electrónica + IA
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Beneficios */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-2 border-cyan-500/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Lo que obtienes:
                </h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <Icon className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                        <span className="text-slate-200">{benefit.text}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                  <p className="text-sm text-cyan-300 text-center">
                    🎓 Más de 500 estudiantes ya están aprendiendo
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pago */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-2 border-purple-500/30">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-baseline gap-2 mb-2">
                    <span className="text-6xl font-black text-white">17</span>
                    <span className="text-4xl font-bold text-white">,99€</span>
                  </div>
                  <p className="text-slate-300">Pago único - Acceso de por vida</p>
                  
                  <div className="mt-4 inline-block bg-red-500/20 border border-red-500/50 rounded-full px-4 py-2">
                    <span className="text-red-300 font-bold text-sm">
                      🔥 Oferta por tiempo limitado
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold py-6 text-lg shadow-2xl hover:shadow-purple-500/50 transition-all mb-4"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pagar con Stripe
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Lock className="w-4 h-4" />
                  <span>Pago 100% seguro con Stripe</span>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    Incluye:
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      9 lecciones en video HD
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      3 proyectos prácticos completos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      Código fuente y recursos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      Soporte del instructor
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-slate-400 text-sm">
            ¿Tienes dudas?{" "}
            <a href="mailto:ventas@bobinadosdumalek.es" className="text-cyan-400 underline">
              Contáctanos
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
