"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CheckSquare,
  FolderKanban,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onOpenMore: () => void;
}

const BOTTOM_TABS = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    matchExact: true,
  },
  {
    title: "My Work",
    href: "/my-work",
    icon: CheckSquare,
    badge: "4",
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Chat",
    href: "/chat",
    icon: MessageSquare,
    badge: "2",
  },
] as const;

export function BottomNav({ onOpenMore }: BottomNavProps) {
  const pathname = usePathname();

  const isRouteActive = (href: string, matchExact?: boolean) => {
    if (matchExact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around h-14 px-1 max-w-lg mx-auto">
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const matchExact = "matchExact" in tab ? tab.matchExact : false;
          const active = isRouteActive(tab.href, matchExact);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full min-w-[56px] py-1 text-[11px] font-medium transition-colors touch-manipulation select-none",
                active
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} />
                {"badge" in tab && tab.badge && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="mt-1 truncate leading-none text-[10px]">{tab.title}</span>
              {active && (
                <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}

        {/* More Drawer Trigger */}
        <button
          onClick={onOpenMore}
          className="flex flex-col items-center justify-center flex-1 h-full min-w-[56px] py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors touch-manipulation select-none"
          aria-label="Open more menu"
        >
          <MoreHorizontal className="h-5 w-5" />
          <span className="mt-1 truncate leading-none text-[10px]">More</span>
        </button>
      </div>
    </nav>
  );
}
