import { z } from "zod";

/**
 * Strips dangerous HTML, script tags, and executable protocols from untrusted user text.
 */
export function sanitizeText(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "")
    .trim();
}

/**
 * Task Creation & Update Schema
 */
export const taskInputSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Task title must not exceed 200 characters")
    .transform(sanitizeText),
  description: z
    .string()
    .max(5000, "Description must not exceed 5,000 characters")
    .optional()
    .default("")
    .transform(sanitizeText),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  status: z.enum(["todo", "in_progress", "review", "completed", "blocked"]).default("todo"),
  due_date: z.string().datetime({ offset: true }).nullable().optional(),
  project_id: z.string().uuid("Invalid project ID"),
});

/**
 * Project Schema
 */
export const projectInputSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must not exceed 100 characters")
    .transform(sanitizeText),
  description: z
    .string()
    .max(2000, "Project description must not exceed 2,000 characters")
    .optional()
    .default("")
    .transform(sanitizeText),
  team_id: z.string().uuid("Invalid team ID").optional().nullable(),
});

/**
 * Team Creation Schema
 */
export const teamInputSchema = z.object({
  name: z
    .string()
    .min(1, "Team name is required")
    .max(80, "Team name must not exceed 80 characters")
    .transform(sanitizeText),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .default("")
    .transform(sanitizeText),
});

/**
 * Organization Creation & Settings Schema
 */
export const organizationInputSchema = z.object({
  name: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must not exceed 100 characters")
    .transform(sanitizeText),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(48, "Slug must not exceed 48 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

/**
 * Member Invitation Schema
 */
export const invitationInputSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  role: z.enum(["employee", "manager", "ceo"], {
    errorMap: () => ({ message: "Role must be employee, manager, or ceo" }),
  }),
});

/**
 * Profile Update Schema
 */
export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must not exceed 100 characters")
    .transform(sanitizeText),
  job_title: z
    .string()
    .max(80, "Job title must not exceed 80 characters")
    .optional()
    .nullable()
    .transform((val) => (val ? sanitizeText(val) : val)),
  avatar_url: z.string().url("Invalid avatar URL").optional().nullable(),
});

/**
 * Chat Message Schema
 */
export const chatMessageInputSchema = z.object({
  content: z
    .string()
    .min(1, "Message content cannot be empty")
    .max(4000, "Message cannot exceed 4,000 characters")
    .transform(sanitizeText),
  channel_id: z.string().uuid("Invalid channel ID"),
});

/**
 * Global Search Query Schema
 */
export const searchQuerySchema = z.object({
  query: z
    .string()
    .min(1, "Search query required")
    .max(120, "Query too long")
    .transform(sanitizeText),
  limit: z.number().int().min(1).max(50).default(20),
});
