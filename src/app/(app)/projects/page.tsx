import { FolderKanban, Plus, Clock, Users, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const PROJECTS = [
    {
      title: "Design System & Shell",
      description: "Mobile-first responsive architecture, shadcn/ui components, and Tailwind styling.",
      progress: 100,
      status: "Completed",
      team: "Design & Frontend",
      tasks: "8/8 Done",
    },
    {
      title: "Auth & Multi-Tenancy",
      description: "Supabase RLS, tenant isolation, role-based access control, and team invitations.",
      progress: 25,
      status: "In Progress",
      team: "Security & Backend",
      tasks: "3/12 Done",
    },
    {
      title: "Realtime Chat & Collaboration",
      description: "Project-scoped chat channels, direct messaging, and task reference unfurling.",
      progress: 0,
      status: "Planned",
      team: "Product Team",
      tasks: "0/15 Done",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Projects
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Cross-team initiatives, milestones, and delivery tracking.
          </p>
        </div>
        <Button size="sm" className="text-xs self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Create Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PROJECTS.map((project) => (
          <Card key={project.title} className="flex flex-col justify-between hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between mb-1">
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
                <span className="text-[11px] text-muted-foreground font-medium">{project.team}</span>
              </div>
              <CardTitle className="text-base">{project.title}</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t border-border/50 flex justify-between text-xs text-muted-foreground">
              <span>{project.tasks}</span>
              <span className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors">
                View Board <ArrowRight className="h-3 w-3" />
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
