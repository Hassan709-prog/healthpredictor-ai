import { createFileRoute } from "@tanstack/react-router";
import { UserLayout } from "@/components/layouts/UserLayout";
import { Search, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recentPredictions } from "@/lib/data";

export const Route = createFileRoute("/dashboard/history")({
  head: () => ({ meta: [{ title: "Prediction History — HealthPredictor" }] }),
  component: HistoryPage,
});

const rows = [
  ...recentPredictions,
  { id: "P-1037", date: "2026-05-29", symptoms: ["Fever", "Sweating", "Chills"], disease: "Influenza", confidence: 88 },
  { id: "P-1036", date: "2026-05-22", symptoms: ["Itching", "Skin Rash"], disease: "Allergic Reaction", confidence: 82 },
  { id: "P-1035", date: "2026-05-15", symptoms: ["Back Pain", "Muscle Pain"], disease: "Muscle Strain", confidence: 76 },
];

function HistoryPage() {
  return (
    <UserLayout title="Prediction History" breadcrumb={["Dashboard", "Prediction History"]}>
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 flex flex-wrap gap-3 items-center justify-between border-b border-border">
          <div>
            <h2 className="font-semibold">All Predictions</h2>
            <p className="text-xs text-muted-foreground">{rows.length} total records</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" />
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
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-6 py-4 whitespace-nowrap">{p.date}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.symptoms.join(", ")}</td>
                  <td className="px-6 py-4 font-medium">{p.disease}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 min-w-32">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-gradient-hero" style={{ width: `${p.confidence}%` }} />
                      </div>
                      <span className="text-xs font-semibold">{p.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex items-center justify-between border-t border-border">
          <div className="text-xs text-muted-foreground">Page 1 of 3</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><ChevronLeft className="h-4 w-4" /> Prev</Button>
            <Button variant="outline" size="sm">Next <ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
