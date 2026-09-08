import type { OrgRole } from "@/types";

export interface DashboardMetric {
  title: string;
  value: string | number;
  change?: string;
  status?: "default" | "warning" | "destructive" | "success";
  description?: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  role: OrgRole;
}

export interface RoleDashboardConfig {
  role: OrgRole;
  roleLabel: string;
  roleDescription: string;
  metrics: DashboardMetric[];
  prioritySections: {
    title: string;
    description: string;
    items: {
      id: string;
      title: string;
      subtitle: string;
      badge: string;
      badgeVariant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
    }[];
  }[];
}

export const SEED_ORGANIZATION = {
  id: "org_demo_01",
  name: "Acme Corp",
  slug: "acme",
  logo_url: null,
};

export const SEED_USERS = [
  {
    id: "usr_ceo",
    email: "jane@acme.inc",
    full_name: "Jane Doe",
    role: "ceo" as OrgRole,
    title: "Chief Executive Officer",
  },
  {
    id: "usr_mgr",
    email: "alex@acme.inc",
    full_name: "Alex Lee",
    role: "manager" as OrgRole,
    title: "Engineering Lead",
  },
  {
    id: "usr_emp",
    email: "marcus@acme.inc",
    full_name: "Marcus Vance",
    role: "employee" as OrgRole,
    title: "Frontend Engineer",
  },
];

export const ROLE_DASHBOARDS: Record<OrgRole, RoleDashboardConfig> = {
  employee: {
    role: "employee",
    roleLabel: "Employee / Individual Contributor",
    roleDescription: "Focus on personal tasks, upcoming deadlines, and active project deliverables.",
    metrics: [
      {
        title: "My Open Tasks",
        value: 5,
        change: "2 in progress",
        status: "default",
      },
      {
        title: "Due Today",
        value: 2,
        change: "Needs attention",
        status: "warning",
      },
      {
        title: "Overdue",
        value: 1,
        change: "1 day overdue",
        status: "destructive",
      },
      {
        title: "Active Projects",
        value: 3,
        change: "Core Platform, Design System",
        status: "default",
      },
    ],
    prioritySections: [
      {
        title: "My Tasks",
        description: "Work items assigned directly to you",
        items: [
          {
            id: "TSK-201",
            title: "Implement Command Palette (Cmd+K) shortcut",
            subtitle: "Design System · Due Today",
            badge: "Due Today",
            badgeVariant: "warning",
          },
          {
            id: "TSK-202",
            title: "Refactor dashboard metrics to role-aware seed schema",
            subtitle: "Core Architecture · In Progress",
            badge: "In Progress",
            badgeVariant: "default",
          },
          {
            id: "TSK-203",
            title: "Audit 360px viewport touch target sizes",
            subtitle: "Mobile Polish · Overdue",
            badge: "Overdue",
            badgeVariant: "destructive",
          },
        ],
      },
      {
        title: "Recent Activity",
        description: "Latest updates on your assigned items",
        items: [
          {
            id: "ACT-101",
            title: "Alex Lee reviewed TSK-198",
            subtitle: "Core Infrastructure · 25m ago",
            badge: "Review",
            badgeVariant: "secondary",
          },
          {
            id: "ACT-102",
            title: "New comment on Mobile Shell navigation",
            subtitle: "Design System · 1h ago",
            badge: "Comment",
            badgeVariant: "secondary",
          },
        ],
      },
    ],
  },
  manager: {
    role: "manager",
    roleLabel: "Manager / Team Lead",
    roleDescription: "Oversee team tasks, unblock team members, and monitor delivery commitments.",
    metrics: [
      {
        title: "Team Tasks",
        value: 28,
        change: "18 in progress",
        status: "default",
      },
      {
        title: "Team Overdue Work",
        value: 3,
        change: "Across 2 projects",
        status: "destructive",
      },
      {
        title: "Blocked Work",
        value: 2,
        change: "Requires review",
        status: "warning",
      },
      {
        title: "Project Health",
        value: "92%",
        change: "4 of 5 on track",
        status: "success",
      },
    ],
    prioritySections: [
      {
        title: "Blocked & Critical Team Items",
        description: "Items needing lead intervention or unblocking",
        items: [
          {
            id: "TSK-189",
            title: "PostgreSQL connection pool exhaustion during peak writes",
            subtitle: "Infrastructure · Blocked on Supabase Tier",
            badge: "Blocked",
            badgeVariant: "destructive",
          },
          {
            id: "TSK-194",
            title: "Cross-tenant RLS policy test suite verification",
            subtitle: "Security · Awaiting Review",
            badge: "Review",
            badgeVariant: "warning",
          },
        ],
      },
      {
        title: "Team Activity",
        description: "Recent updates across engineering & design",
        items: [
          {
            id: "ACT-201",
            title: "Marcus Vance marked TSK-190 as completed",
            subtitle: "Design System · 12m ago",
            badge: "Done",
            badgeVariant: "success",
          },
          {
            id: "ACT-202",
            title: "Sarah Connor created task 'Database migration 002'",
            subtitle: "Core Platform · 45m ago",
            badge: "Created",
            badgeVariant: "secondary",
          },
        ],
      },
    ],
  },
  ceo: {
    role: "ceo",
    roleLabel: "CEO / Executive",
    roleDescription: "High-level company work status, project milestones, and cross-team health.",
    metrics: [
      {
        title: "Open Tasks",
        value: 64,
        change: "Across all teams",
        status: "default",
      },
      {
        title: "Tasks Due This Week",
        value: 19,
        change: "85% on schedule",
        status: "default",
      },
      {
        title: "Completed Tasks",
        value: 142,
        change: "+31 this sprint",
        status: "success",
      },
      {
        title: "Active Projects",
        value: 6,
        change: "All departments",
        status: "default",
      },
    ],
    prioritySections: [
      {
        title: "Executive Summary & Key Milestones",
        description: "High-level delivery tracking across organizational goals",
        items: [
          {
            id: "MIL-01",
            title: "Phase 0 Shell & System Architecture",
            subtitle: "Engineering · 100% Complete",
            badge: "Completed",
            badgeVariant: "success",
          },
          {
            id: "MIL-02",
            title: "Phase 1 Multi-Tenant Auth & Teams",
            subtitle: "Engineering & Security · Ready for kickoff",
            badge: "Upcoming",
            badgeVariant: "secondary",
          },
          {
            id: "MIL-03",
            title: "Q4 Customer Pilot Onboarding",
            subtitle: "Product & Operations · In Planning",
            badge: "Planning",
            badgeVariant: "outline",
          },
        ],
      },
      {
        title: "Department & Project Health",
        description: "Status breakdown by functional area",
        items: [
          {
            id: "DEP-01",
            title: "Engineering (12 Members)",
            subtitle: "28 Active Tasks · 0 Critical Blockers",
            badge: "Healthy",
            badgeVariant: "success",
          },
          {
            id: "DEP-02",
            title: "Design (4 Members)",
            subtitle: "14 Active Tasks · Design System stable",
            badge: "Healthy",
            badgeVariant: "success",
          },
        ],
      },
    ],
  },
};
