"use client";

import * as React from "react";
import { UserPlus, Mail, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";

interface Member {
  name: string;
  email: string;
  role: "CEO" | "Manager" | "Employee";
  team: string;
  status: "Active" | "Invited";
  fallback: string;
}

const MEMBERS: Member[] = [
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

export default function PeoplePage() {
  const [search, setSearch] = React.useState("");

  const filtered = MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.team.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            People & Teams
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Organization directory, team groupings, and role governance.
          </p>
        </div>
        <Button size="sm" className="text-xs self-start sm:self-auto">
          <UserPlus className="h-3.5 w-3.5 mr-1.5" />
          Invite Teammate
        </Button>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teammates by name, email, or team..."
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Directory List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No teammates found."
          description={`No members matching "${search}".`}
        />
      ) : (
        <div className="divide-y divide-border/60 border border-border/60 rounded-xl bg-card overflow-hidden">
          {filtered.map((member) => (
            <div
              key={member.email}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-muted/30 transition-colors gap-3"
            >
              <div className="flex items-center gap-3">
                <Avatar fallback={member.fallback} className="h-9 w-9 text-xs font-semibold" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    {member.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Mail className="h-3 w-3" />
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                <span className="text-xs text-muted-foreground hidden sm:inline">
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
                  className="text-[10px] font-semibold uppercase"
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
        </div>
      )}
    </div>
  );
}
