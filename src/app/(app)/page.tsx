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
  Clock,
  Shield,
  Users,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskSheet, TaskDetail } from "@/components/ui/task-sheet";
import { useCurrentRole } from "@/components/providers/role-context";
import { cn } from "@/lib/utils";
import type { OrgRole } from "@/types";

const INITIAL_EMPLOYEE_TASKS: TaskDetail[] = [
  {
    id: "TSK-101",
    title: "Implement Command Palette (Cmd+K) quick navigation",
    project: "Design System",
    status: "todo",
    priority: "High",
    dueText: "Due Today",
    isDueToday: true,
    completed: false,
    description: "Build a responsive keyboard-first command palette with navigation shortcuts, theme toggle, and role preview switching.",
    assignee: { name: "Marcus Vance", role: "Frontend Engineer" },
  },
  {
    id: "TSK-102",
    title: "Verify 360px mobile viewport touch targets (min 44px)",
    project: "Mobile Shell",
    status: "in_progress",
    priority: "Urgent",
    dueText: "Overdue by 1 day",
    isOverdue: true,
    completed: false,
    description: "Audit all interactive navigation elements, buttons, and bottom dock icons to guarantee WCAG 44x44px touch compliance.",
    assignee: { name: "Marcus Vance", role: "Frontend Engineer" },
  },
  {
    id: "TSK-103",
    title: "Refactor dashboard architecture to role-aware data layer",
    project: "Core Platform",
    status: "todo",
    priority: "Medium",
    dueText: "Tomorrow",
    completed: false,
    description: "Separate executive, managerial, and individual contributor perspectives into isolated deliverable feeds without fake metrics.",
    assignee: { name: "Marcus Vance", role: "Frontend Engineer" },
  },
  {
    id: "TSK-104",
    title: "Audit security headers and Content Security Policy",
    project: "Security Foundation",
    status: "done",
    priority: "High",
    dueText: "Completed",
    completed: true,
    description: "Add HSTS, CSP, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy headers to next.config.mjs.",
    assignee: { name: "Marcus Vance", role: "Frontend Engineer" },
  },
];

