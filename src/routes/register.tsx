import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Activity, Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register — HealthPredictor" }, { name: "description", content: "Create your free HealthPredictor account." }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    try {
      await register({
        email,
        name,
        password,
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
      });
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-hero text-primary-foreground">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Activity className="h-6 w-6" /> HealthPredictor
        </Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight">Start your health journey.</h2>
          <p className="mt-4 opacity-90 max-w-md">Join thousands of users using AI to gain proactive insights into their health.</p>
        </div>
        <div className="text-xs opacity-70">© 2026 HealthPredictor</div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8 font-bold">
            <Activity className="h-5 w-5 text-primary" /> HealthPredictor
          </Link>
          <h1 className="text-3xl font-bold">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Free forever. No credit card required.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <Field label="Full Name" icon={User}>
              <Input id="reg-name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field label="Email" icon={Mail}>
              <Input id="reg-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Password" icon={Lock}>
                <Input id="reg-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Field>
              <Field label="Confirm Password" icon={Lock}>
                <Input id="reg-confirm" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="reg-gender"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Age</Label>
                <Input id="reg-age" type="number" placeholder="30" value={age} onChange={(e) => setAge(e.target.value)} min={1} max={120} />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</> : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
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
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />}
        <div className={Icon ? "[&_input]:pl-9" : ""}>{children}</div>
      </div>
    </div>
  );
}
