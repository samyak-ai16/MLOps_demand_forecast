import { useState, useEffect, useRef } from "react";
import { Bell, Search, Sun, Moon, User, LogOut, Home } from "lucide-react";
import { notifications } from "@/lib/demo-data";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";

export function TopBar() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showUserMenu]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-14 border-b-2 border-border bg-card flex items-center justify-between px-4 gap-4">
      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:flex items-center">
        <div className="relative w-full">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full nb-input pl-8 pr-3 py-1.5 text-sm bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="nb-btn bg-card p-2 relative"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold px-1 nb-badge">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 nb-card-static bg-card z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b-2 border-border font-bold text-sm">Notifications</div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 border-b border-border text-sm ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-muted-foreground text-xs mt-1">{n.message}</div>
                  <div className="text-muted-foreground text-[10px] mt-1">{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button onClick={() => setDark((d) => !d)} className="nb-btn bg-card p-2">
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="nb-btn bg-primary text-primary-foreground px-3 py-1.5 flex items-center gap-2"
          >
            <User className="size-4" />
            <span className="text-sm font-semibold hidden sm:inline">{user?.name || "Admin"}</span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 nb-card-static bg-card z-50">
              <button
                onClick={() => { setShowUserMenu(false); navigate("/"); }}
                className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-muted border-b border-border"
              >
                <Home className="size-4" /> Landing Page
              </button>
              <button
                onClick={async () => { setShowUserMenu(false); await signOut(); navigate("/"); }}
                className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-muted text-destructive"
              >
                <LogOut className="size-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
