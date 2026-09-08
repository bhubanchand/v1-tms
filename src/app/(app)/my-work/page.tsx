"use client";

import * as React from "react";
import { Plus, Check, Calendar, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  project: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  due: string;
  completed: boolean;
}

const INITIAL_TASKS: Task[] = [
  {
    id: "TSK-101",
    title: "Review multi-tenant database migration scripts",
    project: "Core Infrastructure",
    priority: "Urgent",
    due: "Today",
    completed: false,
  },
  {
    id: "TSK-102",
    title: "Audit RLS policies for cross-tenant isolation",
    project: "Security Architecture",
    priority: "High",
    due: "Tomorrow",
    completed: false,
  },
  {
    id: "TSK-103",
    title: "Establish mobile navigation touch targets (min 44px)",
    project: "Design System",
    priority: "Medium",
    due: "Sep 12",
    completed: false,
  },
  {
    id: "TSK-104",
    title: "Configure .env.example placeholders for Supabase",
    project: "DevOps",
    priority: "Low",
    due: "Sep 15",
    completed: true,
  },
];

export default function MyWorkPage() {
  const [tasks, setTasks] = React.useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = React.useState<"all" | "active" | "completed">("all");

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            My Work
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Your personal deliverables, upcoming deadlines, and priorities.
          </p>
        </div>
        <Button size="sm" className="text-xs self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          New Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5">
        {(["all", "active", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "px-3 py-1.5 text-xs rounded-lg font-medium capitalize transition-all",
              filter === tab
                ? "bg-muted text-foreground font-semibold"
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
        <div className="divide-y divide-border/60 border border-border/60 rounded-xl bg-card overflow-hidden">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={cn(
                "group flex items-center justify-between p-3.5 transition-colors cursor-pointer select-none",
                task.completed ? "bg-muted/15 opacity-60" : "hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
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
                  aria-label={`Mark task as ${task.completed ? "incomplete" : "complete"}`}
                >
                  {task.completed && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                </button>

                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-xs sm:text-sm font-medium tracking-tight truncate",
                      task.completed ? "line-through text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {task.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    <span className="font-mono">{task.id}</span> · {task.project}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-3">
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
                  {task.due}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
