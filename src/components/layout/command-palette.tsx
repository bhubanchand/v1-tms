"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  Home,
  CheckSquare,
  FolderKanban,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Shield,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRole?: (role: "employee" | "manager" | "ceo") => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Actions" | "Role Preview";
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  shortcut?: string;
}

export function CommandPalette({
  open,
  onOpenChange,
  onSelectRole,
}: CommandPaletteProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input when opened
  React.useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Global Cmd+K / Ctrl+K listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const COMMANDS: CommandItem[] = [
    {
      id: "nav-home",
      title: "Home / Overview",
      category: "Navigation",
      icon: Home,
      href: "/",
    },
    {
      id: "nav-my-work",
      title: "My Work",
      category: "Navigation",
      icon: CheckSquare,
      href: "/my-work",
    },
    {
      id: "nav-projects",
      title: "Projects & Boards",
      category: "Navigation",
      icon: FolderKanban,
      href: "/projects",
    },
    {
      id: "nav-chat",
      title: "Team Chat",
      category: "Navigation",
      icon: MessageSquare,
      href: "/chat",
    },
    {
      id: "nav-people",
      title: "People & Directory",
      category: "Navigation",
      icon: Users,
      href: "/people",
    },
    {
      id: "nav-insights",
      title: "Insights & Velocity",
      category: "Navigation",
      icon: BarChart3,
      href: "/insights",
    },
    {
      id: "nav-settings",
      title: "Workspace Settings",
      category: "Navigation",
      icon: Settings,
      href: "/settings",
    },
    {
      id: "action-theme",
      title: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      category: "Actions",
      icon: theme === "dark" ? Sun : Moon,
      action: () => setTheme(theme === "dark" ? "light" : "dark"),
    },
    {
      id: "role-employee",
      title: "Switch view to Employee",
      category: "Role Preview",
      icon: Shield,
      action: () => onSelectRole?.("employee"),
    },
    {
      id: "role-manager",
      title: "Switch view to Manager",
      category: "Role Preview",
      icon: Shield,
      action: () => onSelectRole?.("manager"),
    },
    {
      id: "role-ceo",
      title: "Switch view to CEO/Admin",
      category: "Role Preview",
      icon: Shield,
      action: () => onSelectRole?.("ceo"),
    },
  ];

  const filtered = COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cmd: CommandItem) => {
    onOpenChange(false);
    if (cmd.href) {
      router.push(cmd.href);
    } else if (cmd.action) {
      cmd.action();
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filtered.length - 1) : prev - 1
      );
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Palette Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className="relative z-50 w-full max-w-lg rounded-xl border border-border/80 bg-popover text-popover-foreground shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 border-b border-border/60 bg-muted/20">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInput}
            placeholder="Type a command or search sections..."
            className="h-12 w-full bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border/60 bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2 divide-y divide-border/30">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No matching commands or pages found.
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left",
                      isSelected
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={cn("h-4 w-4 shrink-0", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
                      <span className="truncate">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("text-[10px] opacity-70", isSelected ? "text-primary-foreground" : "text-muted-foreground")}>
                        {item.category}
                      </span>
                      {isSelected && <ArrowRight className="h-3 w-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border/40 bg-muted/10 text-[10px] text-muted-foreground">
          <span>Navigate with <kbd className="font-mono">↑</kbd> <kbd className="font-mono">↓</kbd></span>
          <span>Select with <kbd className="font-mono">↵</kbd></span>
        </div>
      </div>
    </div>
  );
}
