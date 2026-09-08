"use client";

import * as React from "react";
import {
  CheckCircle2,
  CalendarClock,
  FolderKanban,
  AlertCircle,
  Building2,
  ShieldCheck,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentRole } from "@/components/providers/role-context";
import { ROLE_DASHBOARDS, SEED_ORGANIZATION } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import type { OrgRole } from "@/types";

export default function HomePage() {
  const { role, setRole } = useCurrentRole();
  const currentConfig = ROLE_DASHBOARDS[role] || ROLE_DASHBOARDS.ceo;

  const ROLES: { id: OrgRole; label: string }[] = [
    { id: "employee", label: "Employee" },
    { id: "manager", label: "Manager" },
    { id: "ceo", label: "CEO / Admin" },
  ];

  const getMetricIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("completed")) return CheckCircle2;
    if (t.includes("due") || t.includes("overdue")) return CalendarClock;
    if (t.includes("project")) return FolderKanban;
    if (t.includes("blocked") || t.includes("overdue")) return AlertCircle;
    return Layers;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Role Perspective Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-border/80 bg-card shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Workspace Overview
            </h2>
            <Badge variant="outline" className="text-[11px] font-mono border-border">
              Phase 0 Foundation
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {currentConfig.roleDescription}
          </p>
        </div>

        {/* Role Perspective Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border/60 bg-muted/30 self-start sm:self-auto">
          <span className="text-[11px] font-medium text-muted-foreground px-2 hidden sm:inline">
            View as:
          </span>
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={cn(
                "px-2.5 py-1 text-xs rounded-md font-medium transition-all",
                role === r.id
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Work-Based Metrics Grid (No time tracking or surveillance) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentConfig.metrics.map((metric) => {
          const Icon = getMetricIcon(metric.title);
          return (
            <Card key={metric.title} className="hover:border-primary/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground truncate mr-2">
                  {metric.title}
                </CardTitle>
                <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{metric.value}</div>
                {metric.change && (
                  <p
                    className={cn(
                      "text-[11px] mt-1 font-medium",
                      metric.status === "destructive"
                        ? "text-rose-500 dark:text-rose-400"
                        : metric.status === "warning"
                        ? "text-amber-500 dark:text-amber-400"
                        : metric.status === "success"
                        ? "text-emerald-500 dark:text-emerald-400"
                        : "text-muted-foreground"
                    )}
                  >
                    {metric.change}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Role-Specific Content Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Sections based on Role */}
        <div className="lg:col-span-2 space-y-6">
          {currentConfig.prioritySections.map((section) => (
            <Card key={section.title}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{section.title}</CardTitle>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {section.items.length} items
                  </span>
                </div>
                <CardDescription className="text-xs">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border/60 hover:border-primary/40 bg-card transition-all gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        <span className="font-mono">{item.id}</span> · {item.subtitle}
                      </p>
                    </div>
                    <Badge variant={item.badgeVariant} className="text-[10px] self-start sm:self-auto shrink-0">
                      {item.badge}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workspace & Architecture Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">Tenant Context</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Active organization architecture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Organization</span>
                <span className="font-medium">{SEED_ORGANIZATION.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Tenant Slug</span>
                <code className="text-xs font-mono">{SEED_ORGANIZATION.slug}</code>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Active Role View</span>
                <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                  {role}
                </Badge>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Data Layer</span>
                <span className="text-muted-foreground font-mono">Seed (DB-ready)</span>
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-border/60 bg-muted/20 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Row Level Security prepared. Client tenant IDs never trusted.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
