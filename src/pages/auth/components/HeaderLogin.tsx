import React from "react";
import { useTranslation } from "react-i18next";
import { Gamepad2 } from "lucide-react";
import { Colors } from "@/lib/colors";

interface HeaderLoginProps {
  showResetPassword: boolean;
}

const HeaderLogin = ({ showResetPassword }: HeaderLoginProps) => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
        <Gamepad2 className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold">
        {showResetPassword ? (
          t("auth.reset_header_title")
        ) : (
          <>
            {t("auth.header_title")}{" "}
            <span style={{ color: Colors.gameBlue }}>Game</span>
            <span style={{ color: Colors.collabGreen }}>Collab</span>
          </>
        )}
      </h1>
      <p className="text-muted-foreground">
        {showResetPassword
          ? t("auth.reset_header_subtitle")
          : t("auth.header_subtitle")}
      </p>
    </div>
  );
};

export default HeaderLogin;
