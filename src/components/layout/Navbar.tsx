import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Gamepad2, Plus, LogOut, User, Moon, Sun } from "lucide-react";
import logo from "/favicon.png";
import { useTheme } from "next-themes";

export function Navbar() {
  const { user, signOut, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span>GameCollab</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title="Cambiar tema"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {!loading && (
            <>
              {user ? (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Perfil</span>
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link
                      to="/projects/new"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Nuevo proyecto</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    title="Cerrar sesión"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Button asChild size="sm">
                  <Link to="/auth" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Iniciar sesión</span>
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
