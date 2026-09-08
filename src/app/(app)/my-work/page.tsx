"use client";

import * as React from "react";
import { Plus, Check, Calendar, Filter, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskSheet, TaskDetail } from "@/components/ui/task-sheet";
import { cn } from "@/lib/utils";

const INITIAL_TASKS: TaskDetail[] = [
  {
    id: "TSK-101",
    title: "Review multi-tenant database migration scripts",
    project: "Core Infrastructure",
    status: "todo",
    priority: "Urgent",
    dueDate: "Today",
    dueText: "Due Today",
    isDueToday: true,
    completed: false,
    description: "Ensure schema statements enforce tenant isolation and indexing on organization_id.",
    assignee: { name: "Marcus Vance", role: "Frontend Engineer" },
  },
  {
    id: "TSK-102",
    title: "Audit RLS policies for cross-tenant isolation",
    project: "Security Architecture",
    status: "in_progress",
    priority: "High",
    dueDate: "Tomorrow",
    dueText: "Tomorrow",
    completed: false,
    description: "Validate PostgreSQL row-level security policies prevent lateral organization data leakage.",
    assignee: { name: "Marcus Vance", role: "Frontend Engineer" },
  },
  {
    id: "TSK-103",
    title: "Establish mobile navigation touch targets (min 44px)",
    project: "Design System",
    status: "todo",
    priority: "Medium",
    dueDate: "Sep 12",
    dueText: "Sep 12",
    completed: false,
    description: "Verify all touch targets on 360px and 390px mobile screens conform to WCAG 2.1 AA.",
    assignee: { name: "Marcus Vance", role: "Frontend Engineer" },
  },
  {
    id: "TSK-104",
    title: "Configure .env.example placeholders for Supabase",
    project: "DevOps",
    status: "done",
    priority: "Low",
    dueDate: "Sep 15",
    dueText: "Completed",
    completed: true,
    description: "Set clean placeholder environment variables without checking in actual secrets.",
    assignee: { name: "Marcus Vance", role: "Frontend Engineer" },
  },
];

export default function MyWorkPage() {
  const [tasks, setTasks] = React.useState<TaskDetail[]>(INITIAL_TASKS);
  const [filter, setFilter] = React.useState<"all" | "active" | "completed">("all");
  const [selectedTask, setSelectedTask] = React.useState<TaskDetail | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const toggleTask = (e: React.MouseEvent, id: string) => {
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

  const handleUpdateTask = (updated: TaskDetail) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTask(updated);
  };

  const openSheet = (task: TaskDetail) => {
    setSelectedTask(task);
    setSheetOpen(true);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            My Work
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Your personal deliverables, upcoming deadlines, and focus items.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card/80 backdrop-blur-md border border-border/80 w-fit">
        {(["all", "active", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "px-3.5 py-1 text-xs rounded-lg font-medium capitalize transition-all pressable",
              filter === tab
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {tab === "all" ? `All Tasks (${tasks.length})` : tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="You're all clear ✨"
          description={
            filter === "completed"
              ? "No completed tasks yet. Check off items as you finish them."
              : "No active tasks matching your filter."
          }
        />
      ) : (
        <div className="divide-y divide-border/60 border border-border/80 rounded-2xl bg-card shadow-xs overflow-hidden">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => openSheet(task)}
              className={cn(
                "group flex items-center justify-between p-4 transition-all cursor-pointer select-none pressable",
                task.completed ? "bg-muted/15 opacity-60" : "hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  type="button"
                  onClick={(e) => toggleTask(e, task.id)}
                  className={cn(
                    "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 pressable",
                    task.completed
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-muted-foreground/40 group-hover:border-foreground"
                  )}
                  aria-label={`Mark task as ${task.completed ? "incomplete" : "complete"}`}
                >
                  {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </button>

                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-xs sm:text-sm font-medium tracking-tight truncate transition-colors",
                      task.completed ? "line-through text-muted-foreground" : "text-foreground group-hover:text-primary"
                    )}
                  >
                    {task.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    <span className="font-mono">{task.id}</span> · {task.project}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 ml-3">
                <Badge
                  variant={
                    task.priority === "Urgent"
                      ? "destructive"
                      : task.priority === "High"
                      ? "warning"
                      : "secondary"
                  }
                  className="text-[10px]"
                >
                  {task.priority}
                </Badge>
                <span className="text-[11px] text-muted-foreground hidden sm:inline">
                  {task.dueText || task.dueDate}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Task Detail Sheet */}
      <TaskSheet
        task={selectedTask}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
}
