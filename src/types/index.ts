export type OrgRole = "employee" | "manager" | "ceo";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  job_title?: string | null;
  role: OrgRole;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string | number;
  matchExact?: boolean;
}
