"use client";

import * as React from "react";
import {
  X,
  Check,
  Calendar,
  AlertCircle,
  Clock,
  FolderKanban,
  User,
  Flag,
  ArrowRight,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface TaskDetail {
  id: string;
  title: string;
  project: string;
  status: "todo" | "in_progress" | "in_review" | "done";
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignee?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  dueDate?: string;
  dueText?: string;
  isOverdue?: boolean;
  isDueToday?: boolean;
  description?: string;
  completed?: boolean;
}

interface TaskSheetProps {
  task: TaskDetail | null;
  open: boolean;
  onClose: () => void;
  onUpdateTask: (updated: TaskDetail) => void;
  onDeleteTask?: (id: string) => void;
}

const STATUS_CONFIG = {
  todo: { label: "To Do", color: "bg-muted text-muted-foreground border-border" },
  in_progress: { label: "In Progress", color: "bg-primary/10 text-primary border-primary/20" },
  in_review: { label: "In Review", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  done: { label: "Completed", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
};

const PRIORITY_CONFIG = {
  Low: { variant: "outline" as const, dot: "bg-muted-foreground" },
  Medium: { variant: "secondary" as const, dot: "bg-blue-500" },
  High: { variant: "warning" as const, dot: "bg-amber-500" },
  Urgent: { variant: "destructive" as const, dot: "bg-rose-500" },
};

export function TaskSheet({
  task,
  open,
  onClose,
  onUpdateTask,
  onDeleteTask,
}: TaskSheetProps) {
  const [current, setCurrent] = React.useState<TaskDetail | null>(task);
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [titleInput, setTitleInput] = React.useState("");

  React.useEffect(() => {
    setCurrent(task);
    if (task) {
      setTitleInput(task.title);
    }
  }, [task]);

  if (!open || !current) return null;

  const handleStatusChange = (status: TaskDetail["status"]) => {
    const updated = {
      ...current,
      status,
      completed: status === "done",
    };
    setCurrent(updated);
    onUpdateTask(updated);
  };

  const handlePriorityChange = (priority: TaskDetail["priority"]) => {
    const updated = { ...current, priority };
    setCurrent(updated);
    onUpdateTask(updated);
  };

  const handleSaveTitle = () => {
    if (!titleInput.trim()) return;
    const updated = { ...current, title: titleInput.trim() };
    setCurrent(updated);
    onUpdateTask(updated);
    setIsEditingTitle(false);
  };

  const handleToggleComplete = () => {
    const nextStatus: TaskDetail["status"] = current.status === "done" ? "in_progress" : "done";
    const updated = {
      ...current,
      status: nextStatus,
      completed: nextStatus === "done",
    };
    setCurrent(updated);
    onUpdateTask(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Sheet Container: Bottom Sheet on Mobile, Right Slide-over on Tablet/Desktop */}
      <aside
        className={cn(
          "relative z-10 w-full md:max-w-md bg-card border-t md:border-t-0 md:border-l border-border/80 shadow-2xl",
          "flex flex-col max-h-[92vh] md:max-h-screen md:h-full mt-auto md:mt-0 rounded-t-3xl md:rounded-none",
          "animate-in slide-in-from-bottom md:slide-in-from-right duration-300 ease-out"
        )}
      >
        {/* Mobile Swipe / Pull Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-muted-foreground">
              {current.id}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <Badge variant="outline" className="text-[10px] font-normal">
              {current.project}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            {onDeleteTask && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteTask(current.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
              aria-label="Close sheet"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Complete Toggle + Title */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={handleToggleComplete}
              className={cn(
                "h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 pressable",
                current.status === "done"
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-muted-foreground/40 hover:border-foreground"
              )}
              aria-label="Toggle task status"
            >
              {current.status === "done" && <Check className="h-4 w-4 stroke-[3]" />}
            </button>

            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveTitle();
                      if (e.key === "Escape") setIsEditingTitle(false);
                    }}
                    autoFocus
                    className="w-full text-base font-semibold bg-background border border-primary rounded-lg px-2.5 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveTitle} className="h-7 text-xs">
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingTitle(false)}
                      className="h-7 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className={cn(
                    "text-base sm:text-lg font-semibold tracking-tight cursor-pointer hover:text-primary transition-colors",
                    current.status === "done" ? "line-through text-muted-foreground" : "text-foreground"
                  )}
                >
                  {current.title}
                </h2>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Click title to edit · Instant auto-save
              </p>
            </div>
          </div>

          {/* Quick Properties Table */}
          <div className="p-4 rounded-2xl border border-border/70 bg-muted/20 space-y-3.5 text-xs">
            {/* Status Selector */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Status
              </span>
              <div className="flex items-center gap-1">
                {(["todo", "in_progress", "in_review", "done"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={cn(
                      "px-2 py-1 rounded-md text-[11px] font-medium border transition-all pressable",
                      current.status === st
                        ? STATUS_CONFIG[st].color
                        : "border-transparent text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {STATUS_CONFIG[st].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Selector */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium flex items-center gap-2">
                <Flag className="h-3.5 w-3.5 text-muted-foreground" />
                Priority
              </span>
              <div className="flex items-center gap-1">
                {(["Low", "Medium", "High", "Urgent"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePriorityChange(p)}
                    className={cn(
                      "px-2 py-1 rounded-md text-[11px] font-medium transition-all pressable",
                      current.priority === p
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignee */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Assignee
              </span>
              <div className="flex items-center gap-2">
                <Avatar fallback={current.assignee?.name?.slice(0, 2).toUpperCase() || "AL"} className="h-5 w-5 text-[10px]" />
                <span className="font-medium text-foreground">
                  {current.assignee?.name || "Marcus Vance"}
                </span>
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Due Date
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "font-medium",
                    current.isOverdue
                      ? "text-rose-500 font-semibold"
                      : current.isDueToday
                      ? "text-amber-500 font-semibold"
                      : "text-foreground"
                  )}
                >
                  {current.dueText || current.dueDate || "Sep 15"}
                </span>
                {current.isOverdue && (
                  <Badge variant="destructive" className="text-[9px] px-1 py-0">
                    Overdue
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description & Context
            </h3>
            <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 text-xs text-foreground leading-relaxed">
              {current.description || (
                <span className="text-muted-foreground italic">
                  Deliverable item tracked in the active sprint cycle. Meets team acceptance criteria and automated test standards.
                </span>
              )}
            </div>
          </div>

          {/* Deliverable Activity */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Activity History
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <p className="text-foreground font-medium">Task created and assigned</p>
                  <p className="text-[11px] text-muted-foreground">By Alex Lee · 2 days ago</p>
                </div>
              </div>
              {current.status === "done" && (
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-emerald-500 font-medium">Marked as completed</p>
                    <p className="text-[11px] text-muted-foreground">Just now</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/60 bg-card/80 backdrop-blur-md flex items-center justify-between gap-3">
          <Button
            variant={current.status === "done" ? "secondary" : "default"}
            onClick={handleToggleComplete}
            className="flex-1 gap-2 font-medium"
          >
            {current.status === "done" ? (
              <>
                <Clock className="h-4 w-4" /> Reopen Task
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" /> Mark Complete
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose} className="px-5">
            Done
          </Button>
        </div>
      </aside>
    </div>
  );
}
