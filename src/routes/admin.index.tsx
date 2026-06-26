import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Users, Pill, ListChecks, FileBarChart, TrendingUp, Activity } from "lucide-react";
import { monthlyStats } from "@/lib/data";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — HealthPredictor" }] }),
  component: AdminDashboard,
});

const activities = [
  { who: "Sarah Johnson", what: "completed a prediction", when: "5 min ago" },
  { who: "Admin", what: "added a new disease: Hypothyroidism", when: "1 hour ago" },
  { who: "Michael Chen", what: "registered an account", when: "3 hours ago" },
  { who: "Aisha Patel", what: "updated profile", when: "5 hours ago" },
  { who: "System", what: "model retrained successfully", when: "1 day ago" },
];

function AdminDashboard() {
  const max = Math.max(...monthlyStats.map((m) => m.predictions));

  return (
    <AdminLayout title="Admin Dashboard" breadcrumb={["Admin", "Dashboard"]}>
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <Stat icon={Users} label="Total Users" value="2,481" trend="+12%" />
        <Stat icon={Pill} label="Total Diseases" value="218" trend="+4 new" />
        <Stat icon={ListChecks} label="Total Symptoms" value="425" trend="Stable" />
        <Stat icon={FileBarChart} label="Total Predictions" value="14,820" trend="+8% MoM" />
        <Stat icon={TrendingUp} label="Avg Accuracy" value="92.4%" trend="+0.6%" />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold">Predictions Over Time</h2>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Predictions</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> New Users</span>
            </div>
          </div>

          <div className="flex items-end gap-3 h-56">
            {monthlyStats.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end gap-1 h-48">
                  <div className="flex-1 bg-primary rounded-t-md transition-all" style={{ height: `${(m.predictions / max) * 100}%` }} />
                  <div className="flex-1 bg-success rounded-t-md transition-all" style={{ height: `${(m.users / max) * 100}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
          <h2 className="font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Recent Activities</h2>
          <div className="mt-5 space-y-4">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-semibold shrink-0">
                  {a.who.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm"><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span></div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.when}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
