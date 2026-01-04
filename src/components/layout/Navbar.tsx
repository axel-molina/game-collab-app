import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu,
  X,
  Plus,
  LogOut,
  User,
  Moon,
  Sun,
  Home,
  Box,
  Bell,
  Info,
  Languages,
} from "lucide-react";
import logo from "../../../assets/icon.png";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Colors } from "@/lib/colors";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NotificationBell } from "./NotificationBell";

const getNavItems = (t: any) => [
  { name: t("nav.home"), path: "/", icon: Home },
  { name: t("nav.projects"), path: "/projects", icon: Box },
  { name: t("nav.about"), path: "/about", icon: Info },
];

export function Navbar() {
  const { t } = useTranslation();
  const { user, signOut, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = getNavItems(t);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Don't render anything while loading to prevent layout shifts
  if (loading) {
    return null;
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
        isScrolled && "shadow-sm"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-xl mr-6"
          >
            <img src={logo} alt="Logo" className="w-10 h-8" />
            <span className="hidden sm:inline">
              <span style={{ color: Colors.gameBlue }}>Game</span>
              <span style={{ color: Colors.collabGreen }}>Collab</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-1.5"
                >
                  <Link to={item.path}>
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user && <NotificationBell />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={t("common.toggle_theme")}
            className="hidden sm:flex"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <div className="hidden sm:flex">
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {!loading && (
            <>
              {user ? (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{t("nav.profile")}</span>
                    </Link>
                  </Button>

                  {/* Dropdown Publish Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="hidden sm:flex gap-2">
                        <Plus className="h-4 w-4" />
                        <span>{t("nav.publish")}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link
                          to="/projects/new"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Box className="h-4 w-4" />
                          <span>{t("nav.new_project")}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/posts/new"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Bell className="h-4 w-4" />
                          <span>{t("nav.new_post")}</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button asChild size="sm" className="hidden sm:flex">
                  <Link to="/auth" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{t("nav.login")}</span>
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container py-2">
            <nav className="flex flex-col space-y-1 py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    asChild
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <Link to={item.path}>
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                );
              })}

              {!loading && user && (
                <>
                  <div className="border-t border-border/40 my-2"></div>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <Link to="/profile">
                      <User className="h-4 w-4" />
                      <span>{t("nav.profile")}</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Link to="/projects/new">
                      <Box className="h-4 w-4" />
                      <span>{t("nav.new_project")}</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Link to="/posts/new">
                      <Bell className="h-4 w-4" />
                      <span>{t("nav.new_post")}</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t("nav.logout")}</span>
                  </Button>
                </>
              )}

              {!loading && !user && (
                <Button
                  asChild
                  variant="default"
                  className="w-full justify-center gap-2 mt-2"
                >
                  <Link to="/auth">
                    <User className="h-4 w-4" />
                    <span>{t("nav.login")}</span>
                  </Link>
                </Button>
              )}

              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  title={t("common.toggle_theme")}
                  className="h-9 w-9"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
