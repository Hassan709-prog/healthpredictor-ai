import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { api, type Prediction } from "@/lib/api";

export const Route = createFileRoute("/admin/predictions")({
  head: () => ({ meta: [{ title: "Prediction Records — Admin" }] }),
  component: PredictionRecords,
});

function PredictionRecords() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try { setPredictions(await api.admin.predictions()); } catch { /* ignore */ }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.admin.deletePrediction(id);
      setPredictions((prev) => prev.filter((x) => x.id !== id));
    } catch (err) { alert(err instanceof Error ? err.message : "Delete failed."); }
  };

  const filtered = predictions.filter(
    (p) =>
      p.disease.toLowerCase().includes(query.toLowerCase()) ||
      p.symptoms.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AdminLayout title="Prediction Records" breadcrumb={["Admin", "Predictions"]}>
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 flex flex-wrap gap-3 items-center justify-between border-b border-border">
          <h2 className="font-semibold">All Prediction Records · {filtered.length}</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by disease or symptom..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">ID</th>
                <th className="text-left px-6 py-3 font-medium">User ID</th>
                <th className="text-left px-6 py-3 font-medium">Symptoms</th>
                <th className="text-left px-6 py-3 font-medium">Disease</th>
                <th className="text-left px-6 py-3 font-medium">Confidence</th>
                <th className="text-left px-6 py-3 font-medium">Date</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">Loading…</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">No predictions found.</td></tr>}
              {filtered.map((p) => {
                const syms: string[] = JSON.parse(p.symptoms);
                const conf = p.confidence != null ? Math.round(p.confidence * 100) : null;
                return (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">#{p.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">U-{p.user_id}</td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{syms.join(", ")}</td>
                    <td className="px-6 py-4 font-medium">{p.disease}</td>
                    <td className="px-6 py-4">
                      {conf != null
                        ? <span className="inline-flex px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold">{conf}%</span>
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
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
    </AdminLayout>
  );
}
