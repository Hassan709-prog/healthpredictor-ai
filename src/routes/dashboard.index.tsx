import { createFileRoute, Link } from "@tanstack/react-router";
import { UserLayout } from "@/components/layouts/UserLayout";
import { Activity, TrendingUp, Stethoscope, HeartPulse, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recentPredictions } from "@/lib/data";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — HealthPredictor" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <UserLayout title="Dashboard" breadcrumb={["Home", "Dashboard"]}>
      <div className="grid gap-6">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={Activity} label="Total Predictions" value="24" trend="+3 this week" tone="primary" />
          <StatCard icon={Stethoscope} label="Last Prediction" value="Influenza" trend="2 days ago" tone="success" />
          <StatCard icon={TrendingUp} label="Prediction Accuracy" value="92%" trend="+2% vs last month" tone="warning" />
          <StatCard icon={HeartPulse} label="Health Status" value="Good" trend="Stable" tone="success" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-border">
              <div>
                <h2 className="font-semibold">Recent Predictions</h2>
                <p className="text-xs text-muted-foreground">Your latest AI analyses</p>
              </div>
              <Button asChild variant="ghost" size="sm"><Link to="/dashboard/history">View all <ArrowRight className="h-3 w-3" /></Link></Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Date</th>
                    <th className="text-left px-6 py-3 font-medium">Symptoms</th>
                    <th className="text-left px-6 py-3 font-medium">Disease</th>
                    <th className="text-left px-6 py-3 font-medium">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPredictions.slice(0, 4).map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="px-6 py-4">{p.date}</td>
                      <td className="px-6 py-4 text-muted-foreground">{p.symptoms.join(", ")}</td>
                      <td className="px-6 py-4 font-medium">{p.disease}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold">
                          {p.confidence}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-hero text-primary-foreground p-6 rounded-2xl shadow-soft">
              <Sparkles className="h-6 w-6 mb-3" />
              <h3 className="font-semibold text-lg">Quick Predict</h3>
              <p className="text-sm opacity-90 mt-1">Start a new symptom analysis in seconds.</p>
              <Button asChild variant="secondary" className="mt-4 w-full"><Link to="/dashboard/predict">Predict Now</Link></Button>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-2 text-success font-semibold">
                <HeartPulse className="h-5 w-5" /> Health Tip
              </div>
              <h3 className="font-semibold mt-3">Stay Hydrated</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Drinking 8 glasses of water daily improves circulation, supports immune function, and reduces headaches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

function StatCard({ icon: Icon, label, value, trend, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; trend: string; tone: "primary" | "success" | "warning" }) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
  };
  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-soft">
      <div className={`inline-flex h-10 w-10 rounded-xl items-center justify-center ${toneMap[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{trend}</div>
    </div>
  );
}
