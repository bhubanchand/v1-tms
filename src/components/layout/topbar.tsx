"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, Menu, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BrandLogo } from "@/components/ui/brand-logo";
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface TopbarProps {
  onOpenMobileMenu?: () => void;
  onOpenSearch?: () => void;
  onQuickCreate?: () => void;
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

export function Topbar({ onOpenMobileMenu, onOpenSearch, onQuickCreate }: TopbarProps) {
  const pathname = usePathname();
  const currentTitle = ROUTE_TITLES[pathname] || "Workspace";

  return (
    <header className="h-14 border-b border-border/70 bg-background/85 backdrop-blur-md sticky top-0 z-30 px-4 flex items-center justify-between transition-colors">
      {/* Left: Mobile Brand & Title / Desktop Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Mobile Brand Mark */}
        <div className="md:hidden flex items-center">
          <BrandLogo size="sm" />
        </div>

        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 min-w-0">
          <span className="text-xs text-muted-foreground font-medium">Acme Corp</span>
          <span className="text-xs text-muted-foreground/50">/</span>
          <h1 className="text-sm font-semibold text-foreground tracking-tight truncate">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Right: New, Search, Notifications, Theme, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Desktop Quick New Action */}
        {onQuickCreate && (
          <Button
            size="sm"
            onClick={onQuickCreate}
            className="hidden sm:flex items-center gap-1 h-8 px-2.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs pressable"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New</span>
          </Button>
        )}

        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSearch}
          className="sm:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Desktop Quick Search Trigger */}
        <div
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border/60 bg-muted/40 text-muted-foreground text-xs hover:border-border cursor-pointer transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search or jump to...</span>
          <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-2xs">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        {/* Notifications Popover */}
        <DropdownMenu
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground relative"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" />
            </Button>
          }
        >
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="p-4 text-center">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mx-auto mb-2 text-muted-foreground">
              <Check className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-xs font-medium text-foreground">You&apos;re caught up ✨</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">No unread notifications</p>
          </div>
        </DropdownMenu>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Avatar */}
        <div className="md:hidden">
          <Avatar fallback="JD" className="h-7 w-7 text-xs font-semibold" />
        </div>
      </div>
    </header>
  );
}
