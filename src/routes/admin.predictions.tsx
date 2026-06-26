import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminPredictions } from "@/lib/data";

export const Route = createFileRoute("/admin/predictions")({
  head: () => ({ meta: [{ title: "Prediction Records — Admin" }] }),
  component: PredictionRecords,
});

function PredictionRecords() {
  return (
    <AdminLayout title="Prediction Records" breadcrumb={["Admin", "Predictions"]}>
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 flex flex-wrap gap-3 items-center justify-between border-b border-border">
          <h2 className="font-semibold">All Prediction Records</h2>
          <div className="flex gap-3 items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by user or disease..." className="pl-9" />
            </div>
            <Button variant="outline"><Filter className="h-4 w-4" /> Filter</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">ID</th>
                <th className="text-left px-6 py-3 font-medium">User</th>
                <th className="text-left px-6 py-3 font-medium">Symptoms</th>
                <th className="text-left px-6 py-3 font-medium">Disease</th>
                <th className="text-left px-6 py-3 font-medium">Confidence</th>
                <th className="text-left px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {adminPredictions.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{p.id}</td>
                  <td className="px-6 py-4 font-medium">{p.user}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.symptoms.join(", ")}</td>
                  <td className="px-6 py-4">{p.disease}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold">
                      {p.confidence}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
