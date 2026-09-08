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
  ChevronDown,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MAIN_NAV_ITEMS, SECONDARY_NAV_ITEMS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { BrandLogo } from "@/components/ui/brand-logo";
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
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-border/70 bg-card/60 backdrop-blur-md sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border/60">
        <BrandLogo size="md" />
        <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5">
          {role}
        </Badge>
      </div>

      {/* Workspace Selector Bar */}
      <div className="px-3 pt-3 pb-1">
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-border/50 bg-background/60 text-xs hover:border-border cursor-pointer transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="font-medium text-foreground truncate">Acme Corp</span>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
        </div>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {/* Workspace Section */}
        <div>
          <div className="px-2.5 mb-1.5 text-[11px] font-medium text-muted-foreground">
            Workspace
          </div>
          <nav className="space-y-0.5">
            {MAIN_NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP];
              const active = isRouteActive(item.href, "matchExact" in item ? item.matchExact : false);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-all",
                    active
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70 font-medium"
                  )}
                >
                  <div className="flex items-center gap-2.5">
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
                        "text-[10px] font-semibold px-1.5 py-0.2 rounded-full transition-colors",
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
          <div className="px-2.5 mb-1.5 text-[11px] font-medium text-muted-foreground">
            Management
          </div>
          <nav className="space-y-0.5">
            {SECONDARY_NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP];
              const active = isRouteActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-all",
                    active
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70 font-medium"
                  )}
                >
                  <div className="flex items-center gap-2.5">
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
              <Avatar
                fallback={role === "ceo" ? "JD" : role === "manager" ? "AL" : "MV"}
                className="h-8 w-8 text-xs font-semibold"
              />
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-foreground truncate leading-tight">
                {role === "ceo" ? "Jane Doe" : role === "manager" ? "Alex Lee" : "Marcus Vance"}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                {role === "ceo" ? "jane@acme.inc" : role === "manager" ? "alex@acme.inc" : "marcus@acme.inc"}
              </span>
            </div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </div>
      </div>
    </aside>
  );
}
