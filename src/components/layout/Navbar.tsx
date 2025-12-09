import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Gamepad2, Plus, LogOut, User } from "lucide-react";

export function Navbar() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <span>GameCollab</span>
        </Link>

        <nav className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <>
                  <Button asChild variant="default" size="sm">
                    <Link to="/projects/new">
                      <Plus className="h-4 w-4 mr-1" />
                      Nuevo proyecto
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleSignOut} title="Cerrar sesión">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Button asChild variant="default" size="sm">
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-1" />
                    Iniciar sesión
                  </Link>
                </Button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
