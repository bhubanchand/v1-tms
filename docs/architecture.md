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
|   |-- layout/                   # App shell components (Sidebar, BottomNav, Topbar)
|   |-- ui/                       # Reusable shadcn/ui primitives (Button, Card, etc.)
|   `-- providers/                # Theme and session providers
|-- lib/
|   |-- supabase/                 # Supabase client & server factories
|   |   |-- client.ts             # Browser client (createBrowserClient)
|   |   `-- server.ts             # Server client (createServerClient)
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
  - Fixed bottom navigation bar (`fixed bottom-0 left-0 right-0 z-40`) renders the 4 core actions (Home, My Work, Projects, Chat) plus a "More" trigger.
  - The "More" trigger opens a slide-over Sheet containing People, Insights, Settings, and Help.
  - Content container has bottom padding `pb-20` to prevent bottom nav occlusion.
  - Safe-area insets (`env(safe-area-inset-bottom)`) ensure compatibility with modern mobile OS home bars.
- **Desktop (>= 768px)**:
  - Sidebar is persistently visible on the left with clean icons, active indicators, and section grouping.
  - Bottom navigation bar is hidden (`hidden md:hidden`).
  - Top header provides search, notifications, organization switcher, and full user dropdown.

---

## 6. Progressive Web App (PWA) Foundation

- Configured `manifest.webmanifest` defining `standalone` display, app icons, theme color (`#09090b` dark, `#ffffff` light), and background color.
- Viewport metadata configured with `viewportFit: "cover"` to utilize full edge-to-edge screen real estate on mobile devices.
- Foundation prepared for future service worker offline asset caching.
