import { createFileRoute } from "@tanstack/react-router";
import { UserLayout } from "@/components/layouts/UserLayout";
import { useState, useEffect } from "react";
import { api, type JournalEntry } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, Plus, Thermometer, Droplets, Smile } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/dashboard/journal")({
  head: () => ({ meta: [{ title: "Health Journal — HealthPredictor" }] }),
  component: JournalPage,
});

function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [temperature, setTemperature] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [mood, setMood] = useState("Good");

  useEffect(() => {
    setIsMounted(true);
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await api.journal.list();
      // Sort by date ascending for the chart
      const sorted = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setEntries(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.journal.create({
        date,
        temperature: temperature ? parseFloat(temperature) : undefined,
        blood_pressure: bloodPressure || undefined,
        mood: mood || undefined,
      });
      // Clear form and reload
      setTemperature("");
      setBloodPressure("");
      setMood("Good");
      await loadEntries();
    } catch (error) {
      console.error(error);
      alert("Failed to save entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = entries
    .filter((e) => e.temperature !== null)
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      Temperature: e.temperature,
    }));

  return (
    <UserLayout title="Health Journal" breadcrumb={["Dashboard", "Health Journal"]}>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <h2 className="font-semibold flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Add Entry
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Date</label>
                <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                  <Thermometer className="h-4 w-4 text-muted-foreground" /> Temperature (°F/°C)
                </label>
                <Input type="number" step="0.1" placeholder="e.g. 98.6" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                  <Droplets className="h-4 w-4 text-muted-foreground" /> Blood Pressure
                </label>
                <Input placeholder="e.g. 120/80" value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                  <Smile className="h-4 w-4 text-muted-foreground" /> Mood
                </label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={mood} 
                  onChange={(e) => setMood(e.target.value)}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Poor">Poor</option>
                  <option value="Terrible">Terrible</option>
                </select>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Entry"}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Chart & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <h2 className="font-semibold flex items-center gap-2 mb-6">
              <Activity className="h-5 w-5 text-primary" /> Temperature Trends
            </h2>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Loading data...</div>
            ) : chartData.length > 0 ? (
              <div className="h-72">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Line type="monotone" dataKey="Temperature" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-xl">
                No temperature data to display. Add some entries!
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <h2 className="font-semibold mb-4">Recent Entries</h2>
            {entries.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground text-center py-6">No journal entries yet.</p>
            )}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {[...entries].reverse().map((entry) => (
                <div key={entry.id} className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/30">
                  <div className="font-medium">{new Date(entry.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {entry.temperature && <span className="flex items-center gap-1.5"><Thermometer className="h-3.5 w-3.5" /> {entry.temperature}°</span>}
                    {entry.blood_pressure && <span className="flex items-center gap-1.5"><Droplets className="h-3.5 w-3.5" /> {entry.blood_pressure}</span>}
                    {entry.mood && <span className="flex items-center gap-1.5"><Smile className="h-3.5 w-3.5" /> {entry.mood}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
