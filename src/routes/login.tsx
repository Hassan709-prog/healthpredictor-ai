import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Activity, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — HealthPredictor" }, { name: "description", content: "Sign in to your HealthPredictor account." }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-hero text-primary-foreground">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Activity className="h-6 w-6" /> HealthPredictor
        </Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight">Welcome back.</h2>
          <p className="mt-4 opacity-90 max-w-md">Sign in to access your personalized health insights, prediction history, and AI-powered recommendations.</p>
        </div>
        <div className="text-xs opacity-70">© 2026 HealthPredictor</div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8 font-bold">
            <Activity className="h-5 w-5 text-primary" /> HealthPredictor
          </Link>
          <h1 className="text-3xl font-bold">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your credentials to access your dashboard.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <Field label="Email" icon={Mail}>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field label="Password" icon={Lock}>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : "Sign In"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
        <div className={Icon ? "[&_input]:pl-9" : ""}>{children}</div>
      </div>
    </div>
  );
}
