import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";

interface SignOutButtonProps {
  handleSignOut: () => void;
  isSigningOut: boolean;
}

const SignOutButton = ({ handleSignOut, isSigningOut }: SignOutButtonProps) => {
  return (
    <Button
      variant="outline"
      className="w-full text-destructive hover:text-destructive/90 hover:bg-destructive/10"
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      {isSigningOut ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      Cerrar sesión
    </Button>
  );
};

export default SignOutButton;
