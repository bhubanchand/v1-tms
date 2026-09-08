"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  BarChart3,
  Settings,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sheet } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const pathname = usePathname();

  // Close drawer on route navigation
  React.useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  const MORE_ITEMS = [
    {
      title: "People & Directory",
      description: "Organization roster and team structure",
      href: "/people",
      icon: Users,
    },
    {
      title: "Insights & Velocity",
      description: "Throughput metrics and milestone health",
      href: "/insights",
      icon: BarChart3,
    },
    {
      title: "Workspace Settings",
      description: "Manage teams, roles, and preferences",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased">
      {/* Desktop Sidebar (Persistent left rail, hidden on mobile) */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Topbar onOpenMobileMenu={() => setMobileDrawerOpen(true)} />

        {/* Dynamic Page Content with bottom padding for mobile navigation */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>

        {/* Mobile Bottom Navigation (Visible only on < 768px screens) */}
        <BottomNav onOpenMore={() => setMobileDrawerOpen(true)} />
      </div>

      {/* Mobile Drawer (More menu & Quick Actions) */}
      <Sheet
        open={mobileDrawerOpen}
        onOpenChange={setMobileDrawerOpen}
        side="bottom"
        title="Workspace Menu"
        description="Acme Corp — Multi-tenant TMS"
      >
        <div className="space-y-4 pb-6">
          {/* Active User Card in Drawer */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/30">
            <div className="flex items-center gap-3">
              <Avatar fallback="JD" className="h-9 w-9" />
              <div>
                <p className="text-xs font-semibold text-foreground">Jane Doe</p>
                <p className="text-[11px] text-muted-foreground">jane@acme.inc</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-[10px] font-bold uppercase">
              CEO
            </Badge>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-1">
              Organization
            </div>
            {MORE_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-all text-xs",
                    active
                      ? "border-primary/50 bg-primary/5 text-primary font-medium"
                      : "border-border/60 bg-card hover:bg-muted text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              );
            })}
          </div>

          {/* Security & Isolation Pill */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span>Multi-tenant RLS active. Tenant isolated.</span>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
