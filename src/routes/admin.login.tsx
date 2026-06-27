import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — HealthPredictor" }, { name: "description", content: "Administrator access only." }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      // useAuth updates user; check role after login
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      return;
    }
    // The user state updates after login — redirect will happen via useEffect below
  };

  // Once login resolves and user is set, redirect if admin
  if (user) {
    if (user.role === "admin") {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/dashboard" });
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-foreground p-6">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-soft p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold">HealthPredictor</div>
            <div className="text-[10px] tracking-widest text-muted-foreground">ADMIN CONSOLE</div>
          </div>
        </div>
        <h1 className="text-2xl font-bold">Administrator Sign-in</h1>
        <p className="mt-2 text-sm text-muted-foreground">Restricted access. Authorized personnel only.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label className="mb-1.5 block">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input id="admin-email" type="email" placeholder="admin@healthpredictor.io" className="pl-9"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input id="admin-password" type="password" placeholder="••••••••" className="pl-9"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating…</> : "Access Console"}
          </Button>
          <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-foreground">← Back to website</Link>
        </form>
      </div>
    </div>
  );
}
