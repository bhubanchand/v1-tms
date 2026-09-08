"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

const ROUTE_TITLES: Record<string, string> = {
  "/": "Overview",
  "/my-work": "My Work",
  "/projects": "Projects",
  "/chat": "Team Chat",
  "/people": "Directory & Teams",
  "/insights": "Insights & Velocity",
  "/settings": "Workspace Settings",
};

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const pathname = usePathname();
  const currentTitle = ROUTE_TITLES[pathname] || "Workspace";

  return (
    <header className="h-14 border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-30 px-4 flex items-center justify-between transition-colors">
      {/* Left: Mobile Drawer Trigger + Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-foreground tracking-tight">
            {currentTitle}
          </h1>
          <span className="hidden sm:inline-block text-xs text-muted-foreground/60">/</span>
          <span className="hidden sm:inline-block text-xs text-muted-foreground">Acme Corp</span>
        </div>
      </div>

      {/* Right: Search, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2">
        {/* Quick Search Trigger */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-muted-foreground text-xs hover:border-border cursor-pointer transition-colors">
          <Search className="h-3.5 w-3.5" />
          <span>Quick search...</span>
          <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        {/* Notifications Placeholder */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground relative"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Mobile Profile Avatar */}
        <div className="md:hidden">
          <Avatar fallback="JD" className="h-7 w-7 text-xs font-bold" />
        </div>
      </div>
    </header>
  );
}
