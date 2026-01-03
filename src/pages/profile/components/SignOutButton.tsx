import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SignOutButtonProps {
  handleSignOut: () => void;
  isSigningOut: boolean;
}

const SignOutButton = ({ handleSignOut, isSigningOut }: SignOutButtonProps) => {
  const { t } = useTranslation();

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
      {isSigningOut ? t("common.signing_out") : t("common.sign_out")}
    </Button>
  );
};

export default SignOutButton;
