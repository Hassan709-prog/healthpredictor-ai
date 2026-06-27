import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Search, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { api, type Disease } from "@/lib/api";

export const Route = createFileRoute("/admin/diseases")({
  head: () => ({ meta: [{ title: "Manage Diseases — Admin" }] }),
  component: ManageDiseases,
});

function ManageDiseases() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const load = async () => {
    setIsLoading(true);
    try { setDiseases(await api.admin.diseases()); } catch { /* ignore */ }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const d = await api.admin.createDisease(newName.trim(), newDesc.trim() || undefined);
      setDiseases((prev) => [...prev, d].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName(""); setNewDesc("");
    } catch (err) { alert(err instanceof Error ? err.message : "Failed to create."); }
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const updated = await api.admin.updateDisease(id, { name: editName.trim(), description: editDesc.trim() || undefined });
      setDiseases((prev) => prev.map((x) => (x.id === id ? updated : x)));
      setEditId(null);
    } catch (err) { alert(err instanceof Error ? err.message : "Failed to update."); }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.admin.deleteDisease(id);
      setDiseases((prev) => prev.filter((x) => x.id !== id));
    } catch (err) { alert(err instanceof Error ? err.message : "Failed to delete."); }
  };

  const filtered = diseases.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AdminLayout title="Manage Diseases" breadcrumb={["Admin", "Diseases"]}>
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 flex flex-wrap gap-3 items-center justify-between border-b border-border">
          <h2 className="font-semibold">Disease Library · {filtered.length}</h2>
          <div className="flex gap-3 items-center flex-wrap">
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Input placeholder="Disease name" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-36" />
            <Input placeholder="Description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-48" />
            <Button onClick={handleCreate} disabled={!newName.trim()}><Plus className="h-4 w-4" /> Add</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Disease Name</th>
                <th className="text-left px-6 py-3 font-medium">Description</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">Loading…</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">No diseases found.</td></tr>}
              {filtered.map((d) => (
                <tr key={d.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium">
                    {editId === d.id
                      ? <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 w-44" />
                      : d.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground max-w-md">
                    {editId === d.id
                      ? <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="h-8 w-full" />
                      : (d.description ?? "—")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      {editId === d.id ? (
                        <>
                          <Button variant="ghost" size="icon" className="text-success" onClick={() => handleSaveEdit(d.id)}><Check className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => { setEditId(d.id); setEditName(d.name); setEditDesc(d.description ?? ""); }}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(d.id)}><Trash2 className="h-4 w-4" /></Button>
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
