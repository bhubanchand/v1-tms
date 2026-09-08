"use client";

import * as React from "react";
import { Plus, X, CheckSquare, FolderKanban, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuickCreateProps {
  onTaskCreated?: (task: {
    id: string;
    title: string;
    project: string;
    priority: "Low" | "Medium" | "High" | "Urgent";
    dueText: string;
  }) => void;
}

export function QuickCreate({ onTaskCreated }: QuickCreateProps) {
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<"task" | "project">("task");
  const [title, setTitle] = React.useState("");
  const [project, setProject] = React.useState("Core Platform");
  const [priority, setPriority] = React.useState<"Low" | "Medium" | "High" | "Urgent">("Medium");
  const [dueText, setDueText] = React.useState("Tomorrow");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (type === "task") {
      const newTask = {
        id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
        title: title.trim(),
        project,
        priority,
        dueText,
      };
      onTaskCreated?.(newTask);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle("");
      setOpen(false);
    }, 600);
  };

  return (
    <>
      {/* Mobile Floating Action Button (Thumb zone) */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "md:hidden fixed bottom-20 right-4 z-40 h-13 w-13 rounded-full",
          "bg-primary text-primary-foreground shadow-lg flex items-center justify-center",
          "border border-primary-foreground/20 active:scale-95 transition-transform duration-150 pressable",
          "hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20"
        )}
        aria-label="Create new item"
      >
        <Plus className="h-6 w-6 stroke-[2.5]" />
      </button>

      {/* Creation Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
          />

          <div
            className={cn(
              "relative z-10 w-full max-w-lg bg-card border border-border/80 shadow-2xl",
              "rounded-t-3xl sm:rounded-2xl overflow-hidden p-5 sm:p-6",
              "animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-foreground">Quick Create</span>
                <Badge variant="outline" className="text-[10px] font-normal">
                  Shortcut
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Type Switcher */}
            <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-xl bg-muted/50 text-xs font-medium">
              <button
                type="button"
                onClick={() => setType("task")}
                className={cn(
                  "flex items-center justify-center gap-2 py-2 rounded-lg transition-all pressable",
                  type === "task"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <CheckSquare className="h-4 w-4" />
                <span>New Task</span>
              </button>
              <button
                type="button"
                onClick={() => setType("project")}
                className={cn(
                  "flex items-center justify-center gap-2 py-2 rounded-lg transition-all pressable",
                  type === "project"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FolderKanban className="h-4 w-4" />
                <span>New Project</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  {type === "task" ? "Task Title" : "Project Name"}
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={type === "task" ? "e.g. Audit API authentication headers..." : "e.g. Mobile Client V2..."}
                  autoFocus
                  required
                  className="mt-1"
                />
              </div>

              {type === "task" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Project</label>
                      <select
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        className="w-full mt-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option>Core Platform</option>
                        <option>Design System</option>
                        <option>Security Core</option>
                        <option>Mobile Shell</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Priority</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full mt-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Due Date</label>
                    <div className="flex gap-2 mt-1">
                      {["Today", "Tomorrow", "Next Week"].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDueText(d)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all pressable",
                            dueText === d
                              ? "border-primary bg-primary/10 text-primary font-semibold"
                              : "border-border/60 hover:bg-muted text-muted-foreground"
                          )}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Team</label>
                    <select
                      className="w-full mt-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option>Engineering</option>
                      <option>Product Design</option>
                      <option>Operations</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Target Launch</label>
                    <Input defaultValue="Q4 2026" className="mt-1 h-9 text-xs" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!title.trim() || submitted}
                  className="text-xs min-w-[90px]"
                >
                  {submitted ? (
                    <span className="flex items-center gap-1 text-emerald-500">
                      <Check className="h-4 w-4" /> Created!
                    </span>
                  ) : (
                    <span>Create {type === "task" ? "Task" : "Project"}</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
