import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, User, Moon, Sun, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export const ModernHeader = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        document.getElementById("omnibox")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="font-bold text-lg lg:text-xl text-primary shrink-0">
            익명 고민 상자
          </Link>

          {/* Desktop: Centered Omnibox */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="omnibox"
                placeholder="내용이나 태그로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-20 h-12 rounded-full bg-muted/50 border-border/50 focus:bg-background transition-colors"
              />
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-muted rounded border border-border text-muted-foreground">
                /
              </kbd>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => {
                const input = document.querySelector('input[placeholder*="검색"]') as HTMLInputElement;
                input?.focus();
              }}
            >
              <Search className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/mypage")}
            >
              <User className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
