import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Users, Pill, ListChecks, FileBarChart, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { api, type AdminStats } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — HealthPredictor" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    api.admin.stats().then(setStats).catch(() => {});
  }, []);

  return (
    <AdminLayout title="Admin Dashboard" breadcrumb={["Admin", "Dashboard"]}>
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <Stat icon={Users} label="Total Users" value={stats ? String(stats.total_users) : "…"} trend={stats ? `${stats.active_users} active` : ""} />
        <Stat icon={Users} label="Suspended" value={stats ? String(stats.suspended_users) : "…"} trend="accounts" />
        <Stat icon={Pill} label="Total Diseases" value={stats ? String(stats.total_diseases) : "…"} trend="in database" />
        <Stat icon={ListChecks} label="Total Symptoms" value={stats ? String(stats.total_symptoms) : "…"} trend="in database" />
        <Stat icon={FileBarChart} label="Total Predictions" value={stats ? String(stats.total_predictions) : "…"} trend="all time" />
      </div>

      <div className="mt-6 bg-card rounded-2xl border border-border p-6 shadow-soft">
        <h2 className="font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> System Overview</h2>
        <p className="text-sm text-muted-foreground mt-3">
          Use the navigation to manage users, predictions, symptoms, and diseases. All data is live from Supabase.
        </p>
      </div>
    </AdminLayout>
  );
}

function Stat({ icon: Icon, label, value, trend }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; trend: string }) {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-soft">
      <div className="inline-flex h-10 w-10 rounded-xl items-center justify-center bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs text-success font-semibold mt-1">{trend}</div>
    </div>
  );
}
