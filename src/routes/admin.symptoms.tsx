import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { symptomsList } from "@/lib/data";

export const Route = createFileRoute("/admin/symptoms")({
  head: () => ({ meta: [{ title: "Manage Symptoms — Admin" }] }),
  component: ManageSymptoms,
});

function ManageSymptoms() {
  return (
    <AdminLayout title="Manage Symptoms" breadcrumb={["Admin", "Symptoms"]}>
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 flex flex-wrap gap-3 items-center justify-between border-b border-border">
          <h2 className="font-semibold">Symptom Catalog · {symptomsList.length}</h2>
          <div className="flex gap-3 items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search symptoms..." className="pl-9" />
            </div>
            <Button><Plus className="h-4 w-4" /> Add Symptom</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium w-20">#</th>
                <th className="text-left px-6 py-3 font-medium">Symptom</th>
                <th className="text-left px-6 py-3 font-medium">Category</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {symptomsList.map((s, i) => (
                <tr key={s} className="border-t border-border hover:bg-muted/30">
                  <td className="px-6 py-4 text-muted-foreground">{String(i + 1).padStart(3, "0")}</td>
                  <td className="px-6 py-4 font-medium">{s}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {["Respiratory", "Neurological", "Digestive", "General"][i % 4]}
                    </span>
                  </td>
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
