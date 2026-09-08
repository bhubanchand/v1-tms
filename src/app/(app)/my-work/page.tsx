import { CheckSquare, Filter, Plus, Calendar, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MyWorkPage() {
  const MOCK_TASKS = [
    {
      id: "TSK-101",
      title: "Review multi-tenant database migration scripts",
      project: "Core Infrastructure",
      priority: "Urgent",
      due: "Today",
      status: "In Progress",
    },
    {
      id: "TSK-102",
      title: "Audit RLS policies for cross-tenant isolation",
      project: "Security Architecture",
      priority: "High",
      due: "Tomorrow",
      status: "Todo",
    },
    {
      id: "TSK-103",
      title: "Establish mobile navigation touch targets (min 44px)",
      project: "Design System",
      priority: "Medium",
      due: "Sep 12",
      status: "Review",
    },
    {
      id: "TSK-104",
      title: "Configure .env.example placeholders for Supabase",
      project: "DevOps",
      priority: "Low",
      due: "Sep 15",
      status: "Completed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            My Work
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Your personal task queue, priorities, and daily assignments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            Filter
          </Button>
          <Button size="sm" className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New Task
          </Button>
        </div>
      </div>

      {/* Task List Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Active Tasks (4)</CardTitle>
            <span className="text-xs text-muted-foreground">Phase 2 Preview</span>
          </div>
          <CardDescription className="text-xs">
            Task execution engine and status workflows will be implemented in Phase 2.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {MOCK_TASKS.map((task) => (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border/60 hover:border-primary/40 bg-card transition-all gap-2"
            >
              <div className="flex items-start gap-3 min-w-0">
                <CheckSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                    {task.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    <span className="font-mono">{task.id}</span> · {task.project}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
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
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{task.due}</span>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {task.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
