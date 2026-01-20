import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Colors } from "@/lib/colors";
import { useProfile } from "@/hooks/useProfile";
import { OnboardingModal } from "@/components/profile/OnboardingModal";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { data: profile } = useProfile();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {profile && <OnboardingModal profile={profile} />}
      <footer className="border-t border-border py-8 mt-auto">
        <div className="container flex flex-col items-center gap-4 text-center text-sm text-muted-foreground">
          <p>
            © 2025 <span style={{ color: Colors.gameBlue }}>Game</span>
            <span style={{ color: Colors.collabGreen }}>Collab</span>.
            {t("common.footer_text")}
          </p>
          <Link
            to="/feedback"
            className="hover:text-primary transition-colors underline underline-offset-4"
          >
            {t("feedback.footer_link")}
          </Link>
        </div>
      </footer>
    </div>
  );
}
