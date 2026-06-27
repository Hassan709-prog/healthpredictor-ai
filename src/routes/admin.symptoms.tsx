import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Search, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { api, type Symptom } from "@/lib/api";

export const Route = createFileRoute("/admin/symptoms")({
  head: () => ({ meta: [{ title: "Manage Symptoms — Admin" }] }),
  component: ManageSymptoms,
});

function ManageSymptoms() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const load = async () => {
    setIsLoading(true);
    try { setSymptoms(await api.admin.symptoms()); } catch { /* ignore */ }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const s = await api.admin.createSymptom(newName.trim());
      setSymptoms((prev) => [...prev, s].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
    } catch (err) { alert(err instanceof Error ? err.message : "Failed to create."); }
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const updated = await api.admin.updateSymptom(id, editName.trim());
      setSymptoms((prev) => prev.map((x) => (x.id === id ? updated : x)));
      setEditId(null);
    } catch (err) { alert(err instanceof Error ? err.message : "Failed to update."); }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.admin.deleteSymptom(id);
      setSymptoms((prev) => prev.filter((x) => x.id !== id));
    } catch (err) { alert(err instanceof Error ? err.message : "Failed to delete."); }
  };

  const filtered = symptoms.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AdminLayout title="Manage Symptoms" breadcrumb={["Admin", "Symptoms"]}>
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 flex flex-wrap gap-3 items-center justify-between border-b border-border">
          <h2 className="font-semibold">Symptom Catalog · {filtered.length}</h2>
          <div className="flex gap-3 items-center flex-wrap">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search symptoms..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Input placeholder="New symptom name" value={newName} onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }} className="w-48" />
              <Button onClick={handleCreate} disabled={!newName.trim()}><Plus className="h-4 w-4" /> Add</Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium w-20">#</th>
                <th className="text-left px-6 py-3 font-medium">Symptom</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">Loading…</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">No symptoms found.</td></tr>}
              {filtered.map((s, i) => (
                <tr key={s.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-6 py-4 text-muted-foreground">{String(i + 1).padStart(3, "0")}</td>
                  <td className="px-6 py-4 font-medium">
                    {editId === s.id ? (
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 w-48"
                        onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(s.id); if (e.key === "Escape") setEditId(null); }} />
                    ) : s.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      {editId === s.id ? (
                        <>
                          <Button variant="ghost" size="icon" className="text-success" onClick={() => handleSaveEdit(s.id)}><Check className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => { setEditId(s.id); setEditName(s.name); }}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
                        </>
                      )}
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
