"use client";

import * as React from "react";
import { Plus, ArrowRight, FolderKanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: "Completed" | "In Progress" | "Planned";
  team: string;
  tasks: string;
}

const PROJECTS: Project[] = [
  {
    id: "PRJ-01",
    title: "Design System & Shell",
    description: "Mobile-first responsive architecture, shadcn/ui components, and Tailwind styling.",
    progress: 100,
    status: "Completed",
    team: "Design & Frontend",
    tasks: "8/8 Done",
  },
  {
    id: "PRJ-02",
    title: "Auth & Multi-Tenancy",
    description: "Supabase RLS, tenant isolation, role-based access control, and team invitations.",
    progress: 35,
    status: "In Progress",
    team: "Security & Backend",
    tasks: "4/12 Done",
  },
  {
    id: "PRJ-03",
    title: "Realtime Chat & Collaboration",
    description: "Project-scoped chat channels, direct messaging, and task reference unfurling.",
    progress: 0,
    status: "Planned",
    team: "Product Team",
    tasks: "0/15 Done",
  },
];

export default function ProjectsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Cross-functional milestones, sprint goals, and project delivery boards.
          </p>
        </div>
        <Button size="sm" className="text-xs self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Create Project
        </Button>
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
              className="flex flex-col justify-between p-4 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-colors space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {project.team}
                  </span>
                  <Badge
                    variant={
                      project.status === "Completed"
                        ? "success"
                        : project.status === "In Progress"
                        ? "default"
                        : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {project.status}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                  {project.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/40">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">{project.tasks}</span>
                  <span className="text-foreground">{project.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
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
