import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Download, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { customApi } from "@/utils";

export default function PagoExitoso() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentId = searchParams.get('paymentId');
        if (!paymentId) {
          setTimeout(() => navigate("/dashboard"), 3000);
          return;
        }

        // Verificar estado del pago
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/payments/status/${paymentId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        const data = await response.json();
        if (data.isPaid) {
          setVerified(true);
          setTimeout(() => navigate("/dashboard"), 3000);
        }
      } catch (err) {
        console.error('Error verificando pago:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        {loading ? (
          <>
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-cyan-200 font-medium">Verificando pago...</p>
          </>
        ) : verified ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-4" />
            </motion.div>

            <h1 className="text-4xl font-black text-white mb-3">¡Pago Completado!</h1>
            <p className="text-cyan-200 mb-8">Tu acceso al curso ha sido activado correctamente</p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-left p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <Sparkles className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-200">Acceso de por vida</span>
              </div>
              <div className="flex items-center gap-3 text-left p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <Download className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-200">Todos los recursos disponibles</span>
              </div>
              <div className="flex items-center gap-3 text-left p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <Users className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-200">Acceso a comunidad privada</span>
              </div>
            </div>

            <p className="text-slate-400 mb-4">Redirigiendo al dashboard en 3 segundos...</p>

            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 w-full"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Ir al Curso Ahora
            </Button>
          </>
        ) : (
          <>
            <p className="text-red-400 font-medium">Error al verificar el pago</p>
            <Button
              onClick={() => navigate("/dashboard")}
              className="mt-4 bg-gradient-to-r from-cyan-600 to-blue-600"
            >
              Ir al Dashboard
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}
