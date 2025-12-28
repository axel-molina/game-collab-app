import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Colors } from "@/lib/colors";
import { useProfile } from "@/hooks/useProfile";
import { OnboardingModal } from "@/components/profile/OnboardingModal";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { data: profile } = useProfile();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {profile && <OnboardingModal profile={profile} />}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            © 2025 <span style={{ color: Colors.gameBlue }}>Game</span>
            <span style={{ color: Colors.collabGreen }}>Collab</span>.
            Conectando desarrolladores de videojuegos.
          </p>
        </div>
      </footer>
    </div>
  );
}
