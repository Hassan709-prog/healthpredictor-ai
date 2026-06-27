import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Search, Trash2, ShieldOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { api, type User } from "@/lib/api";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Manage Users — Admin" }] }),
  component: ManageUsers,
});

function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try { setUsers(await api.admin.users()); } catch { /* ignore */ }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const toggleStatus = async (u: User) => {
    const newStatus = u.status === "Active" ? "Suspended" : "Active";
    try {
      const updated = await api.admin.updateUser(u.id, { status: newStatus });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
    } catch { alert("Failed to update status."); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Permanently delete this user and all their predictions?")) return;
    try {
      await api.admin.deleteUser(id);
      setUsers((prev) => prev.filter((x) => x.id !== id));
    } catch (err) { alert(err instanceof Error ? err.message : "Delete failed."); }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AdminLayout title="Manage Users" breadcrumb={["Admin", "Users"]}>
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 flex flex-wrap gap-3 items-center justify-between border-b border-border">
          <div>
            <h2 className="font-semibold">All Users</h2>
            <p className="text-xs text-muted-foreground">{filtered.length} registered users</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">User</th>
                <th className="text-left px-6 py-3 font-medium">Email</th>
                <th className="text-left px-6 py-3 font-medium">Age</th>
                <th className="text-left px-6 py-3 font-medium">Role</th>
                <th className="text-left px-6 py-3 font-medium">Joined</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">Loading…</td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">No users found.</td></tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-hero text-primary-foreground grid place-items-center text-xs font-semibold shrink-0">
                        {u.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                  <td className="px-6 py-4">{u.age ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${u.status === "Active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" title={u.status === "Active" ? "Suspend" : "Activate"} onClick={() => toggleStatus(u)}>
                        {u.status === "Active" ? <ShieldOff className="h-4 w-4 text-warning-foreground" /> : <ShieldCheck className="h-4 w-4 text-success" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(u.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
