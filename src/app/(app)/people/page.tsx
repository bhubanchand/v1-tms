import { Users, UserPlus, Mail, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export default function PeoplePage() {
  const MEMBERS = [
    {
      name: "Jane Doe",
      email: "jane@acme.inc",
      role: "CEO",
      team: "Executive",
      status: "Active",
      fallback: "JD",
    },
    {
      name: "Alex Lee",
      email: "alex@acme.inc",
      role: "Manager",
      team: "Engineering Lead",
      status: "Active",
      fallback: "AL",
    },
    {
      name: "Marcus Vance",
      email: "marcus@acme.inc",
      role: "Employee",
      team: "Product Design",
      status: "Active",
      fallback: "MV",
    },
    {
      name: "Sarah Connor",
      email: "sarah@acme.inc",
      role: "Employee",
      team: "Core Infrastructure",
      status: "Invited",
      fallback: "SC",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            People & Teams
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage teammates, teams, and multi-tenant organization roles.
          </p>
        </div>
        <Button size="sm" className="text-xs self-start sm:self-auto">
          <UserPlus className="h-3.5 w-3.5 mr-1.5" />
          Invite Member
        </Button>
      </div>

      {/* Directory Table / Cards */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Organization Roster (4)</CardTitle>
            <Badge variant="outline" className="text-xs">
              Acme Corp
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Role changes and team assignments will be functional in Phase 1.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MEMBERS.map((member) => (
            <div
              key={member.email}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border/60 bg-card hover:border-primary/40 transition-colors gap-3"
            >
              <div className="flex items-center gap-3">
                <Avatar fallback={member.fallback} className="h-9 w-9" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    {member.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3 w-3" />
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-xs text-muted-foreground hidden md:inline-block">
                  {member.team}
                </span>
                <Badge
                  variant={
                    member.role === "CEO"
                      ? "default"
                      : member.role === "Manager"
                      ? "secondary"
                      : "outline"
                  }
                  className="text-[10px] font-bold uppercase"
                >
                  {member.role}
                </Badge>
                <Badge
                  variant={member.status === "Active" ? "success" : "warning"}
                  className="text-[10px]"
                >
                  {member.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
