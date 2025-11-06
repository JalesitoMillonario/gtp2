import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { customApi } from "@/utils";

export default function SocialLoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Completando inicio de sesión...");
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const handleSocialLogin = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        setStatus("error");
        setMessage(`Error: ${error}`);
        return;
      }

      if (!token) {
        setStatus("error");
        setMessage("No se recibió token de autenticación");
        return;
      }

      try {
        localStorage.setItem("token", token);
        setMessage("Verificando tu cuenta...");
        const user = await customApi.auth.me();

        if (user.is_paid === 0 || user.status === "pending_payment") {
          setMessage("¡Casi listo! Completa tu pago...");
          setStatus("success");
          setTimeout(() => navigate("/pago"), 1500);
        } else {
          setMessage("¡Bienvenido al curso!");
          setStatus("success");
          setTimeout(() => navigate("/dashboard"), 1500);
        }
      } catch (err) {
        console.error("Error al verificar usuario:", err);
        setStatus("error");
        setMessage(`Error: ${err.message}`);
        localStorage.removeItem("token");
      }
    };

    handleSocialLogin();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md w-full"
      >
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-spin" />
            <p className="text-white text-xl font-semibold">{message}</p>
            <p className="text-slate-400 mt-2">Un momento por favor...</p>
          </>
        )}

        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            </motion.div>
            <p className="text-white text-xl font-semibold">{message}</p>
            <p className="text-slate-400 mt-2">Redirigiendo...</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-white text-xl font-semibold">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              Volver al Login
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
