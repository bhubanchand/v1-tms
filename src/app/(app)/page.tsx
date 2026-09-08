"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  AlertCircle,
  FolderKanban,
  Check,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useCurrentRole } from "@/components/providers/role-context";
import { cn } from "@/lib/utils";
import type { OrgRole } from "@/types";

interface TaskItem {
  id: string;
  title: string;
  project: string;
  dueText: string;
  isOverdue?: boolean;
  isDueToday?: boolean;
  completed?: boolean;
}

const INITIAL_EMPLOYEE_TASKS: TaskItem[] = [
  {
    id: "TSK-101",
    title: "Implement Command Palette (Cmd+K) quick navigation",
    project: "Design System",
    dueText: "Due Today",
    isDueToday: true,
    completed: false,
  },
  {
    id: "TSK-102",
    title: "Verify 360px mobile viewport touch targets (min 44px)",
    project: "Mobile Shell",
    dueText: "Overdue by 1 day",
    isOverdue: true,
    completed: false,
  },
  {
    id: "TSK-103",
    title: "Refactor dashboard architecture to role-aware data layer",
    project: "Core Platform",
    dueText: "Tomorrow",
    completed: false,
  },
  {
    id: "TSK-104",
    title: "Audit security headers and Content Security Policy",
    project: "Security Foundation",
    dueText: "Sep 12",
    completed: false,
  },
];

