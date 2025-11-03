import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2, Shield } from "lucide-react";

const API_URL = 'https://apicurso.bobinadosdumalek.es/api';

export default function PagoPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_URL}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('No autorizado');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error:', err);
        navigate("/login");
      }
    };
    getUser();
  }, [navigate]);

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/payments/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: 1799 })
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(`Error: ${text}`);
      }

      const data = JSON.parse(text);

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No se pudo procesar el pago');
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error al procesar el pago. Intenta de nuevo.");
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Bobinados Dumalek</h1>
          <p className="text-gray-600 text-sm md:text-base">Completa tu acceso al curso</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Left: Benefits & Info */}
          <div className="md:col-span-2">
            {/* What You Get */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-6">
                ¿Qué obtendrás?
              </h2>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">Acceso de por vida</p>
                    <p className="text-xs md:text-sm text-gray-600">Aprende a tu ritmo sin límites</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">9 lecciones en video</p>
                    <p className="text-xs md:text-sm text-gray-600">Clases Full HD con ejemplos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">2 proyectos completos</p>
                    <p className="text-xs md:text-sm text-gray-600">IoT y sistemas embebidos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">Recursos descargables</p>
                    <p className="text-xs md:text-sm text-gray-600">Código y documentación</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">Comunidad privada</p>
                    <p className="text-xs md:text-sm text-gray-600">Conecta con otros alumnos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">Actualizaciones gratis</p>
                    <p className="text-xs md:text-sm text-gray-600">Contenido nuevo incluido</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 md:p-8 mb-6">
              <div className="flex items-start gap-3 md:gap-4">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 text-base md:text-lg">Garantía de 15 días</p>
                  <p className="text-xs md:text-sm text-blue-800 mt-2">
                    Si no queda completamente satisfecho durante los primeros 15 días, le devolveremos el 100% de su dinero, sin preguntas. Solo necesita notificarnos por email a soporte@bobinadosdumalek.es
                  </p>
                </div>
              </div>
            </div>

            {/* Return Policy */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Política de Devolución</h3>
              <div className="space-y-3 text-xs md:text-sm text-gray-700">
                <p>
                  <strong>Período de devolución:</strong> 15 días desde la fecha de compra
                </p>
                <p>
                  <strong>Cómo solicitar:</strong> Envíe un email a soporte@bobinadosdumalek.es con su nombre y correo electrónico
                </p>
                <p>
                  <strong>Procesamiento:</strong> Las devoluciones se procesan en 5-7 días hábiles
                </p>
                <p>
                  <strong>Reembolso:</strong> Se acreditará en su cuenta bancaria o medio de pago original
                </p>
                <p className="text-gray-600 italic">
                  No hay condiciones ocultas. Su satisfacción es nuestra prioridad.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Payment Card */}
          <div>
            <Card className="border border-gray-200 shadow-md sticky top-4 md:top-8">
              <CardHeader className="border-b border-gray-100 pb-4 bg-gray-50">
                <CardTitle className="text-base md:text-lg font-semibold text-gray-900">
                  Resumen de compra
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Product */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                    Masterclass Electrónica + IA
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">Acceso permanente</p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Price */}
                <div className="flex justify-between items-baseline mb-2 text-xs md:text-sm">
                  <span className="text-gray-700">Precio normal</span>
                  <span className="text-gray-500 line-through">€99,99</span>
                </div>
                <div className="flex justify-between items-baseline mb-6">
                  <span className="font-semibold text-gray-900">Hoy</span>
                  <div className="text-right">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">€17,99</div>
                    <div className="text-xs text-green-600 font-medium">Ahorra 82%</div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Error Alert */}
                {error && (
                  <Alert className="bg-red-50 border border-red-200 mb-6">
                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <AlertDescription className="text-red-700 text-xs md:text-sm ml-2">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 mb-3 rounded-lg text-sm md:text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Acceso Inmediato'
                  )}
                </Button>

                <Button
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                  variant="outline"
                  className="w-full text-gray-700 border-gray-300 hover:bg-gray-50 text-sm md:text-base"
                >
                  Volver
                </Button>

                {/* Security Info */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  🔒 Pago 100% seguro • Encriptación SSL
                </p>

                {/* Trust badges */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 text-center mb-3 font-medium">
                    Confía en nosotros
                  </p>
                  <div className="flex justify-center gap-2 text-xs text-gray-600 flex-wrap">
                    <span>✓ Pago seguro</span>
                    <span>✓ Acceso inmediato</span>
                    <span>✓ Garantía 15 días</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
