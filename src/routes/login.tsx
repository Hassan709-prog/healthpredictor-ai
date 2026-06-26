import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — HealthPredictor" }, { name: "description", content: "Sign in to your HealthPredictor account." }] }),
  component: LoginPage,
});

function LoginPage() {
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

          <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Field label="Email" icon={Mail}><Input type="email" placeholder="you@example.com" /></Field>
            <Field label="Password" icon={Lock}><Input type="password" placeholder="••••••••" /></Field>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox id="remember" /> <span>Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
            </div>

            <Button asChild className="w-full" size="lg"><Link to="/dashboard">Sign In</Link></Button>

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
