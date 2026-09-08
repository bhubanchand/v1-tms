"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CheckSquare,
  FolderKanban,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  Layers,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MAIN_NAV_ITEMS, SECONDARY_NAV_ITEMS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import type { OrgRole } from "@/types";

const ICON_MAP = {
  Home,
  CheckSquare,
  FolderKanban,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
};

export function Sidebar({ role = "ceo" }: { role?: OrgRole }) {
  const pathname = usePathname();

  const isRouteActive = (href: string, matchExact?: boolean) => {
    if (matchExact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-border/60 bg-card/40 backdrop-blur-md sticky top-0 shrink-0 select-none">
      {/* Organization Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Layers className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate leading-tight">Acme Corp</span>
            <span className="text-[11px] text-muted-foreground font-mono truncate">Workspace</span>
          </div>
        </div>
        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5">
          {role}
        </Badge>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Workspace Section */}
        <div>
          <div className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Workspace
          </div>
          <nav className="space-y-1">
            {MAIN_NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP];
              const active = isRouteActive(item.href, "matchExact" in item ? item.matchExact : false);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform group-hover:scale-105",
                        active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.title}</span>
                  </div>
                  {"badge" in item && item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded-full transition-colors",
                        active
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Management & Team Section */}
        <div>
          <div className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Organization
          </div>
          <nav className="space-y-1">
            {SECONDARY_NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP];
              const active = isRouteActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform group-hover:scale-105",
                        active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-border/60">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <Avatar fallback="JD" className="h-8 w-8 text-xs font-bold" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold truncate leading-tight">Jane Doe</span>
              <span className="text-[11px] text-muted-foreground truncate">jane@acme.inc</span>
            </div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </div>
      </div>
    </aside>
  );
}
