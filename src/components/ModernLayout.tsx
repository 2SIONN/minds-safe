import { ReactNode } from "react";
import { ModernHeader } from "@/components/ModernHeader";
import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernLayoutProps {
  children: ReactNode;
}

export const ModernLayout = ({ children }: ModernLayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "홈" },
    { path: "/create", icon: PlusCircle, label: "작성" },
    { path: "/mypage", icon: User, label: "마이" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Modern Header */}
      <ModernHeader />

      {/* Main Content */}
      <main className="min-h-[calc(100vh-5rem)]">{children}</main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-card border-t z-50">
        <div className="container flex items-center justify-around h-16">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex flex-col items-center gap-1 touch-target transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
