import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Euro, 
  Cpu, 
  Video, 
  Download, 
  Server, 
  Monitor, 
  Brain, 
  CircuitBoard, 
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
  Award,
  Users,
  ArrowRight,
  Play
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Cpu,
      title: "IA + Hardware",
      desc: "Crea dispositivos que piensan por sí mismos. Aprende a combinar la potencia de la inteligencia artificial con componentes reales. Desde visión por computadora hasta control de sistemas en tiempo real: las mismas técnicas que usan los ingenieros en automatización y robótica avanzada.",
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      icon: Video,
      title: "11 Lecciones en Video",
      desc: "Aprende haciendo, no solo mirando. Clases grabadas con ejemplos reales, explicadas paso a paso. Diseñadas para que entiendas y apliques lo aprendido en tus propios proyectos o servicios.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Download,
      title: "Recursos Incluidos",
      desc: "Llévate las herramientas de un profesional. Código fuente, esquemas eléctricos, datasets y librerías listas para usar. Todo optimizado para que puedas experimentar, crear y monetizar tus proyectos sin empezar desde cero.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: CircuitBoard,
      title: "2 Proyectos Prácticos",
      desc: "Aplica todo y crea sistemas que se pagan solos. Construirás desde cero proyectos IoT con ESP32-CAM, GPU remota y modelos de IA integrados. Cada uno diseñado para demostrar tu dominio y abrirte puertas en el mercado tecnológico.",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const benefits = [
    { icon: Shield, text: "Garantía 30 días" },
    { icon: Award, text: "Certificado oficial" },
    { icon: Users, text: "Comunidad privada" },
    { icon: Zap, text: "Actualizaciones gratis" }
  ];

  const testimonials = [
    {
      name: "Carlos M.",
      role: "Ingeniero Electrónico",
      text: "Antes de este curso no sabía cómo conectar mis modelos de IA con hardware real. Ahora mis proyectos detectan y reaccionan solos, y he empezado a ofrecer este servicio a clientes. Literalmente, ya me ha devuelto la inversión.",
      rating: 5
    },
    {
      name: "Laura G.",
      role: "Estudiante de Robótica",
      text: "Todo encajó. Venía de cursos llenos de teoría, pero aquí por fin vi cómo se aplicaba de verdad. Ahora estoy creando mi primer sistema de visión artificial para mi proyecto final. Es otro nivel.",
      rating: 5
    },
    {
      name: "Miguel R.",
      role: "Desarrollador IoT",
      text: "El contenido es profesional y práctico. Implementé lo aprendido en una línea de producción real y el equipo quedó alucinado. Me ascendieron la siguiente semana.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-x-hidden font-sans relative">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-3xl"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            x: '-50%',
            y: '-50%'
          }}
          transition={{ type: "spring", damping: 50, stiffness: 100 }}
        />
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full bg-purple-500/10 blur-3xl"
          style={{
            left: `${100 - mousePosition.x}%`,
            top: `${100 - mousePosition.y}%`,
            x: '-50%',
            y: '-50%'
          }}
          transition={{ type: "spring", damping: 30, stiffness: 50 }}
        />
        
        {/* Floating particles */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-cyan-500/20" 
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/50 blur-xl rounded-full animate-pulse" />
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fa08262087c0b6826136b9/85babb091_images2.png"
                alt="Logo Dumalek"
                className="w-12 h-12 rounded-full border-2 border-cyan-400 shadow-lg relative z-10"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Bobinados Dumalek</h1>
              <p className="text-xs text-cyan-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Electrónica + IA Masterclass
              </p>
            </div>
          </motion.div>

          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="border-2 border-cyan-500 text-cyan-300 hover:bg-cyan-500/20 px-5 py-2 text-sm md:text-base font-semibold backdrop-blur-sm"
            >
              Zona Alumno
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/50 px-5 py-2 text-sm md:text-base font-semibold transition-all hover:scale-105"
            >
              Registrarse
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* HERO */}
      <section className="relative pt-40 pb-32 px-6 text-center overflow-hidden">
        <motion.div
          style={{ opacity, scale }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-full px-6 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">Masterclass Premium 2025</span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-black mb-8 leading-[1.1]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Domina hoy lo que las <br />
            <span className="relative inline-block mt-4">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                empresas buscarán mañana
              </span>
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-2xl -z-10"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              />
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Sé de los primeros en integrar <span className="text-cyan-400 font-semibold">IA en hardware real</span>: desde servidores con GPU hasta proyectos IoT con <span className="text-purple-400 font-semibold">ESP32-CAM</span>.
            <br />
            Aprende lo que el <span className="text-cyan-400 font-semibold">1% de las empresas</span> buscan y conviértete en la mano derecha del CEO de cualquier empresa.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={() => navigate("/register")}
              className="group bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white text-lg px-10 py-7 shadow-2xl hover:shadow-cyan-500/50 transition-all hover:scale-105 font-bold relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                🚀 Quiero estar por delante
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </Button>

            <Button
              onClick={() => navigate("/demo")}
              variant="outline"
              className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-500/20 text-lg px-10 py-7 backdrop-blur-sm font-bold group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              [VIDEO]
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-8 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex items-center gap-2 text-cyan-300">
              <Users className="w-5 h-5" />
              <span><strong className="text-white">+129</strong> futuros referentes</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300">
              <Award className="w-5 h-5" />
              <span><strong className="text-white">⭐ 5/5</strong> "No hay más"</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300">
              <CheckCircle2 className="w-5 h-5" />
              <span><strong className="text-white">Acceso de por vida</strong></span>
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </section>

      {/* FEATURES */}
      <section className="relative py-32 px-6 bg-slate-950/50 backdrop-blur-sm border-y border-cyan-500/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Todo lo que <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">vas a aprender</span>
            </h2>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
              Domina las tecnologías que las empresas empezarán a buscar mañana.
              Aprende creando, conecta teoría con práctica y lleva tus proyectos al nivel profesional.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-10 rounded-3xl blur-xl transition-opacity duration-500`} />
                <div className="relative bg-gradient-to-br from-slate-900/90 to-blue-950/90 backdrop-blur-sm border-2 border-cyan-500/20 rounded-3xl p-8 hover:border-cyan-500/50 transition-all duration-500 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <f.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="relative py-32 bg-gradient-to-r from-cyan-900/50 via-blue-900/50 to-purple-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-5xl md:text-6xl font-black mb-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            El flujo que <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">dominás para estar por delante</span>
          </motion.h2>

          <motion.p
            className="text-xl text-slate-300 text-center max-w-4xl mx-auto mb-16 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Dominar este flujo no solo te enseña el paso a paso: te coloca un paso por delante de la mayoría de técnicos e ingenieros.
            <br />
            Mientras otros aprenden teoría, tú estarás construyendo sistemas que se buscan en el mercado.
          </motion.p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-12">
            {[
              { icon: Server, title: "Servidor GPU", desc: "Procesamiento de IA avanzado", color: "purple" },
              { icon: Monitor, title: "PC / ESP32", desc: "Captura y envío de datos", color: "cyan" },
              { icon: Brain, title: "Resultado IA", desc: "Decisiones automáticas", color: "green" }
            ].map((step, i) => (
              <React.Fragment key={i}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-${step.color}-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all`} />
                  <div className="relative bg-slate-900/80 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-10 hover:border-cyan-500/50 transition-all">
                    <step.icon className={`mx-auto w-20 h-20 text-${step.color}-400 mb-5 group-hover:scale-110 transition-transform`} />
                    <h3 className="font-bold text-2xl mb-2">{step.title}</h3>
                    <p className="text-cyan-200">{step.desc}</p>
                  </div>
                </motion.div>
                {i < 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.1 }}
                    className="hidden md:block"
                  >
                    <ArrowRight className="w-12 h-12 text-cyan-400" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Lo que dicen quienes ya se <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">adelantaron al resto</span>
            </h2>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
              Aplicando ejecutando y dejando de ser espectadores
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-slate-900/90 to-blue-950/90 backdrop-blur-sm border-2 border-cyan-500/20 rounded-3xl p-8 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-slate-300 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-sm text-cyan-400">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / PRICING */}
      <section className="relative py-32 bg-gradient-to-r from-blue-900 via-cyan-900 to-blue-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.h2
            className="text-6xl md:text-7xl font-black mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            ¿Listo para <span className="bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">adelantar a los demás</span>? 🚀
          </motion.h2>

          <motion.p
            className="text-2xl text-cyan-100 mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            En unas horas puedes estar creando proyectos con IA y hardware real.
            <br />
            Acceso de por vida, soporte directo y actualizaciones constantes.
            <br />
            Lo que aprendas hoy te pondrá por delante de la mayoría en 2025.
          </motion.p>

          {/* Benefits */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {benefits.map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <b.icon className="w-10 h-10 text-cyan-300" />
                <span className="text-sm text-white font-medium">{b.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="inline-block bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-10 mb-12 relative"
          >
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-6 py-2 rounded-full animate-bounce shadow-lg">
              ¡Oferta Limitada!
            </div>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <Euro className="w-12 h-12 text-white" />
              <span className="text-7xl font-black text-white">17</span>
              <span className="text-4xl text-white">,99</span>
            </div>
            <p className="text-cyan-100 text-lg">Pago único · Acceso de por vida</p>
          </motion.div>

          <Button
            onClick={() => navigate("/register")}
            className="bg-white text-cyan-900 text-xl px-16 py-8 shadow-2xl hover:bg-slate-100 transition-all hover:scale-105 font-black group"
          >
            Comprar Ahora por 17,99€
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-cyan-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Pago único</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Acceso de por vida</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Actualizaciones incluidas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Garantía 30 días</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fa08262087c0b6826136b9/85babb091_images2.png"
              alt="Logo"
              className="w-12 h-12 rounded-full border-2 border-cyan-400"
            />
            <div className="text-left">
              <h3 className="text-white font-bold text-xl">Bobinados Dumalek</h3>
              <p className="text-cyan-400 text-sm">Electrónica + IA Masterclass</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            © 2025 Bobinados Dumalek. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
