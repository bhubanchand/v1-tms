export const APP_NAME = "TMS";
export const APP_DESCRIPTION = "Task & Team Management System";

export const MAIN_NAV_ITEMS = [
  {
    title: "Home",
    href: "/",
    icon: "Home",
    matchExact: true,
  },
  {
    title: "My Work",
    href: "/my-work",
    icon: "CheckSquare",
    badge: "4",
  },
  {
    title: "Projects",
    href: "/projects",
    icon: "FolderKanban",
  },
  {
    title: "Chat",
    href: "/chat",
    icon: "MessageSquare",
    badge: "2",
  },
] as const;

export const SECONDARY_NAV_ITEMS = [
  {
    title: "People",
    href: "/people",
    icon: "Users",
  },
  {
    title: "Insights",
    href: "/insights",
    icon: "BarChart3",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings",
  },
] as const;
