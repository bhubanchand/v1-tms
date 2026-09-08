import {
  CheckCircle2,
  Clock,
  FolderKanban,
  Users,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const METRIC_CARDS = [
    {
      title: "My Open Tasks",
      value: "4",
      change: "+2 this week",
      icon: CheckCircle2,
      trend: "positive",
    },
    {
      title: "Active Projects",
      value: "3",
      change: "On schedule",
      icon: FolderKanban,
      trend: "neutral",
    },
    {
      title: "Hours Logged",
      value: "32.5h",
      change: "92% capacity",
      icon: Clock,
      trend: "positive",
    },
    {
      title: "Team Members",
      value: "12",
      change: "Acme Corp",
      icon: Users,
      trend: "neutral",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-muted/40 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Welcome back, Jane
            </h2>
            <Badge variant="outline" className="text-[11px] font-mono border-border">
              Phase 0 Foundation
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Workspace: <strong className="text-foreground">Acme Corp</strong> (Tenant ID: <code className="text-xs font-mono">org_demo_01</code>)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            Documentation
          </Button>
          <Button size="sm" className="text-xs">
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRIC_CARDS.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="hover:border-primary/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-foreground">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{metric.value}</div>
                <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <span>{metric.change}</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Status & Upcoming Roadmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phase Foundation Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">System Architecture Status</CardTitle>
                <CardDescription className="text-xs mt-1">
                  Active core subsystems and multi-tenant readiness
                </CardDescription>
              </div>
              <Badge variant="success" className="text-xs">
                Phase 0 Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/20">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-foreground">Multi-Tenant RLS Ready</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tenant boundary isolation configured for PostgreSQL. Client-supplied IDs will never be trusted.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/20">
              <Building2 className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-foreground">Three-Tier Role Hierarchy</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  RBAC specifications established for Employee, Manager, and CEO/Admin roles.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/20">
              <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-foreground">Next Phase Preparation</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Phase 1 will implement full Supabase Auth + Organization creation, member invitations, and password reset.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Workspace Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workspace Details</CardTitle>
            <CardDescription className="text-xs mt-1">
              Active tenant configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Organization</span>
              <span className="font-medium">Acme Corp</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">User Role</span>
              <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                CEO
              </Badge>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Active Team</span>
              <span className="font-medium">Engineering</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Mobile Shell</span>
              <span className="text-emerald-500 font-medium">360px+ Verified</span>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                <a href="/settings">Configure Workspace</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
