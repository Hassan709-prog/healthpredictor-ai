import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { diseases } from "@/lib/data";

export const Route = createFileRoute("/admin/diseases")({
  head: () => ({ meta: [{ title: "Manage Diseases — Admin" }] }),
  component: ManageDiseases,
});

const severityTone = {
  Low: "bg-success/10 text-success",
  Moderate: "bg-warning/15 text-warning-foreground",
  High: "bg-destructive/10 text-destructive",
} as const;

function ManageDiseases() {
  return (
    <AdminLayout title="Manage Diseases" breadcrumb={["Admin", "Diseases"]}>
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 flex flex-wrap gap-3 items-center justify-between border-b border-border">
          <h2 className="font-semibold">Disease Library</h2>
          <div className="flex gap-3 items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9" />
            </div>
            <Button><Plus className="h-4 w-4" /> Add Disease</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Disease Name</th>
                <th className="text-left px-6 py-3 font-medium">Severity</th>
                <th className="text-left px-6 py-3 font-medium">Description</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {diseases.map((d) => (
                <tr key={d.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium">{d.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${severityTone[d.severity as keyof typeof severityTone]}`}>
                      {d.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground max-w-md">{d.description}</td>
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
