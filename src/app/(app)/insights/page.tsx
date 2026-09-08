"use client";

import * as React from "react";
import { TrendingUp, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function InsightsPage() {
  const METRICS = [
    { title: "Points Delivered", value: "48 pts", change: "+14% vs last sprint", icon: Zap, status: "success" },
    { title: "Milestones Achieved", value: "94.2%", change: "On schedule", icon: CheckCircle, status: "success" },
    { title: "Healthy Projects", value: "5 of 6", change: "83% healthy", icon: TrendingUp, status: "default" },
    { title: "Active Blockers", value: "2", change: "Requires lead review", icon: AlertTriangle, status: "warning" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Insights & Velocity
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Milestone progress, deliverable throughput, and project health.
          </p>
        </div>
        <Badge variant="outline" className="text-xs self-start sm:self-auto">
          Weekly Overview
        </Badge>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.title} className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground">{metric.title}</span>
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-foreground">{metric.value}</p>
              <p className="text-[10px] text-muted-foreground">{metric.change}</p>
            </div>
          );
        })}
      </div>

      {/* Milestone Trajectory Section */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          Sprint Trajectory
        </h2>
        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-4">
          <div className="h-36 flex items-end justify-between gap-2 pt-4 px-2 border-b border-border/50">
            {[45, 60, 52, 75, 68, 85, 92, 88].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full bg-primary/70 hover:bg-primary rounded-t transition-all duration-300"
                  style={{ height: `${val}%` }}
                />
                <span className="text-[10px] text-muted-foreground font-mono">W{idx + 1}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Weekly completed deliverables across engineering & design.
          </p>
        </div>
      </section>
    </div>
  );
}
