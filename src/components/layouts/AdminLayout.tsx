import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Pill, ListChecks, Lightbulb, FileBarChart, LogOut,
  Bell, Menu, ShieldCheck,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Manage Users", icon: Users },
  { to: "/admin/diseases", label: "Manage Diseases", icon: Pill },
  { to: "/admin/symptoms", label: "Manage Symptoms", icon: ListChecks },
  { to: "/admin/recommendations", label: "Manage Recommendations", icon: Lightbulb },
  { to: "/admin/predictions", label: "Prediction Records", icon: FileBarChart },
] as const;

export function AdminLayout({ children, title, breadcrumb }: { children: ReactNode; title: string; breadcrumb?: string[] }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex bg-background">
      <aside
        className={cn(
          "fixed lg:static z-40 inset-y-0 left-0 w-72 bg-sidebar border-r border-sidebar-border transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-16 flex items-center gap-2 px-6 border-b border-sidebar-border">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-sidebar-foreground leading-none">HealthPredictor</div>
            <div className="text-[10px] tracking-widest text-muted-foreground mt-0.5">ADMIN CONSOLE</div>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/admin/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent mt-6"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Link>
        </nav>
      </aside>

      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center px-4 md:px-8 gap-4 sticky top-0 z-20">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 -ml-2 rounded-md hover:bg-muted">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold truncate">{title}</h1>
            {breadcrumb && (
              <p className="text-xs text-muted-foreground truncate">{breadcrumb.join(" / ")}</p>
            )}
          </div>
          <button className="relative p-2 rounded-full hover:bg-muted">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium">Dr. Admin</div>
              <div className="text-xs text-muted-foreground">Administrator</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-foreground text-background grid place-items-center font-semibold">
              DA
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
