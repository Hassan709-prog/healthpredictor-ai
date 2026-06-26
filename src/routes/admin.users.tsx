import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { users } from "@/lib/data";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Manage Users — Admin" }] }),
  component: ManageUsers,
});

function ManageUsers() {
  return (
    <AdminLayout title="Manage Users" breadcrumb={["Admin", "Users"]}>
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 flex flex-wrap gap-3 items-center justify-between border-b border-border">
          <div>
            <h2 className="font-semibold">All Users</h2>
            <p className="text-xs text-muted-foreground">{users.length} registered users</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-9" />
            </div>
            <Button><Plus className="h-4 w-4" /> Add User</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">User</th>
                <th className="text-left px-6 py-3 font-medium">Email</th>
                <th className="text-left px-6 py-3 font-medium">Age</th>
                <th className="text-left px-6 py-3 font-medium">Gender</th>
                <th className="text-left px-6 py-3 font-medium">Joined</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-hero text-primary-foreground grid place-items-center text-xs font-semibold">
                        {u.name.split(" ").map((s) => s[0]).join("")}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                  <td className="px-6 py-4">{u.age}</td>
                  <td className="px-6 py-4 text-muted-foreground">{u.gender}</td>
                  <td className="px-6 py-4 text-muted-foreground">{u.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${u.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {u.status}
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

        <div className="p-4 flex items-center justify-between border-t border-border">
          <div className="text-xs text-muted-foreground">Showing 1-{users.length} of {users.length}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><ChevronLeft className="h-4 w-4" /> Prev</Button>
            <Button variant="outline" size="sm">Next <ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
