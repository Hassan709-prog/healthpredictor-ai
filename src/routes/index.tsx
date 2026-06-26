import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity, Brain, Stethoscope, ShieldCheck, Sparkles, ClipboardList,
  HeartPulse, Microscope, Star, ChevronDown, Twitter, Facebook, Linkedin,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-illustration.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HealthPredictor — AI-Powered Disease Prediction" },
      { name: "description", content: "Predict diseases from symptoms with AI. Get instant health insights and personalized recommendations." },
      { property: "og:title", content: "HealthPredictor — AI Healthcare" },
      { property: "og:description", content: "AI-powered symptom checker and health insights." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <HowItWorks />
      <Features />
      <Benefits />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
            <Activity className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg">HealthPredictor</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#about" className="hover:text-foreground">About</a>
          <a href="#how" className="hover:text-foreground">How it Works</a>
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost"><Link to="/login">Login</Link></Button>
          <Button asChild><Link to="/register">Register</Link></Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-success/5" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered Healthcare
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Predict diseases <span className="bg-gradient-hero bg-clip-text text-transparent">before they progress</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            HealthPredictor uses advanced AI to analyze your symptoms, deliver accurate disease predictions, and personalized health recommendations — in seconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/register">Get Started Free</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/login">Sign In</Link></Button>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            <Stat value="50K+" label="Active Users" />
            <Stat value="95%" label="Accuracy" />
            <Stat value="200+" label="Diseases" />
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-3xl rounded-3xl" />
          <img src={heroImg} alt="AI healthcare dashboard" className="relative rounded-3xl shadow-soft w-full" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="py-20 max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold">About HealthPredictor</h2>
        <p className="mt-4 text-muted-foreground">
          We're on a mission to democratize early disease detection through AI. Built with care by clinicians and ML researchers, HealthPredictor empowers individuals to make informed decisions about their health.
        </p>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: ClipboardList, title: "Select Symptoms", desc: "Pick your symptoms from our smart, searchable list." },
    { icon: Brain, title: "AI Analyzes", desc: "Our model processes symptoms against thousands of conditions." },
    { icon: HeartPulse, title: "Get Insights", desc: "Receive prediction, risk level, and recommendations instantly." },
  ];
  return (
    <section id="how" className="py-20 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center">How It Works</h2>
        <p className="mt-4 text-muted-foreground text-center">Three simple steps to better health insights.</p>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="p-8 rounded-2xl bg-background border border-border shadow-soft relative">
              <div className="absolute -top-4 left-8 h-8 w-8 rounded-full bg-foreground text-background grid place-items-center text-sm font-bold">
                {i + 1}
              </div>
              <s.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Brain, title: "AI Predictions", desc: "State-of-the-art deep learning models trained on medical literature." },
    { icon: Stethoscope, title: "Symptom Checker", desc: "Intuitive multi-select interface with 200+ symptoms." },
    { icon: Microscope, title: "Disease Library", desc: "Comprehensive database of conditions, causes & prevention." },
    { icon: ShieldCheck, title: "Privacy First", desc: "Your health data is encrypted and never shared." },
    { icon: HeartPulse, title: "Health Tracking", desc: "Track prediction history and monitor wellness over time." },
    { icon: Sparkles, title: "Smart Recommendations", desc: "Personalized advice tailored to your predictions." },
  ];
  return (
    <section id="features" className="py-20 max-w-7xl mx-auto px-4 md:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center">Powerful Features</h2>
      <p className="mt-4 text-muted-foreground text-center">Everything you need for proactive health management.</p>
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((f) => (
          <div key={f.title} className="p-6 rounded-2xl bg-card border border-border hover:shadow-soft transition-shadow">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    "Early disease detection saves lives",
    "Available 24/7 from any device",
    "Reduce unnecessary doctor visits",
    "Track family health in one place",
    "Personalized lifestyle recommendations",
    "Trusted by 50,000+ users worldwide",
  ];
  return (
    <section className="py-20 bg-gradient-hero text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">Why choose HealthPredictor?</h2>
          <p className="mt-4 opacity-90">Healthcare that meets you where you are — accessible, intelligent, and always on your side.</p>
        </div>
        <ul className="space-y-3">
          {items.map((b) => (
            <li key={b} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              <span className="text-sm">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Sarah J.", role: "Patient", text: "Caught my flu early before it got serious. The recommendations were spot on." },
    { name: "Dr. Michael C.", role: "Physician", text: "I recommend HealthPredictor to my patients as a first-line triage tool." },
    { name: "Aisha P.", role: "Nurse", text: "Beautiful interface, accurate predictions. A real game changer." },
  ];
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center">What our users say</h2>
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {items.map((t) => (
          <div key={t.name} className="p-6 rounded-2xl bg-card border border-border shadow-soft">
            <div className="flex gap-1 text-warning mb-3">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-sm text-muted-foreground">"{t.text}"</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-hero text-primary-foreground grid place-items-center font-semibold text-sm">
                {t.name.split(" ").map(s => s[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Is HealthPredictor a replacement for a doctor?", a: "No — HealthPredictor provides AI-driven insights to inform your decisions. Always consult a licensed physician for diagnosis and treatment." },
    { q: "How accurate is the prediction?", a: "Our model achieves up to 95% accuracy on validated datasets, but accuracy depends on the symptoms provided." },
    { q: "Is my data secure?", a: "Yes. All health data is encrypted at rest and in transit. We never sell your information." },
    { q: "Is it free to use?", a: "HealthPredictor offers a free tier with unlimited basic predictions. Pro features are available via subscription." },
  ];
  return (
    <section id="faq" className="py-20 bg-card border-y border-border">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Frequently Asked Questions</h2>
        <div className="mt-12 space-y-3">
          {faqs.map((f) => <FAQItem key={f.q} {...f} />)}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="font-medium">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground">{a}</div>}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background py-14">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg">HealthPredictor</span>
          </div>
          <p className="mt-4 text-sm opacity-70">AI-powered health insights for everyone.</p>
        </div>
        <FooterCol title="Product" links={["Features", "Pricing", "How it Works", "FAQ"]} />
        <FooterCol title="Company" links={["About", "Careers", "Blog", "Contact"]} />
        <div>
          <h4 className="font-semibold mb-4">Follow</h4>
          <div className="flex gap-3">
            <a href="#" className="h-9 w-9 grid place-items-center rounded-full bg-background/10 hover:bg-background/20"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="h-9 w-9 grid place-items-center rounded-full bg-background/10 hover:bg-background/20"><Facebook className="h-4 w-4" /></a>
            <a href="#" className="h-9 w-9 grid place-items-center rounded-full bg-background/10 hover:bg-background/20"><Linkedin className="h-4 w-4" /></a>
          </div>
          <Link to="/admin/login" className="mt-6 inline-block text-xs opacity-60 hover:opacity-100">Admin Login →</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 pt-6 border-t border-background/10 text-xs opacity-60">
        © 2026 HealthPredictor. For informational purposes only — not medical advice.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-semibold mb-4">{title}</h4>
      <ul className="space-y-2 text-sm opacity-70">
        {links.map((l) => <li key={l}><a href="#" className="hover:opacity-100">{l}</a></li>)}
      </ul>
    </div>
  );
}
