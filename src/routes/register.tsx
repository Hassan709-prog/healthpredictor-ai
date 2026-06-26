import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register — HealthPredictor" }, { name: "description", content: "Create your free HealthPredictor account." }] }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-hero text-primary-foreground">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Activity className="h-6 w-6" /> HealthPredictor
        </Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight">Start your health journey.</h2>
          <p className="mt-4 opacity-90 max-w-md">Join 50,000+ users using AI to gain proactive insights into their health.</p>
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

          <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Field label="Full Name" icon={User}><Input placeholder="Jane Doe" /></Field>
            <Field label="Email" icon={Mail}><Input type="email" placeholder="you@example.com" /></Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Password" icon={Lock}><Input type="password" placeholder="••••••••" /></Field>
              <Field label="Confirm Password" icon={Lock}><Input type="password" placeholder="••••••••" /></Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">Gender</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Age</Label>
                <Input type="number" placeholder="30" />
              </div>
            </div>

            <Button asChild className="w-full" size="lg"><Link to="/dashboard">Create Account</Link></Button>

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
