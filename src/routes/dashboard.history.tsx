import { createFileRoute } from "@tanstack/react-router";
import { UserLayout } from "@/components/layouts/UserLayout";
import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { api, type Prediction } from "@/lib/api";

export const Route = createFileRoute("/dashboard/history")({
  head: () => ({ meta: [{ title: "Prediction History — HealthPredictor" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await api.predict.history();
      setPredictions(data);
    } catch {
      // silently fail — user sees empty state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.predict.delete(id);
      setPredictions((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete prediction.");
    }
  };

  const filtered = predictions.filter((p) => {
    const syms: string[] = JSON.parse(p.symptoms);
    return (
      p.disease.toLowerCase().includes(query.toLowerCase()) ||
      syms.some((s) => s.toLowerCase().includes(query.toLowerCase()))
    );
  });

  return (
    <UserLayout title="Prediction History" breadcrumb={["Dashboard", "Prediction History"]}>
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 flex flex-wrap gap-3 items-center justify-between border-b border-border">
          <div>
            <h2 className="font-semibold">All Predictions</h2>
            <p className="text-xs text-muted-foreground">{filtered.length} records</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Date</th>
                <th className="text-left px-6 py-3 font-medium">Symptoms</th>
                <th className="text-left px-6 py-3 font-medium">Predicted Disease</th>
                <th className="text-left px-6 py-3 font-medium">Confidence</th>
                <th className="text-right px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Loading history…</td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No predictions found.</td>
                </tr>
              )}
              {filtered.map((p) => {
                const syms: string[] = JSON.parse(p.symptoms);
                const conf = p.confidence != null ? Math.round(p.confidence * 100) : null;
                const date = new Date(p.created_at).toLocaleDateString();
                return (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-6 py-4 whitespace-nowrap">{date}</td>
                    <td className="px-6 py-4 text-muted-foreground">{syms.join(", ")}</td>
                    <td className="px-6 py-4 font-medium">{p.disease}</td>
                    <td className="px-6 py-4">
                      {conf != null ? (
                        <div className="flex items-center gap-2 min-w-32">
                          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-gradient-hero" style={{ width: `${conf}%` }} />
                          </div>
                          <span className="text-xs font-semibold">{conf}%</span>
                        </div>
                      ) : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </UserLayout>
  );
}