export default function HomePage() {
  const { role, setRole } = useCurrentRole();
  const [tasks, setTasks] = React.useState<TaskDetail[]>(INITIAL_EMPLOYEE_TASKS);
  const [selectedTask, setSelectedTask] = React.useState<TaskDetail | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<"all" | "today" | "high">("all");

  const openTaskSheet = (task: TaskDetail) => {
    setSelectedTask(task);
    setSheetOpen(true);
  };

  const handleUpdateTask = (updated: TaskDetail) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTask(updated);
  };

  const toggleTaskComplete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          status: nextCompleted ? "done" : "in_progress",
        };
      })
    );
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const filteredTasks = tasks.filter((t) => {
    if (filter === "today") return t.isDueToday && !t.completed;
    if (filter === "high") return (t.priority === "High" || t.priority === "Urgent") && !t.completed;
    return true;
  });

  const ROLES: { id: OrgRole; label: string }[] = [
    { id: "employee", label: "Employee" },
    { id: "manager", label: "Manager" },
    { id: "ceo", label: "CEO / Admin" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header & Perspective Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {role === "employee" ? "Good morning, Jane" : role === "manager" ? "Good morning, Alex" : "Executive Overview"}
              <span className="inline-block ml-2 animate-bounce">👋</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {role === "employee" && "Here is your personal focus and priority deliverables for today."}
            {role === "manager" && "Engineering team pulse, blocked work, and sprint health."}
            {role === "ceo" && "Real-time organization health, strategic milestones, and cross-team risks."}
          </p>
        </div>

        {/* Perspective Switcher Pill */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-card/80 backdrop-blur-md border border-border/80 text-xs self-start sm:self-auto shrink-0 shadow-2xs">
          <span className="text-[11px] font-medium text-muted-foreground px-2 hidden sm:inline">
            Role:
          </span>
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={cn(
                "px-3 py-1 text-xs rounded-lg font-medium transition-all pressable",
                role === r.id
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EMPLOYEE VIEW: Friendly, focused, tactile task completion                   */}
      {/* ========================================================================= */}
      {role === "employee" && (
        <div className="space-y-7">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-md shadow-2xs">
              <span className="text-xs font-medium text-muted-foreground">Open Tasks</span>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                {pendingTasks.length}
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-md shadow-2xs">
              <span className="text-xs font-medium text-muted-foreground">Due Today</span>
              <p className="text-2xl font-bold tracking-tight text-amber-500 mt-1">
                {pendingTasks.filter((t) => t.isDueToday).length}
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-md shadow-2xs">
              <span className="text-xs font-medium text-muted-foreground">Overdue</span>
              <p className="text-2xl font-bold tracking-tight text-rose-500 mt-1">
                {pendingTasks.filter((t) => t.isOverdue).length}
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-md shadow-2xs">
              <span className="text-xs font-medium text-muted-foreground">Active Projects</span>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-1">3</p>
            </div>
          </div>

          {/* Today's Focus List */}
          <section className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-foreground">
                  Today&apos;s Focus
                </h2>
                <p className="text-xs text-muted-foreground">
                  Tap any task to view details or mark progress
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 self-start sm:self-auto p-1 rounded-lg bg-muted/40 text-xs">
                <button
                  onClick={() => setFilter("all")}
                  className={cn(
                    "px-2.5 py-0.5 rounded-md font-medium transition-all",
                    filter === "all" ? "bg-background text-foreground shadow-2xs font-semibold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All ({tasks.length})
                </button>
                <button
                  onClick={() => setFilter("today")}
                  className={cn(
                    "px-2.5 py-0.5 rounded-md font-medium transition-all",
                    filter === "today" ? "bg-background text-foreground shadow-2xs font-semibold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Due Today ({pendingTasks.filter((t) => t.isDueToday).length})
                </button>
                <button
                  onClick={() => setFilter("high")}
                  className={cn(
                    "px-2.5 py-0.5 rounded-md font-medium transition-all",
                    filter === "high" ? "bg-background text-foreground shadow-2xs font-semibold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  High Priority
                </button>
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <EmptyState
                title="You're all clear ✨"
                description="No open tasks remaining in this view. Take a break or explore team project boards."
                actionLabel="View Projects"
                onAction={() => window.location.assign("/projects")}
              />
            ) : (
              <div className="divide-y divide-border/60 border border-border/80 rounded-2xl bg-card shadow-xs overflow-hidden">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => openTaskSheet(task)}
                    className={cn(
                      "group flex items-center justify-between p-4 transition-all cursor-pointer select-none pressable",
                      task.completed ? "bg-muted/15 opacity-60" : "hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => toggleTaskComplete(e, task.id)}
                        className={cn(
                          "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 pressable",
                          task.completed
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-muted-foreground/40 group-hover:border-foreground"
                        )}
                        aria-label={`Mark task ${task.title} as complete`}
                      >
                        {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <p
                          className={cn(
                            "text-xs sm:text-sm font-medium tracking-tight truncate transition-all",
                            task.completed ? "line-through text-muted-foreground" : "text-foreground group-hover:text-primary"
                          )}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-muted-foreground">{task.project}</span>
                          <span className="text-[11px] text-muted-foreground/50">·</span>
                          <span className="text-[11px] font-mono text-muted-foreground/70">{task.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 ml-3">
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
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
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
                <div key={proj.name} className="p-4 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-md space-y-2 shadow-2xs">
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
      {/* MANAGER VIEW: Team health, unblocking work, sprint status                  */}
      {/* ========================================================================= */}
      {role === "manager" && (
        <div className="space-y-7">
          {/* Engineering Pulse Headline */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/85 backdrop-blur-md shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Engineering Pulse: 2 Blockers Requiring Review
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Current sprint commitments are 74% complete. 2 tasks are blocking cross-team deliverables.
              </p>
            </div>
            <Link href="/projects">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 shrink-0 self-start sm:self-auto">
                <span>Open Kanban</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Team Work Deliverables (No fake capacity scores!) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-md shadow-2xs">
              <span className="text-xs font-medium text-muted-foreground">Team Tasks</span>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-1">28</p>
              <span className="text-[10px] text-muted-foreground">In active sprint</span>
            </div>
            <div className="p-4 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-md shadow-2xs">
              <span className="text-xs font-medium text-muted-foreground">Blocked Work</span>
              <p className="text-2xl font-bold tracking-tight text-rose-500 mt-1">2</p>
              <span className="text-[10px] text-rose-500 font-medium">Needs unblocking</span>
            </div>
            <div className="p-4 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-md shadow-2xs">
              <span className="text-xs font-medium text-muted-foreground">Overdue Items</span>
              <p className="text-2xl font-bold tracking-tight text-amber-500 mt-1">3</p>
              <span className="text-[10px] text-amber-500 font-medium">&gt; 24h past target</span>
            </div>
            <div className="p-4 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-md shadow-2xs">
              <span className="text-xs font-medium text-muted-foreground">Sprint Velocity</span>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-1">—</p>
              <span className="text-[10px] text-muted-foreground">Not enough data</span>
            </div>
          </div>

          {/* Blocked Items (Actionable cards) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Blocked Work Items</span>
              </h2>
              <span className="text-xs text-muted-foreground">2 items requiring lead support</span>
            </div>

            <div className="divide-y divide-border/60 border border-border/80 rounded-2xl bg-card shadow-xs overflow-hidden">
              {[
                {
                  id: "BLK-01",
                  title: "PostgreSQL connection pool exhaustion during peak writes",
                  project: "Core Infrastructure",
                  assignee: { name: "Sarah Connor", role: "Backend Engineer" },
                  blockerReason: "Waiting on Supabase connection pool configuration guidance",
                  priority: "Urgent" as const,
                  status: "todo" as const,
                  dueText: "Blocked for 2 days",
                },
                {
                  id: "BLK-02",
                  title: "Cross-tenant RLS policy boundary validation",
                  project: "Security Architecture",
                  assignee: { name: "Alex Lee", role: "Security Lead" },
                  blockerReason: "Awaiting QA test fixture dataset for multi-tenant isolation",
                  priority: "High" as const,
                  status: "in_progress" as const,
                  dueText: "Blocked for 1 day",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => openTaskSheet(item as any)}
                  className="flex items-start justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer select-none pressable"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                        {item.blockerReason}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {item.project} · Assigned to {item.assignee.name}
                      </p>
                    </div>
                  </div>
                  <Badge variant="destructive" className="text-[10px] shrink-0 ml-3">
                    Blocked
                  </Badge>
                </div>
              ))}
            </div>
          </section>

          {/* Sprint Projects Overview */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Sprint Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  name: "Mobile Shell V1",
                  health: "At Risk",
                  healthReason: "2 overdue tasks · 1 blocker",
                  progress: "5 of 8 tasks complete",
                  variant: "destructive",
                },
                {
                  name: "Design Tokens & Primitives",
                  health: "On Track",
                  healthReason: "All sprint goals on schedule",
                  progress: "8 of 8 tasks complete",
                  variant: "success",
                },
              ].map((proj) => (
                <div key={proj.name} className="p-4 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-md space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{proj.name}</span>
                    <Badge variant={proj.variant as any} className="text-[10px]">
                      {proj.health}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{proj.healthReason}</p>
                  <div className="text-[11px] text-muted-foreground/80 pt-1 border-t border-border/40">
                    {proj.progress}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CEO / ADMIN VIEW: Real organizational pulse, risks, milestones            */}
      {/* ========================================================================= */}
      {role === "ceo" && (
        <div className="space-y-7">
          {/* Company Pulse Card */}
          <div className="p-5 rounded-3xl border border-border/80 bg-card/85 backdrop-blur-xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
                <span className="text-sm font-bold text-foreground">
                  Company Pulse: Attention Needed
                </span>
                <Badge variant="warning" className="text-[10px] font-semibold">
                  82% Health
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                Calculated from 3 blockers, 5 overdue tasks, and 6 active projects
              </span>
            </div>

            {/* Deliverable Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/60">
              <div>
                <span className="text-[11px] font-medium text-muted-foreground">Open Deliverables</span>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-0.5">64</p>
                <span className="text-[10px] text-muted-foreground">Across all teams</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-muted-foreground">Critical Blockers</span>
                <p className="text-2xl font-bold tracking-tight text-rose-500 mt-0.5">3</p>
                <span className="text-[10px] text-rose-500 font-medium">Affecting 2 milestones</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-muted-foreground">Due This Week</span>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-0.5">19</p>
                <span className="text-[10px] text-emerald-500 font-medium">14 on track · 5 at risk</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-muted-foreground">Quarterly Trend</span>
                <p className="text-2xl font-bold tracking-tight text-muted-foreground mt-0.5">—</p>
                <span className="text-[10px] text-muted-foreground">Not enough data</span>
              </div>
            </div>
          </div>

          {/* Executive Intelligence Digest */}
          <div className="p-4 sm:p-5 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-md space-y-2">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Executive Intelligence Brief</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              Engineering is currently bottlenecked by PostgreSQL connection pooling exhaustion during peak writes, which puts the Mobile Shell public pilot at risk for next week. In contrast, the Product Design team has delivered 100% of core design tokens ahead of schedule.
            </p>
          </div>

          {/* Needs Attention (Specific High-Impact Risks) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Needs Executive Attention</span>
              </h2>
              <span className="text-xs text-muted-foreground">High impact items</span>
            </div>

            <div className="divide-y divide-border/60 border border-border/80 rounded-2xl bg-card shadow-xs overflow-hidden">
              {[
                {
                  id: "RISK-01",
                  title: "PostgreSQL connection pool exhaustion during peak writes",
                  impact: "Blocks 3 teams and delays pilot benchmark testing",
                  owner: "Sarah Connor (Infrastructure)",
                  urgency: "Critical Blocker",
                  variant: "destructive",
                },
                {
                  id: "RISK-02",
                  title: "Mobile Shell 360px viewport touch target audit",
                  impact: "1 day overdue · Must pass WCAG AA standards prior to release",
                  owner: "Alex Lee (Engineering Lead)",
                  urgency: "Overdue",
                  variant: "warning",
                },
                {
                  id: "RISK-03",
                  title: "Cross-tenant RLS policy boundary validation",
                  impact: "Security requirement for enterprise multi-tenancy signoff",
                  owner: "Security Architecture Team",
                  urgency: "Due Tomorrow",
                  variant: "secondary",
                },
              ].map((risk) => (
                <div
                  key={risk.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2 hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      {risk.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{risk.impact}</p>
                    <p className="text-[11px] text-muted-foreground/80">Owner: {risk.owner}</p>
                  </div>
                  <Badge variant={risk.variant as any} className="text-[10px] self-start sm:self-auto shrink-0">
                    {risk.urgency}
                  </Badge>
                </div>
              ))}
            </div>
          </section>

          {/* Projects with Real Contextual Health */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Strategic Projects & Health
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  name: "Mobile App Pilot",
                  status: "At Risk",
                  reason: "5 overdue tasks · 2 blockers · Target Sep 20",
                  owner: "Alex Lee",
                  variant: "destructive",
                },
                {
                  name: "Design System V2",
                  status: "On Track",
                  reason: "8/8 deliverables complete · Ready for review",
                  owner: "Jane Doe",
                  variant: "success",
                },
                {
                  name: "Security Core & RLS",
                  status: "In Progress",
                  reason: "6/12 deliverables · Target Sep 30",
                  owner: "Alex Lee",
                  variant: "default",
                },
              ].map((proj) => (
                <div key={proj.name} className="p-4 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-md space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{proj.name}</span>
                    <Badge variant={proj.variant as any} className="text-[9px]">
                      {proj.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">{proj.reason}</p>
                  <p className="text-[11px] text-muted-foreground/70 pt-1 border-t border-border/40">
                    Owner: {proj.owner}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Department Health Backed by Real Signals */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Department Health
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  name: "Engineering",
                  members: "12 Members",
                  tasks: "28 active tasks · 2 blockers · 3 overdue",
                  status: "Attention Needed",
                  variant: "warning",
                },
                {
                  name: "Product Design",
                  members: "4 Members",
                  tasks: "14 active tasks · 0 blockers · Sprints on track",
                  status: "Healthy",
                  variant: "success",
                },
              ].map((dept) => (
                <div key={dept.name} className="p-4 rounded-2xl border border-border/70 bg-card/75 backdrop-blur-md space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{dept.name}</span>
                    <Badge variant={dept.variant as any} className="text-[9px]">{dept.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{dept.tasks}</p>
                  <p className="text-[11px] text-muted-foreground/70">{dept.members}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Executive Milestones */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Executive Milestones
            </h2>
            <div className="divide-y divide-border/60 border border-border/80 rounded-2xl bg-card shadow-xs overflow-hidden">
              {[
                {
                  id: "M-1",
                  title: "Design System & Responsive Shell Delivery",
                  scope: "System Architecture, Design Tokens, Security Threat Model",
                  status: "100% Completed",
                  variant: "success",
                },
                {
                  id: "M-2",
                  title: "Organization Identity & Access Control Rollout",
                  scope: "Supabase RLS, Cookie Auth, Tenant Guards, Invitations",
                  status: "Upcoming",
                  variant: "secondary",
                },
                {
                  id: "M-3",
                  title: "Q4 Production Pilot Rollout",
                  scope: "Enterprise pilot testing with customer organizations",
                  status: "In Planning",
                  variant: "outline",
                },
              ].map((milestone) => (
                <div key={milestone.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2 hover:bg-muted/30 transition-colors">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground">{milestone.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{milestone.scope}</p>
                  </div>
                  <Badge variant={milestone.variant as any} className="text-[10px] self-start sm:self-auto shrink-0">
                    {milestone.status}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Interactive Task Detail Sheet (Slide-over on Desktop, Bottom Sheet on Mobile) */}
      <TaskSheet
        task={selectedTask}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
}
