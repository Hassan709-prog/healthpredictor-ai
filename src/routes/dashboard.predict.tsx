import { createFileRoute, Link } from "@tanstack/react-router";
import { UserLayout } from "@/components/layouts/UserLayout";
import { Search, Plus, X, Stethoscope } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { symptomsList } from "@/lib/data";

export const Route = createFileRoute("/dashboard/predict")({
  head: () => ({ meta: [{ title: "Predict Disease — HealthPredictor" }] }),
  component: PredictPage,
});

function PredictPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(["Fever", "Cough"]);

  const filtered = symptomsList.filter(
    (s) => s.toLowerCase().includes(query.toLowerCase()) && !selected.includes(s),
  );

  const toggle = (s: string) =>
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <UserLayout title="AI Disease Prediction" breadcrumb={["Dashboard", "Predict Disease"]}>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <h2 className="font-semibold flex items-center gap-2"><Stethoscope className="h-5 w-5 text-primary" /> Search Symptoms</h2>
            <p className="text-sm text-muted-foreground mt-1">Type to search and click to add.</p>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search symptoms..." className="pl-9" />
            </div>

            <div className="mt-5 flex flex-wrap gap-2 max-h-72 overflow-y-auto">
              {filtered.length === 0 && (
                <div className="text-sm text-muted-foreground py-8 text-center w-full">No matching symptoms.</div>
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
              <div className="mt-4 flex flex-wrap gap-2">
                {selected.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm">
                    {s}
                    <button onClick={() => toggle(s)} className="hover:opacity-70"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}

            <Button asChild className="mt-6 w-full" size="lg" disabled={selected.length === 0}>
              <Link to="/dashboard/predict/result">Predict Disease</Link>
            </Button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
