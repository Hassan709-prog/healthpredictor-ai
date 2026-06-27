import { createFileRoute, Link } from "@tanstack/react-router";
import { UserLayout } from "@/components/layouts/UserLayout";
import { AlertTriangle, Stethoscope, ShieldCheck, Lightbulb, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { type Prediction } from "@/lib/api";

export const Route = createFileRoute("/dashboard/predict/result")({
  head: () => ({ meta: [{ title: "Prediction Result — HealthPredictor" }] }),
  component: ResultPage,
});

function ResultPage() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("hp_last_prediction");
    if (raw) setPrediction(JSON.parse(raw) as Prediction);
  }, []);

  if (!prediction) {
    return (
      <UserLayout title="Prediction Result" breadcrumb={["Dashboard", "Predict", "Result"]}>
        <div className="text-center py-20 text-muted-foreground">
          <p>No prediction found. Please run a new prediction.</p>
          <Button asChild variant="outline" className="mt-4"><Link to="/dashboard/predict">Go to Predict</Link></Button>
        </div>
      </UserLayout>
    );
  }

  const symptoms: string[] = JSON.parse(prediction.symptoms);
  const confidencePct = prediction.confidence != null ? Math.round(prediction.confidence * 100) : null;

  // Derive risk level from confidence
  const risk = confidencePct != null
    ? confidencePct >= 80 ? "High" : confidencePct >= 60 ? "Moderate" : "Low"
    : "Unknown";

  // Split recommendations into bullet points
  const recommendationLines = prediction.recommendations
    .split(/\.\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <UserLayout title="Prediction Result" breadcrumb={["Dashboard", "Predict", "Result"]}>
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm"><Link to="/dashboard/predict"><ArrowLeft className="h-3 w-3" /> Back</Link></Button>

        {/* Hero card */}
        <div className="bg-gradient-hero text-primary-foreground rounded-2xl p-8 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-3">
                <Stethoscope className="h-3.5 w-3.5" /> AI Prediction
              </div>
              <h2 className="text-4xl font-bold">{prediction.disease}</h2>
              <p className="mt-2 opacity-90">Based on {symptoms.length} symptom{symptoms.length !== 1 ? "s" : ""}: {symptoms.join(", ")}.</p>
            </div>
            {confidencePct != null && (
              <div className="text-right">
                <div className="text-5xl font-bold">{confidencePct}%</div>
                <div className="text-xs opacity-90 mt-1">Confidence Score</div>
                <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-warning text-warning-foreground text-xs font-semibold">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Risk: {risk}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recommendations */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="h-5 w-5 text-success" /> Health Recommendations</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {recommendationLines.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success mt-2 shrink-0" /> {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Doctor advice */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <h3 className="font-semibold flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Doctor's Advice</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              While this prediction has {confidencePct != null ? `${confidencePct}% confidence` : "been made"}, please consult a licensed physician
              if symptoms persist, worsen suddenly, or you experience difficulty breathing, chest pain, or persistent high fever.
            </p>
            <div className="mt-4 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> HealthPredictor is for informational purposes only and is not a substitute for professional medical advice.
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" asChild><Link to="/dashboard/history">View History</Link></Button>
          <Button asChild><Link to="/dashboard/predict">New Prediction</Link></Button>
        </div>
      </div>
    </UserLayout>
  );
}
