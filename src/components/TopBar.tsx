import { useState, useEffect, useRef } from "react";
import { Bell, Search, Sun, Moon, User, LogOut, Home, Sparkles } from "lucide-react";
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
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    if (showUserMenu || showNotifs) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showUserMenu, showNotifs]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-14 border-b border-border/60 bg-card/70 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 gap-4 sticky top-0 z-20">
      {/* Search */}
      <div className="flex-1 max-w-sm hidden sm:flex items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
          <input
            type="text"
            placeholder="Search models, metrics, products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-transparent focus:border-indigo-300 dark:focus:border-indigo-700 focus:bg-background focus:ring-2 focus:ring-indigo-200/30 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="size-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors relative border border-border/60"
            title="Notifications"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-rose-400 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-card border border-border/80 shadow-xl z-50 max-h-96 overflow-y-auto p-1.5 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="p-2.5 border-b border-border/50 font-semibold text-xs text-foreground flex items-center justify-between">
                <span>Notifications</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 font-medium">
                  {unreadCount} new
                </span>
              </div>
              <div className="p-1 space-y-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs transition-colors ${
                      !n.read
                        ? "bg-indigo-50/50 dark:bg-indigo-950/20 text-foreground"
                        : "text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    }`}
                  >
                    <div className="font-medium text-foreground flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    </div>
                    <div className="text-muted-foreground text-[11px] mt-0.5 leading-snug">{n.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          className="size-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors border border-border/60"
          title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {dark ? <Sun className="size-4 text-amber-300" /> : <Moon className="size-4 text-indigo-400" />}
        </button>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="h-9 px-3 rounded-xl flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 dark:from-indigo-950/40 dark:to-purple-950/40 dark:hover:from-indigo-950/60 dark:hover:to-purple-950/60 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 transition-all shadow-sm"
          >
            <div className="size-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <span className="text-xs font-semibold hidden sm:inline">{user?.name || "Admin"}</span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-card border border-border/80 shadow-xl z-50 p-1.5 animate-in fade-in-50 zoom-in-95 duration-150">
              <button
                onClick={() => { setShowUserMenu(false); navigate("/"); }}
                className="w-full px-3 py-2 text-xs text-left flex items-center gap-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/40 text-foreground transition-colors"
              >
                <Home className="size-3.5 text-muted-foreground" /> Landing Page
              </button>
              <button
                onClick={async () => { setShowUserMenu(false); await signOut(); navigate("/"); }}
                className="w-full px-3 py-2 text-xs text-left flex items-center gap-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 transition-colors mt-0.5"
              >
                <LogOut className="size-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
