import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Stethoscope, History, User, LogOut, Bell, Menu, Activity, FileText
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { ModeToggle } from "@/components/mode-toggle";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/predict", label: "Predict Disease", icon: Stethoscope },
  { to: "/dashboard/history", label: "Prediction History", icon: History },
  { to: "/dashboard/reports", label: "My Reports", icon: FileText },
  { to: "/dashboard/journal", label: "Health Journal", icon: Activity },
  { to: "/dashboard/profile", label: "My Profile", icon: User },
] as const;

export function UserLayout({ children, title, breadcrumb }: { children: ReactNode; title: string; breadcrumb?: string[] }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const initials = user?.name
    ? user.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static z-40 inset-y-0 left-0 w-72 bg-sidebar border-r border-sidebar-border transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-16 flex items-center gap-2 px-6 border-b border-sidebar-border">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
            <Activity className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-sidebar-foreground">HealthPredictor</span>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map((item) => {
            const active = path === item.to || (item.to !== "/dashboard" && path.startsWith(item.to));
            const exact = item.to === "/dashboard" ? path === "/dashboard" : active;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  exact
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent mt-6"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </nav>
      </aside>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center px-4 md:px-8 gap-4 sticky top-0 z-20">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 -ml-2 rounded-md hover:bg-muted">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold truncate">{title}</h1>
            {breadcrumb && (
              <p className="text-xs text-muted-foreground truncate">
                {breadcrumb.join(" / ")}
              </p>
            )}
          </div>
          <button className="relative p-2 rounded-full hover:bg-muted">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <ModeToggle />
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium">{user?.name ?? "User"}</div>
              <div className="text-xs text-muted-foreground capitalize">{user?.role ?? "patient"}</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-hero text-primary-foreground grid place-items-center font-semibold">
              {initials}
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
