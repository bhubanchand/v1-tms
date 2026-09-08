# System Architecture Document — TMS

## 1. High-Level System Architecture

TMS is architected as a modern, reactive, multi-tenant cloud application built on Next.js App Router and Supabase (PostgreSQL + Auth + Realtime).

```
+-------------------------------------------------------------------------+
|                              Client Layer                               |
|   Desktop Browser (Sidebar + Topbar)    |   Mobile PWA (Bottom Nav)     |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                           Next.js App Router                            |
|  - Server Components (RSC): Zero bundle-cost layout, data prefetching   |
|  - Client Components: Interactive shell, responsive nav, local state    |
|  - Route Handlers / Server Actions: Authenticated mutations             |
|  - Middleware: Session validation & route guard                         |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                             Supabase BaaS                               |
|  - Auth: JWT sessions, email/password verification, secure cookies      |
|  - PostgreSQL: Relational schemas, constraints, foreign keys            |
|  - Row Level Security (RLS): Strict organization tenant isolation      |
|  - Realtime: WebSocket event streams for chat and task updates          |
|  - Storage: Project asset attachments, profile avatars                  |
+-------------------------------------------------------------------------+
```

---

## 2. Next.js Project Structure

The project strictly adheres to the standard Next.js App Router structure with modular separation:

```
src/
|-- app/
|   |-- (app)/                    # Protected application shell group
|   |   |-- layout.tsx            # AppShell container with nav & topbar
|   |   |-- page.tsx              # Home / Dashboard overview
|   |   |-- my-work/page.tsx      # Personal tasks
|   |   |-- projects/page.tsx     # Projects & boards
|   |   |-- chat/page.tsx         # Realtime team messaging
|   |   |-- people/page.tsx       # Org directory & teams
|   |   |-- insights/page.tsx     # Metrics & reports
|   |   `-- settings/page.tsx     # Workspace, profile, theme settings
|   |-- layout.tsx                # Root layout (fonts, providers, metadata)
|   |-- globals.css               # Tailwind CSS theme variables & base styles
|   `-- manifest.webmanifest      # PWA manifest
|-- components/
|   |-- layout/                   # App shell components (Sidebar, BottomNav, Topbar, CommandPalette)
|   |-- ui/                       # Reusable shadcn/ui primitives (Button, Card, etc.)
|   `-- providers/                # Theme and role perspective providers
|-- lib/
|   |-- supabase/                 # Supabase client & server factories
|   |   |-- client.ts             # Browser client (createBrowserClient)
|   |   `-- server.ts             # Server client (createServerClient)
|   |-- seed-data.ts              # Structured seed data for role-aware development
|   |-- utils.ts                  # Shared styling & utility helpers (cn)
|   `-- constants.ts              # Navigation configuration, system constants
`-- types/
    |-- database.ts               # Supabase generated database types
    `-- index.ts                  # Shared domain types
