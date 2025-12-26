import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Colors } from "@/lib/colors";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            © 2025{" "}
            <span style={{ color: Colors.gameBlue }}>Game</span>
            <span style={{ color: Colors.collabGreen }}>Collab</span>. Conectando desarrolladores de videojuegos.
          </p>
        </div>
      </footer>
    </div>
  );
}
