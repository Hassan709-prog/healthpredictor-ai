import { createFileRoute } from "@tanstack/react-router";
import { UserLayout } from "@/components/layouts/UserLayout";
import { useState, useEffect } from "react";
import { api, type Prediction } from "@/lib/api";
import { PredictionResultCard } from "@/components/PredictionResultCard";
import { FileText, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({ meta: [{ title: "My Reports — HealthPredictor" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Prediction | null>(null);

  useEffect(() => {
    api.predict.history()
      .then(setPredictions)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <UserLayout title="Medical Reports" breadcrumb={["Dashboard", "Reports"]}>
      {selectedReport ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setSelectedReport(null)} className="mb-2 print:hidden">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Reports
          </Button>
          <PredictionResultCard 
            prediction={selectedReport} 
            onReset={() => setSelectedReport(null)} 
          />
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Generated AI Reports</h2>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">Loading your reports...</div>
          ) : predictions.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
              You haven't generated any reports yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predictions.map((p) => {
                const conf = p.confidence != null ? Math.round(p.confidence * 100) : null;
                return (
                  <div 
                    key={p.id} 
                    className="p-5 rounded-xl border border-border bg-muted/30 hover:border-primary transition-colors cursor-pointer group flex flex-col justify-between h-40"
                    onClick={() => setSelectedReport(p)}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        {conf && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            {conf}% Confidence
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-foreground truncate">{p.disease}</h3>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-primary font-medium group-hover:underline">
                        View Full Report
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </UserLayout>
  );
}
