
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Euro, CheckCircle2, ArrowRight, Shield, Award, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PagoPage() {
  const navigate = useNavigate();
  const benefits = [
    { icon: Shield, text: "Garantía de 30 días" },
    { icon: Award, text: "Certificado oficial" },
    { icon: Users, text: "Comunidad privada" },
    { icon: Zap, text: "Actualizaciones gratis" }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto relative z-10"
      >
        <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          ¡Estás a un paso de entrar!
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Consigue acceso de por vida a la <span className="text-cyan-400 font-bold">Masterclass Premium</span> y domina la fusión entre <span className="text-purple-400 font-bold">Electrónica e Inteligencia Artificial</span>.
        </p>

        <div className="inline-block bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-10 mb-10 relative">
          <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-6 py-2 rounded-full animate-bounce shadow-lg">
            ¡Oferta Limitada!
          </div>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <Euro className="w-12 h-12 text-white" />
            <span className="text-7xl font-black text-white">17</span>
            <span className="text-4xl text-white">,99</span>
          </div>
          <p className="text-cyan-100 text-lg">Pago único · Acceso de por vida</p>
        </div>

        <Button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-cyan-900 text-xl px-16 py-8 shadow-2xl hover:bg-slate-100 transition-all hover:scale-105 font-black group"
        >
          Completar Inscripción
          <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Button>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <b.icon className="w-10 h-10 text-cyan-300" />
              <span className="text-sm text-white font-medium">{b.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-cyan-950/10 blur-3xl" />
    </div>
  );
}
