"use client";

import * as React from "react";
import { Plus, ArrowRight, FolderKanban, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { QuickCreate } from "@/components/layout/quick-create";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: "Completed" | "In Progress" | "At Risk" | "Planned";
  healthReason: string;
  team: string;
  tasks: string;
  variant: "success" | "default" | "destructive" | "secondary";
}

const PROJECTS: Project[] = [
  {
    id: "PRJ-01",
    title: "Design System & Shell V1",
    description: "Responsive 360px+ architecture, 4-layer depth hierarchy, Liquid Glass tokens, and tactile task interactions.",
    progress: 100,
    status: "Completed",
    healthReason: "All 8 Phase 0 deliverables verified · Production ready",
    team: "Product Design",
    tasks: "8/8 Done",
    variant: "success",
  },
  {
    id: "PRJ-02",
    title: "Security Foundation & Threat Model",
    description: "Defense-in-depth security foundation, 18-threat model, CSP headers, and Zod input validation schemas.",
    progress: 100,
    status: "Completed",
    healthReason: "12/12 security boundary tests passing",
    team: "Security Architecture",
    tasks: "6/6 Done",
    variant: "success",
  },
  {
    id: "PRJ-03",
    title: "Auth & Multi-Tenancy (Phase 1)",
    description: "Supabase RLS, tenant isolation, role-based access control, and organization invitations.",
    progress: 35,
    status: "In Progress",
    healthReason: "4/12 deliverables complete · Schema ready",
    team: "Core Platform",
    tasks: "4/12 Done",
    variant: "default",
  },
  {
    id: "PRJ-04",
    title: "Mobile App Pilot",
    description: "Standalone PWA mobile testing across 360px, 390px, and 430px viewports with touch targets.",
    progress: 40,
    status: "At Risk",
    healthReason: "5 overdue tasks · 2 blockers · Target Sep 20",
    team: "Mobile Engineering",
    tasks: "5/14 Done",
    variant: "destructive",
  },
];

export default function ProjectsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Active cross-functional milestones, sprint initiatives, and delivery health.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      {PROJECTS.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet."
          description="Create your first team project to organize tasks and milestones."
          actionLabel="Create Project"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between p-5 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-md hover:border-border transition-all shadow-2xs space-y-4 pressable"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {project.team}
                  </span>
                  <Badge variant={project.variant} className="text-[10px]">
                    {project.status}
                  </Badge>
                </div>
                <h2 className="text-base font-semibold text-foreground tracking-tight">
                  {project.title}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                  {project.status === "At Risk" ? (
                    <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  ) : project.status === "Completed" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                  <span className={project.status === "At Risk" ? "text-rose-600 dark:text-rose-400 font-medium" : ""}>
                    {project.healthReason}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-border/60">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">{project.tasks}</span>
                  <span className="text-foreground">{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      project.status === "At Risk"
                        ? "bg-rose-500"
                        : project.status === "Completed"
                        ? "bg-emerald-500"
                        : "bg-primary"
                    )}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
