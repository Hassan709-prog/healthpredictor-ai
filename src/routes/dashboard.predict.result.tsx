import { createFileRoute, Link } from "@tanstack/react-router";
import { UserLayout } from "@/components/layouts/UserLayout";
import { AlertTriangle, Save, Stethoscope, ShieldCheck, Lightbulb, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/predict/result")({
  head: () => ({ meta: [{ title: "Prediction Result — HealthPredictor" }] }),
  component: ResultPage,
});

const topPredictions = [
  { name: "Influenza", confidence: 92, risk: "Moderate" },
  { name: "COVID-19", confidence: 71, risk: "High" },
  { name: "Common Cold", confidence: 58, risk: "Low" },
];

function ResultPage() {
  const top = topPredictions[0];

  return (
    <UserLayout title="Prediction Result" breadcrumb={["Dashboard", "Predict", "Result"]}>
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm"><Link to="/dashboard/predict"><ArrowLeft className="h-3 w-3" /> Back</Link></Button>

        <div className="bg-gradient-hero text-primary-foreground rounded-2xl p-8 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-3">
                <Stethoscope className="h-3.5 w-3.5" /> AI Prediction
              </div>
              <h2 className="text-4xl font-bold">{top.name}</h2>
              <p className="mt-2 opacity-90">Based on the 2 symptoms you provided.</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{top.confidence}%</div>
              <div className="text-xs opacity-90 mt-1">Confidence Score</div>
              <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-warning text-warning-foreground text-xs font-semibold">
                <AlertTriangle className="h-3 w-3 mr-1" /> Risk: {top.risk}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <h3 className="font-semibold">Top 3 Predictions</h3>
            <div className="mt-4 space-y-4">
              {topPredictions.map((p, i) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium">{i + 1}. {p.name}</span>
                    <span className="text-muted-foreground">{p.confidence}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-hero rounded-full" style={{ width: `${p.confidence}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-soft">
            <h3 className="font-semibold">About {top.name}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Influenza, commonly known as the flu, is a contagious viral infection that attacks the respiratory system — nose, throat, and lungs. Most people recover within a week without medical attention.
            </p>

            <Section title="Common Symptoms" items={["High fever (38°C+)", "Dry cough", "Sore throat", "Body aches", "Fatigue"]} />
            <Section title="Causes" items={["Influenza A, B, or C viruses", "Airborne droplets from infected persons", "Contact with contaminated surfaces"]} />
            <Section title="Prevention" items={["Annual flu vaccination", "Frequent hand washing", "Avoid close contact with sick people", "Cover mouth when coughing"]} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="h-5 w-5 text-success" /> Health Recommendations</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {["Rest and stay hydrated", "Take paracetamol for fever", "Use a humidifier", "Eat warm broths and light meals", "Monitor temperature daily"].map((r) => (
                <li key={r} className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-success mt-2" /> {r}</li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <h3 className="font-semibold flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Doctor's Advice</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              While this prediction has high confidence, please consult a licensed physician if symptoms persist beyond 7 days, worsen suddenly, or you experience difficulty breathing, chest pain, or persistent high fever.
            </p>
            <div className="mt-4 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> HealthPredictor is for informational purposes only and is not a substitute for professional medical advice.
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" asChild><Link to="/dashboard/history">View History</Link></Button>
          <Button><Save className="h-4 w-4" /> Save Result</Button>
        </div>
      </div>
    </UserLayout>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5">
      <h4 className="font-medium text-sm">{title}</h4>
      <ul className="mt-2 grid sm:grid-cols-2 gap-1.5 text-sm text-muted-foreground">
        {items.map((i) => <li key={i} className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" /> {i}</li>)}
      </ul>
    </div>
  );
}
