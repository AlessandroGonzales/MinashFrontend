// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import WelcomeMessage from "../WelcomeMessage";

export default function AuthModal({ onClose }) {
  const [step, setStep] = useState("choice");
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState("");

  const handleRegisterSuccess = (name) => {
    setUserName(name);
    setShowWelcome(true);
    setStep("choice");

    setTimeout(() => {
      setShowWelcome(false);
      onClose(); // cierra el modal completo
    }, 4000);
  };

  return (
    <>
      {/* ===== WELCOME MESSAGE (exclusivo) ===== */}
      <AnimatePresence>
        {showWelcome && <WelcomeMessage name={userName} />}
      </AnimatePresence>

      {/* ===== AUTH MODAL ===== */}
      {!showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* FONDO */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-graphite p-6 sm:p-10 rounded-2xl w-[95%] sm:w-full max-w-md text-center shadow-xl z-10"
          >
            {step === "choice" && (
              <>
                <h2 className="text-3xl font-extrabold mb-4">
                  Bienvenido a <span className="text-gold">Minash</span>
                </h2>

                <p className="text-ice mb-8">
                  Inicia sesión o regístrate para continuar
                </p>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setStep("login")}
                    className="py-3 border border-gold text-gold rounded-md hover:bg-gold/10 transition"
                  >
                    Iniciar sesión
                  </button>

                  <button
                    onClick={() => setStep("register")}
                    className="py-3 bg-gold text-black rounded-md font-semibold hover:opacity-90 transition"
                  >
                    Registrarse
                  </button>
                </div>
              </>
            )}

            {step === "login" && (
              <>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-ice hover:text-gold"
                >
                  <X />
                </button>
                <h2 className="text-2xl font-bold mb-6">Iniciar sesión</h2>
                <LoginForm onSuccess={onClose} />
                <button
                  onClick={() => setStep("choice")}
                  className="mt-6 text-sm text-ice hover:text-gold transition"
                >
                  ← Volver
                </button>
              </>
            )}

            {step === "register" && (
              <>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-ice hover:text-gold"
                >
                  <X />
                </button>
                <h2 className="text-2xl font-bold mb-6">Registro</h2>
                <RegisterForm onSuccess={handleRegisterSuccess} />
                <button
                  onClick={() => setStep("choice")}
                  className="mt-6 text-sm text-ice hover:text-gold transition"
                >
                  ← Volver
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
