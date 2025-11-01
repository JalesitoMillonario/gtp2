import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Euro, Cpu, Video, Download, Server, Monitor, Brain, CircuitBoard, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: Cpu,
      title: "IA + Hardware",
      desc: "Aprende a unir la potencia del procesamiento neuronal con componentes físicos. Desde visión por computadora hasta control de sistemas en tiempo real."
    },
    {
      icon: Video,
      title: "9 Lecciones en Video",
      desc: "Clases grabadas con calidad Full HD, ejemplos prácticos, y demostraciones en tiempo real para entender cada concepto paso a paso."
    },
    {
      icon: Download,
      title: "Recursos Incluidos",
      desc: "Código fuente, esquemas eléctricos, datasets y librerías optimizadas. Todo listo para usar y experimentar sin límites."
    },
    {
      icon: CircuitBoard,
      title: "3 Proyectos Prácticos",
      desc: "Construye desde cero un sistema IoT completo con ESP32-CAM, GPU remota y modelos de IA integrados."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white overflow-x-hidden font-sans">

      {/* 🔹 Navbar fija */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-md border-b border-white/10 ${
          scrolled ? "bg-slate-900/95 shadow-lg" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-3">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fa08262087c0b6826136b9/85babb091_images2.png"
              alt="Logo Dumalek"
              className="w-12 h-12 rounded-full border-2 border-cyan-400 shadow-md"
            />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Bobinados Dumalek</h1>
              <p className="text-xs text-cyan-300">Electrónica + IA Masterclass</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="border-cyan-500 text-cyan-300 hover:bg-cyan-500/20 px-4 py-2 text-sm md:text-base"
            >
              Zona Alumno
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-md px-4 py-2 text-sm md:text-base"
            >
              Registrarse
            </Button>
          </div>
        </div>
      </motion.header>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Domina la Fusión entre <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Electrónica e Inteligencia Artificial
          </span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Aprende a integrar modelos de IA con hardware real. Desde servidores con GPU hasta proyectos IoT con ESP32-CAM.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={() => navigate("/register")}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg px-8 py-6 shadow-lg hover:scale-105 transition-all"
          >
            🚀 Comenzar Ahora
          </Button>
          <Button
            onClick={() => navigate("/demo")}
            variant="outline"
            className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-500/20 text-lg px-8 py-6"
          >
            🎬 Ver Demo del Curso
          </Button>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 bg-slate-950/50 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Todo lo que Aprenderás</h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Con esta masterclass, comprenderás desde los fundamentos de la inteligencia artificial hasta su aplicación en sistemas embebidos y control industrial.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-gradient-to-br from-slate-900 to-blue-950 border border-cyan-500/30 rounded-3xl p-8 hover:shadow-cyan-500/20 hover:shadow-2xl transition-all duration-300"
            >
              <f.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FLUJO PROFESIONAL */}
      <section className="py-24 bg-gradient-to-r from-cyan-700 via-blue-700 to-purple-700 text-center text-white">
        <motion.h2
          className="text-4xl font-bold mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          El Flujo Profesional que Dominarás
        </motion.h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }}>
            <Server className="mx-auto w-16 h-16 text-purple-300 mb-3" />
            <h3 className="font-bold text-xl">Servidor GPU</h3>
            <p className="text-cyan-100">Procesamiento de IA avanzado</p>
          </motion.div>
          <div className="text-4xl text-cyan-300">→</div>
          <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.2 }}>
            <Monitor className="mx-auto w-16 h-16 text-cyan-300 mb-3" />
            <h3 className="font-bold text-xl">PC / ESP32</h3>
            <p className="text-cyan-100">Captura y envío de datos</p>
          </motion.div>
          <div className="text-4xl text-cyan-300">↔</div>
          <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.4 }}>
            <Brain className="mx-auto w-16 h-16 text-green-400 mb-3" />
            <h3 className="font-bold text-xl">Resultado IA</h3>
            <p className="text-cyan-100">Decisiones automáticas y control</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-gradient-to-r from-blue-800 to-cyan-700">
        <motion.h2
          className="text-5xl font-extrabold mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          ¿Listo para Empezar?
        </motion.h2>
        <p className="text-lg text-cyan-100 mb-10">
          Obtén acceso de por vida, soporte directo del instructor y actualizaciones constantes.
        </p>

        <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-5 mb-8 border border-white/20">
          <Euro className="w-10 h-10 text-white" />
          <div>
            <p className="text-sm text-cyan-100">Precio Único</p>
            <p className="text-5xl font-bold text-white">17,99€</p>
          </div>
          <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-lg animate-pulse">
            ¡Oferta Limitada!
          </span>
        </div>

        <Button
          onClick={() => navigate("/register")}
          className="bg-white text-cyan-700 text-lg px-10 py-6 shadow-lg hover:bg-slate-100 transition-transform hover:scale-105"
        >
          Comprar Ahora por 17,99€
        </Button>

        <p className="text-sm text-cyan-100 mt-4">
          ✓ Pago único · ✓ Acceso de por vida · ✓ Actualizaciones incluidas
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950/90 py-8 text-center text-slate-400">
        <h3 className="text-white font-bold text-lg">Bobinados Dumalek</h3>
        <p className="text-sm mt-2">© 2025 Bobinados Dumalek - Electrónica + IA Masterclass. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