```

---

## 3. Server vs. Client Boundary Strategy

- **Server Components by Default**: All layout containers and page data fetchers render on the server to eliminate bundle size overhead and avoid layout shifts.
- **Client Components for Interactivity**:
  - `AppShell` and its navigation subcomponents (`Sidebar`, `BottomNav`, `Topbar`) maintain local UI state (collapsed sidebar state, mobile drawer visibility, active route highlighting).
  - Dialogs, dropdown menus, and interactive forms use client-side triggers.
- **Data Mutation Pattern**: Server Actions or API Route Handlers execute authenticated mutations with server-side validation (Zod) and revalidate paths with `revalidatePath`.

---

## 4. Multi-Tenant Security & Isolation Model

### 4.1 Tenancy Principles
1. **Never trust client-supplied tenant IDs**: The client cannot specify or alter the tenant context in query payloads.
2. **Server-side session resolution**: The authenticated user's active organization is derived from verified session cookies and database records.
3. **Database-enforced Row Level Security (RLS)**: Every tenant-owned table includes `organization_id NOT NULL REFERENCES organizations(id) ON DELETE CASCADE`. RLS policies inspect the authenticated user's JWT ID (`auth.uid()`) against `organization_members`.
4. **Zero Cross-Tenant Leakage**: Even if an API endpoint receives an arbitrary ID parameter, PostgreSQL RLS transparently filters out rows not belonging to the caller's organization.

---

## 5. Responsive Shell Architecture

The design system implements a mobile-first responsive architecture:
- **Mobile (< 768px)**:
  - Top header displays current section title, mobile menu trigger, and quick profile avatar.
  - Desktop sidebar is completely hidden (`hidden md:flex`).
  - Floating Liquid Glass dock (`BottomNav`) renders the 4 core actions (Home, My Work, Projects, Chat) plus a "More" trigger.
  - Floating Quick Create Action Button (`FAB`) positioned in thumb-accessible bottom right zone.
  - The "More" trigger opens a slide-over Sheet containing People, Insights, and Settings.
  - Content container has bottom padding (`pb-28`) to prevent dock occlusion.
  - Safe-area insets (`env(safe-area-inset-bottom)`) ensure compatibility with iOS/Android home bars.
- **Desktop (>= 768px)**:
  - Sidebar is persistently visible on the left with Liquid Glass translucency (`backdrop-blur-xl`), active indicators, and section grouping.
  - Bottom navigation bar is hidden (`md:hidden`).
  - Top header provides quick search (`Cmd+K`), `+ New` quick action button, notifications, and theme switcher.

### 5.1 4-Layer Depth Hierarchy
1. **Layer 0 (Canvas)**: Warm neutral mesh background (`bg-background` with ambient radial illumination).
2. **Layer 1 (Content Surfaces)**: Content cards and page panels with soft border and subtle blur.
3. **Layer 2 (Elevated Interaction Cards)**: Cards with top inner highlight border and hover lift.
4. **Layer 3 (Floating Controls)**: Floating mobile dock and Quick Create FAB.
5. **Layer 4 (Overlays & Task Sheets)**: Slide-over task inspector and command palette.

### 5.2 Task Interaction Architecture (`TaskSheet`)
- Tapping any task row throughout Home or My Work triggers the interactive `TaskSheet`.
- Responsive layout: Right-side 420px slide-over on desktop; bottom sheet with drag handle on mobile.
- Supports immediate inline editing of status, priority, assignee, due date, and notes.

---

## 6. Progressive Web App (PWA) Foundation

- Configured `manifest.json` defining `standalone` display, app icons, theme color, and background color.
- Viewport metadata configured with `viewportFit: "cover"` to utilize full edge-to-edge screen real estate on mobile devices.
- Foundation prepared for future service worker offline asset caching.

---

## 7. Role-Aware Dashboard Architecture

The dashboard supports role-specific content schemas answering *"What matters right now?"*:
- **Employee**: Scoped strictly to personal work items (`Today's Focus`, `Due Today`, `Overdue`, `Active Projects`) with interactive completion feedback.
- **Manager**: Scoped to team delivery health (`Engineering Pulse`, `Blocked Work`, `Overdue Work`, `Sprint Projects`).
- **CEO / Admin**: Scoped to organizational macro health (`Company Pulse`, `Executive Intelligence Digest`, `Needs Executive Attention`, `Strategic Projects with Contextual Health`, `Department Health`, `Milestones`).

### Anti-Surveillance & Deliverable-Based Metrics Guarantee
Relay deliberately avoids time tracking, timesheets, keystroke monitoring, and arbitrary capacity scoring. All telemetry represents tangible work units (tasks created, completed, blocked, and milestones achieved). If historical velocity data is insufficient, metrics display `—` or `"Not enough data"`. All developer debug clutter (tenant IDs, architecture debug tags, DB notices) is strictly prohibited from user-facing screens.
