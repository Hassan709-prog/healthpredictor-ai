import { AlertTriangle, Stethoscope, ShieldCheck, Lightbulb, Download, UserPlus, MapPin, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { api, type Prediction, type Specialist, type SymptomDetail } from "@/lib/api";
import { useEffect, useState, useRef } from "react";

interface PredictionResultCardProps {
  prediction: Prediction;
  onReset: () => void;
}

export function PredictionResultCard({ prediction, onReset }: PredictionResultCardProps) {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.specialist.getForDisease(prediction.disease).then(setSpecialists).catch(console.error);
  }, [prediction.disease]);

  const handleDownloadPdf = () => {
    // We will use native window.print() to generate the PDF reliably
    // We'll apply print-specific CSS so only the card is printed
    window.print();
  };

  const confidencePct = prediction.confidence != null ? Math.round(prediction.confidence * 100) : null;
  const risk = confidencePct != null
    ? confidencePct >= 80 ? "High" : confidencePct >= 60 ? "Moderate" : "Low"
    : "Unknown";

  const recommendationLines = prediction.recommendations
    .split(/\.\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  let parsedSymptoms: any[] = [];
  try {
    parsedSymptoms = prediction.severity_log ? JSON.parse(prediction.severity_log) : JSON.parse(prediction.symptoms);
  } catch (e) {
    parsedSymptoms = [];
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Container for PDF Generation */}
      <div ref={pdfRef} className="space-y-6 bg-background">
        
        {/* Hero card */}
        <div className="bg-gradient-hero text-primary-foreground rounded-2xl p-8 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-3">
                <Stethoscope className="h-3.5 w-3.5" /> AI Prediction
              </div>
              <h2 className="text-4xl font-bold">{prediction.disease}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {parsedSymptoms.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-xs font-medium border border-white/10">
                    {typeof s === "string" ? s : `${s.name} (${s.severity}, ${s.duration})`}
                  </span>
                ))}
              </div>
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
              While this prediction suggests you may have {prediction.disease}, please consult a licensed physician
              immediately if your symptoms persist, worsen suddenly, or you experience difficulty breathing, severe pain, or persistent high fever.
            </p>
            <div className="mt-4 p-3 rounded-lg bg-muted text-xs text-muted-foreground border border-border">
              <strong>Disclaimer:</strong> HealthPredictor is for informational purposes only and is not a substitute for professional medical advice.
            </div>
          </div>
        </div>


      </div>

      <div className="flex gap-3 justify-end border-t border-border pt-4 print:hidden">
        <Button variant="outline" onClick={handleDownloadPdf}>
          <Download className="h-4 w-4 mr-2" /> Download PDF
        </Button>
        <Button variant="outline" asChild><Link to="/dashboard/history">View History</Link></Button>
        <Button onClick={onReset}>New Prediction</Button>
      </div>
    </div>
  );
}
