import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const curiosidades = [
  "La IA puede optimizar el consumo energético de circuitos en tiempo real",
  "Los microcontroladores modernos pueden ejecutar modelos de IA básicos",
  "Arduino y TensorFlow Lite se pueden integrar para crear dispositivos inteligentes",
  "La visión por computadora en electrónica permite inspección automática de PCBs",
  "Los sensores IoT generan datos perfectos para entrenar redes neuronales",
  "Edge AI permite procesar datos directamente en dispositivos sin conexión",
  "Las redes neuronales pueden predecir fallos en componentes electrónicos",
  "El aprendizaje automático mejora la eficiencia de convertidores de potencia"
];

export default function SplashScreen({ onComplete }) {
  const [currentCuriosidad, setCurrentCuriosidad] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    const curiosidadTimer = setInterval(() => {
      setCurrentCuriosidad((prev) => (prev + 1) % curiosidades.length);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(curiosidadTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-16"
      >
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fa08262087c0b6826136b9/85babb091_images2.png"
          alt="Bobinados Dumalek"
          className="h-48 w-auto drop-shadow-2xl"
        />
      </motion.div>

      <div className="max-w-2xl px-8 mb-12 h-24 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentCuriosidad}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white text-xl font-medium"
          >
            💡 {curiosidades[currentCuriosidad]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="w-80">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "linear" }}
          className="h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full shadow-lg"
        />
        <p className="text-center text-cyan-300 text-sm mt-4 font-medium">Cargando plataforma...</p>
      </div>
    </motion.div>
  );
}