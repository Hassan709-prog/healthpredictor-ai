import { createFileRoute } from "@tanstack/react-router";
import { UserLayout } from "@/components/layouts/UserLayout";
import { Search, Plus, X, Stethoscope, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, type Symptom, type Prediction, type SymptomDetail } from "@/lib/api";
import { PredictionResultCard } from "@/components/PredictionResultCard";
import { BodyMap, type BodyPart } from "@/components/BodyMap";

export const Route = createFileRoute("/dashboard/predict")({
  head: () => ({ meta: [{ title: "Predict Disease — HealthPredictor" }] }),
  component: PredictPage,
});

function PredictPage() {
  const [query, setQuery] = useState("");
  const [bodyPart, setBodyPart] = useState<BodyPart>(null);
  const [selected, setSelected] = useState<SymptomDetail[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState("");
  const [predictionResult, setPredictionResult] = useState<Prediction | null>(null);

  // Load symptoms list from API (falls back to empty gracefully)
  useEffect(() => {
    api.predict.symptoms().then(setSymptoms).catch(() => {});
  }, []);

  // Fallback static list if API returns nothing
  const symptomNames = symptoms.length > 0
    ? symptoms.map((s) => s.name)
    : ["Fever", "Headache", "Cough", "Fatigue", "Vomiting", "Nausea", "Sore Throat",
       "Runny Nose", "Shortness of Breath", "Chest Pain", "Dizziness", "Muscle Pain",
       "Joint Pain", "Loss of Taste", "Loss of Smell", "Diarrhea", "Skin Rash",
       "Sneezing", "Chills", "Sweating", "Abdominal Pain", "Back Pain", "Itching",
       "Blurred Vision", "Anxiety", "Increased Thirst", "Frequent Urination",
       "Red Eyes", "Sensitivity to Light", "Stiff Neck"];

  const partFilters: Record<NonNullable<BodyPart>, string[]> = {
    Head: ["head", "dizzi", "vision", "eye", "light", "taste", "smell", "sneez", "nose", "throat", "neck", "migraine", "vertigo", "fever", "chill"],
    Chest: ["cough", "breath", "chest", "heart", "asthma", "pneumonia", "sweat"],
    Abdomen: ["vomit", "nausea", "diarrhea", "abdomin", "stomach", "ulcer", "gastro", "urin", "thirst"],
    Arms: ["muscle", "joint", "rash", "itch", "arm", "hand"],
    Legs: ["muscle", "joint", "rash", "itch", "leg", "foot", "vein"]
  };

  const filtered = symptomNames.filter((s) => {
    const isSelected = selected.some((x) => x.name === s);
    if (isSelected) return false;
    
    const matchesQuery = s.toLowerCase().includes(query.toLowerCase());
    
    if (bodyPart) {
      const keywords = partFilters[bodyPart];
      const matchesPart = keywords.some(kw => s.toLowerCase().includes(kw));
      return matchesQuery && matchesPart;
    }
    
    return matchesQuery;
  });

  const toggle = (name: string) => {
    if (selected.some((x) => x.name === name)) {
      setSelected((prev) => prev.filter((x) => x.name !== name));
    } else {
      setSelected((prev) => [...prev, { name, severity: "Moderate", duration: "1 day" }]);
    }
  };

  const updateDetail = (name: string, field: keyof SymptomDetail, value: string) => {
    setSelected((prev) => prev.map((s) => s.name === name ? { ...s, [field]: value } : s));
  };

  const handlePredict = async () => {
    if (selected.length === 0) return;
    setError("");
    setIsPredicting(true);
    try {
      const result = await api.predict.run(
        selected.map(s => s.name),
        selected
      );
      setPredictionResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed. Please try again.");
    } finally {
      setIsPredicting(false);
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
    setSelected([]);
  };

  return (
    <UserLayout title="AI Disease Prediction" breadcrumb={["Dashboard", "Predict Disease"]}>
      {predictionResult ? (
        <PredictionResultCard prediction={predictionResult} onReset={handleReset} />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
              <h2 className="font-semibold flex items-center gap-2"><Stethoscope className="h-5 w-5 text-primary" /> Search Symptoms</h2>
              <p className="text-sm text-muted-foreground mt-1">Select a body part or type to search.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="h-[400px]">
                  <BodyMap selectedPart={bodyPart} onSelect={setBodyPart} className="bg-muted/30 rounded-xl" />
                </div>
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search symptoms..." className="pl-9" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-2">
                    {filtered.length === 0 && (
                      <div className="text-sm text-muted-foreground py-8 text-center w-full">
                        {bodyPart ? `No matching symptoms for ${bodyPart}.` : "No matching symptoms."}
                      </div>
                    )}
                    {filtered.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggle(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                      >
                        <Plus className="h-3 w-3" /> {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Selected Symptoms</h2>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{selected.length}</span>
              </div>
              {selected.length === 0 ? (
                <div className="mt-6 py-10 text-center border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground">
                  No symptoms selected yet.
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-3">
                  {selected.map((s) => (
                    <div key={s.name} className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-muted/30">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{s.name}</span>
                        <button onClick={() => toggle(s.name)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                          value={s.severity}
                          onChange={(e) => updateDetail(s.name, "severity", e.target.value)}
                        >
                          <option value="Mild">Mild</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Severe">Severe</option>
                        </select>
                        <select
                          className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                          value={s.duration}
                          onChange={(e) => updateDetail(s.name, "duration", e.target.value)}
                        >
                          <option value="< 1 day">&lt; 1 day</option>
                          <option value="1-3 days">1-3 days</option>
                          <option value="4-7 days">4-7 days</option>
                          <option value="> 1 week">&gt; 1 week</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
                  {error}
                </div>
              )}

              <Button
                onClick={handlePredict}
                className="mt-6 w-full"
                size="lg"
                disabled={selected.length === 0 || isPredicting}
              >
                {isPredicting ? <><Loader2 className="h-4 w-4 animate-spin" /> Analysing…</> : "Predict Disease"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