export default function HomePage() {
  const { role, setRole } = useCurrentRole();
  const [tasks, setTasks] = React.useState<TaskItem[]>(INITIAL_EMPLOYEE_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed);

  const ROLES: { id: OrgRole; label: string }[] = [
    { id: "employee", label: "Employee" },
    { id: "manager", label: "Manager" },
    { id: "ceo", label: "CEO / Admin" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header & Role Perspective Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Good morning, Jane <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {role === "employee" && "Here is your personal focus and priority deliverables for today."}
            {role === "manager" && "Here is your engineering team status, blocked work, and project health."}
            {role === "ceo" && "Here is the organizational pulse, key milestones, and cross-team health."}
          </p>
        </div>

        {/* Role Switcher Pill */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/60 text-xs self-start sm:self-auto shrink-0">
          <span className="text-[11px] font-medium text-muted-foreground px-1.5 hidden md:inline">
            Perspective:
          </span>
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={cn(
                "px-2.5 py-1 text-xs rounded-md font-medium transition-all",
                role === r.id
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EMPLOYEE VIEW: Focus on personal tasks, deadlines, and active projects */}
      {/* ========================================================================= */}
      {role === "employee" && (
        <div className="space-y-8">
          {/* Quick Stats Pill Row (Not heavy floating boxes) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground">Open Tasks</span>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                {pendingTasks.length}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground">Due Today</span>
              <p className="text-2xl font-bold tracking-tight text-amber-500 mt-1">
                {pendingTasks.filter((t) => t.isDueToday).length}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground">Overdue</span>
              <p className="text-2xl font-bold tracking-tight text-rose-500 mt-1">
                {pendingTasks.filter((t) => t.isOverdue).length}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground">Active Projects</span>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-1">3</p>
            </div>
          </div>

          {/* Today's Focus List */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Your Focus Today
              </h2>
              {completedCount > 0 && (
                <span className="text-xs text-muted-foreground font-medium">
                  {completedCount} of {tasks.length} completed
                </span>
              )}
            </div>

            {pendingTasks.length === 0 ? (
              <EmptyState
                title="You're all clear ✨"
                description="No open tasks remaining for today. Take a break or check project boards."
                actionLabel="View Projects"
                onAction={() => window.location.assign("/projects")}
              />
            ) : (
              <div className="divide-y divide-border/60 border border-border/60 rounded-xl bg-card overflow-hidden">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "group flex items-center justify-between p-3.5 transition-colors cursor-pointer select-none",
                      task.completed ? "bg-muted/20 opacity-60" : "hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTask(task.id);
                        }}
                        className={cn(
                          "h-5 w-5 rounded-md border flex items-center justify-center transition-all shrink-0",
                          task.completed
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-muted-foreground/40 group-hover:border-foreground"
                        )}
                        aria-label={`Mark task ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
                      >
                        {task.completed && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                      </button>

                      <div className="min-w-0">
                        <p
                          className={cn(
                            "text-xs sm:text-sm font-medium tracking-tight truncate transition-all",
                            task.completed ? "line-through text-muted-foreground" : "text-foreground"
                          )}
                        >
                          {task.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {task.project}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {task.isOverdue && !task.completed && (
                        <Badge variant="destructive" className="text-[10px]">
                          Overdue
                        </Badge>
                      )}
                      {task.isDueToday && !task.completed && (
                        <Badge variant="warning" className="text-[10px]">
                          Due Today
                        </Badge>
                      )}
                      <span className="text-[11px] text-muted-foreground hidden sm:inline">
                        {task.dueText}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Active Projects Preview */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Active Projects
              </h2>
              <Link href="/projects" className="text-xs text-primary hover:underline font-medium">
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: "Design System", progress: "8/8 tasks", status: "Healthy", badge: "success" },
                { name: "Mobile Shell", progress: "5/6 tasks", status: "In Review", badge: "secondary" },
                { name: "Security Core", progress: "3/8 tasks", status: "On Track", badge: "default" },
              ].map((proj) => (
                <div key={proj.name} className="p-3.5 rounded-xl border border-border/60 bg-card/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{proj.name}</span>
                    <Badge variant={proj.badge as any} className="text-[9px]">
                      {proj.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{proj.progress}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MANAGER VIEW: Team health, blocked work, needs attention */}
      {/* ========================================================================= */}
      {role === "manager" && (
        <div className="space-y-8">
          {/* Team Pulse Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground">Team Tasks</span>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-1">28</p>
            </div>
            <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground">Overdue Work</span>
              <p className="text-2xl font-bold tracking-tight text-rose-500 mt-1">3</p>
            </div>
            <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground">Blocked Work</span>
              <p className="text-2xl font-bold tracking-tight text-amber-500 mt-1">2</p>
            </div>
            <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground">Project Health</span>
              <p className="text-2xl font-bold tracking-tight text-emerald-500 mt-1">92%</p>
            </div>
          </div>

          {/* Needs Attention Section */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Needs Attention
            </h2>
            <div className="divide-y divide-border/60 border border-border/60 rounded-xl bg-card overflow-hidden">
              {[
                {
                  id: "BLK-01",
                  title: "PostgreSQL connection pool exhaustion during peak writes",
                  team: "Infrastructure",
                  assignee: "Sarah Connor",
                  badge: "Blocked",
                  variant: "destructive",
                },
                {
                  id: "OVD-02",
                  title: "Cross-tenant RLS policy test suite verification",
                  team: "Security",
                  assignee: "Alex Lee",
                  badge: "2 Days Overdue",
                  variant: "warning",
                },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-3 min-w-0">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.team} · Assigned to {item.assignee}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.variant as any} className="text-[10px] shrink-0 ml-3">
                    {item.badge}
                  </Badge>
                </div>
              ))}
            </div>
          </section>

          {/* Team Projects */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Projects Overview
              </h2>
              <Link href="/projects" className="text-xs text-primary hover:underline font-medium">
                View Kanban
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "Frontend Architecture", health: "On Track", progress: "14 of 16 complete", statusColor: "text-emerald-500" },
                { name: "Supabase Multi-Tenancy", health: "1 Blocker", progress: "6 of 12 complete", statusColor: "text-amber-500" },
              ].map((proj) => (
                <div key={proj.name} className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{proj.name}</span>
                    <span className={cn("text-[11px] font-medium", proj.statusColor)}>{proj.health}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{proj.progress}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CEO / ADMIN VIEW: Company-level pulse, department health, executive milestones */}
      {/* ========================================================================= */}
      {role === "ceo" && (
        <div className="space-y-8">
          {/* Company Pulse */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground">Open Work</span>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-1">64</p>
              <span className="text-[10px] text-muted-foreground">Across all teams</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground">Due This Week</span>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-1">19</p>
              <span className="text-[10px] text-emerald-500 font-medium">85% on schedule</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground">Completed Work</span>
              <p className="text-2xl font-bold tracking-tight text-emerald-500 mt-1">142</p>
              <span className="text-[10px] text-muted-foreground">+31 this sprint</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground">Active Projects</span>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-1">6</p>
              <span className="text-[10px] text-muted-foreground">2 departments</span>
            </div>
          </div>

          {/* Executive Summary & Milestones */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Executive Milestones
            </h2>
            <div className="divide-y divide-border/60 border border-border/60 rounded-xl bg-card overflow-hidden">
              {[
                {
                  id: "M-1",
                  title: "Phase 0 Foundation & Architecture Review",
                  scope: "System Architecture, Design Tokens, Security Threat Model",
                  status: "100% Completed",
                  variant: "success",
                },
                {
                  id: "M-2",
                  title: "Phase 1 Auth & Organization Isolation",
                  scope: "Supabase RLS, Cookie Auth, Tenant Guards, Invitations",
                  status: "Upcoming",
                  variant: "secondary",
                },
                {
                  id: "M-3",
                  title: "Q4 Production Pilot Rollout",
                  scope: "Enterprise pilot testing with 5 customer organizations",
                  status: "In Planning",
                  variant: "outline",
                },
              ].map((milestone) => (
                <div key={milestone.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-2 hover:bg-muted/30 transition-colors">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-foreground">{milestone.title}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{milestone.scope}</p>
                  </div>
                  <Badge variant={milestone.variant as any} className="text-[10px] self-start sm:self-auto shrink-0">
                    {milestone.status}
                  </Badge>
                </div>
              ))}
            </div>
          </section>

          {/* Department Health */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Department Health
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "Engineering", members: "12 Members", tasks: "28 active tasks · 0 critical blockers", status: "Healthy", variant: "success" },
                { name: "Product Design", members: "4 Members", tasks: "14 active tasks · Design system stable", status: "Healthy", variant: "success" },
              ].map((dept) => (
                <div key={dept.name} className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{dept.name}</span>
                    <Badge variant={dept.variant as any} className="text-[9px]">{dept.status}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{dept.members} · {dept.tasks}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
