import React from "react";
import { Gamepad2 } from "lucide-react";
import { Colors } from "@/lib/colors";

interface HeaderLoginProps {
  showResetPassword: boolean;
}

const HeaderLogin = ({ showResetPassword }: HeaderLoginProps) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
        <Gamepad2 className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold">
        {showResetPassword ? (
          "Restablecer contraseña"
        ) : (
          <>
            Bienvenido a <span style={{ color: Colors.gameBlue }}>Game</span>
            <span style={{ color: Colors.collabGreen }}>Collab</span>
          </>
        )}
      </h1>
      <p className="text-muted-foreground">
        {showResetPassword
          ? "Ingresa tu correo para restablecer tu contraseña"
          : "Inicia sesión o crea una cuenta para publicar proyectos"}
      </p>
    </div>
  );
};

export default HeaderLogin;
