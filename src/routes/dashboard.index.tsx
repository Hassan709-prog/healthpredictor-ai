import { createFileRoute, Link } from "@tanstack/react-router";
import { UserLayout } from "@/components/layouts/UserLayout";
import { Activity, TrendingUp, Stethoscope, HeartPulse, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api, type Prediction } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — HealthPredictor" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    api.predict.history(0, 4).then(setPredictions).catch(() => {});
  }, []);

  const lastDisease = predictions[0]?.disease ?? "—";
  const lastDate = predictions[0]?.created_at
    ? new Date(predictions[0].created_at).toLocaleDateString()
    : "—";
  const avgConf = predictions.length
    ? Math.round(predictions.reduce((s, p) => s + (p.confidence ?? 0), 0) / predictions.length * 100)
    : null;

  return (
    <UserLayout title="Dashboard" breadcrumb={["Home", "Dashboard"]}>
      <div className="grid gap-6">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={Activity} label="Total Predictions" value={String(predictions.length)} trend="from your history" tone="primary" />
          <StatCard icon={Stethoscope} label="Last Prediction" value={lastDisease} trend={lastDate} tone="success" />
          <StatCard icon={TrendingUp} label="Avg Confidence" value={avgConf != null ? `${avgConf}%` : "—"} trend="across all predictions" tone="warning" />
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
                  {predictions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground text-sm">
                        No predictions yet. <Link to="/dashboard/predict" className="text-primary hover:underline">Make your first prediction →</Link>
                      </td>
                    </tr>
                  )}
                  {predictions.map((p) => {
                    const syms: string[] = JSON.parse(p.symptoms);
                    const conf = p.confidence != null ? Math.round(p.confidence * 100) : null;
                    return (
                      <tr key={p.id} className="border-t border-border">
                        <td className="px-6 py-4">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-muted-foreground">{syms.join(", ")}</td>
                        <td className="px-6 py-4 font-medium">{p.disease}</td>
                        <td className="px-6 py-4">
                          {conf != null && (
                            <span className="inline-flex px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold">
                              {conf}%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-hero text-primary-foreground p-6 rounded-2xl shadow-soft">
              <Sparkles className="h-6 w-6 mb-3" />
              <h3 className="font-semibold text-lg">Quick Predict</h3>
              <p className="text-sm opacity-90 mt-1">Hello, {user?.name ?? "there"}! Start a new symptom analysis.</p>
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
