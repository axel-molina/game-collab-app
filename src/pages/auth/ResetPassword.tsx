import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPassword() {
  const { t } = useTranslation();
  const { updateUserPassword } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if the user arrived here with a valid recovery token situation.
    // In Supabase PKCE flow, the session is usually set automatically after clicking
    // the reset email link. We just verify they are logged in.
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error(t("auth.invalid_recovery_link") || "El enlace de recuperación ha expirado o no es válido.");
        navigate("/auth");
      }
    };
    checkSession();
  }, [navigate, t]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t("auth.passwords_dont_match") || "Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      toast.error(t("auth.password_min_length") || "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsSubmitting(true);
    const { error } = await updateUserPassword(password);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("auth.password_updated") || "¡Contraseña actualizada con éxito!");
      navigate("/auth");
    }

    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="container max-w-md py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Recuperar Contraseña</h1>
          <p className="text-muted-foreground mt-2">
            Ingresa tu nueva contraseña a continuación
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nueva Contraseña</CardTitle>
            <CardDescription>Escoge una contraseña segura y no la compartas.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Contraseña"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
