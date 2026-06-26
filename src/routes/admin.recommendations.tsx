import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recommendations } from "@/lib/data";

export const Route = createFileRoute("/admin/recommendations")({
  head: () => ({ meta: [{ title: "Manage Recommendations — Admin" }] }),
  component: ManageRecommendations,
});

function ManageRecommendations() {
  return (
    <AdminLayout title="Manage Recommendations" breadcrumb={["Admin", "Recommendations"]}>
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 flex flex-wrap gap-3 items-center justify-between border-b border-border">
          <h2 className="font-semibold">Health Recommendations</h2>
          <Button><Plus className="h-4 w-4" /> Add Recommendation</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Disease</th>
                <th className="text-left px-6 py-3 font-medium">Recommendation</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/30 align-top">
                  <td className="px-6 py-4 font-medium whitespace-nowrap">{r.disease}</td>
                  <td className="px-6 py-4 text-muted-foreground max-w-2xl">{r.recommendation}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
