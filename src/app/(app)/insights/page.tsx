import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function InsightsPage() {
  const METRICS = [
    { title: "Points Delivered", value: "48 pts", change: "+14% vs last sprint", icon: Zap },
    { title: "Milestone Completion", value: "94.2%", change: "On track", icon: CheckCircle },
    { title: "Projects on Schedule", value: "5 of 6", change: "83% healthy", icon: TrendingUp },
    { title: "Active Blockers", value: "2", change: "Requires review", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Insights & Velocity
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Milestone progress, deliverable throughput, and project health.
          </p>
        </div>
        <Badge variant="outline" className="text-xs self-start sm:self-auto">
          Phase 6 Preview
        </Badge>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-[11px] text-muted-foreground mt-1">{metric.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Velocity Graph Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Throughput & Burnup Trajectory</CardTitle>
          <CardDescription className="text-xs">
            Aggregated task completion velocity per team sprint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-2 pt-6 px-4 border-b border-border/60">
            {[45, 60, 52, 75, 68, 85, 92, 88].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all"
                  style={{ height: `${val}%` }}
                />
                <span className="text-[10px] text-muted-foreground font-mono">W{idx + 1}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Realtime metrics computation will connect to PostgreSQL in Phase 6.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
