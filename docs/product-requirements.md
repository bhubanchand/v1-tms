# Product Requirements Document (PRD) — Relay TMS

## 1. Product Vision

**Relay (Task & Team Management System)** is a modern, high-performance, multi-tenant B2B SaaS platform engineered for fast-moving product, engineering, and creative teams. It bridges the gap between high-level executive visibility and granular individual task execution through unified work tracking, team hierarchy management, contextual real-time collaboration, and actionable operational insights.

### Core Product Principle: Work-First & Anti-Surveillance
Relay intentionally **excludes** time tracking, timesheets, keystroke monitoring, or arbitrary capacity scores. All metrics reflect objective work deliverables:
- Open vs. completed tasks
- Tasks due this week and overdue items
- Blocked work requiring team lead intervention
- Real project milestone health backed by concrete reasons (e.g. *"Mobile App: At Risk — 5 overdue tasks · 2 blockers"*)
- Zero fake metrics or invented trends: if historical data is insufficient, display `—` or `"Not enough data"`.

---

## 2. Target Personas & Roles

| Persona / Role | Core Needs | Primary Workflows | Key UI Touchpoints |
| :--- | :--- | :--- | :--- |
| **Employee (Member)** | Clear prioritization, low friction updates, distraction-free execution. | Personal focus checklist, interactive completion, quick task editing via TaskSheet, team chat. | *Home (Focus view)*, *My Work*, *Chat*, *Project Board* |
| **Manager (Team Lead)** | Workload distribution, bottleneck detection, cross-member coordination, unblocking. | Reviewing blocked deliverables, managing sprint initiatives, team health oversight. | *Home (Engineering pulse)*, *Projects*, *People (Team view)*, *Chat* |
| **CEO / Admin (Executive)** | Macro organizational pulse, strategic milestone tracking, department health, governance. | Company pulse, executive intelligence digest, cross-team risk unblocking, settings. | *Home (Executive overview)*, *Insights*, *People*, *Settings* |

---

## 3. Core Functional Modules & Roadmap

### 3.1 Workspace Shell & Interaction Layer (Phase 0 — Completed)
- **4-Layer Depth Hierarchy**: Layer 0 (Ambient Canvas), Layer 1 (Content Surfaces), Layer 2 (Elevated Cards), Layer 3 (Floating Controls), Layer 4 (Overlays & Task Sheets).
- **Liquid Glass Primitives**: Subtle backdrop blur, layered depth, and inner top highlights.
- **Mobile Perfection**: Floating glass dock (`BottomNav`), thumb-zone Quick Create FAB, and responsive bottom sheets across 360px, 390px, and 430px viewports.
- **Desktop Ergonomics**: Persistent glass sidebar, topbar quick actions (`+ New`, `Cmd+K` command palette), and slide-over task drawers.
- **Interactive Task Sheet (`TaskSheet`)**: Tap any task across Home or My Work to edit title, status, priority, assignee, due date, or description.
- **Role-Aware Home Dashboard**: Tailored perspectives for Employee, Manager, and CEO answering *"What matters right now?"*.

### 3.2 Authentication & Organization Isolation (Phase 1 — Next)
- Multi-tenant tenant isolation at database level via Supabase Row Level Security (RLS).
- Email & password authentication with email verification and password reset flows.
- Organization creation upon onboarding; multi-organization membership support.
- Role-based Access Control (RBAC): Employee, Manager, CEO/Admin.
- Team structure within organizations (e.g., Engineering, Design, Growth) and team membership assignment.
- Invite mechanism for inviting teammates via email with role pre-assignment.

### 3.3 My Work & Tasks (Phase 2)
- Unified personal work dashboard aggregating assigned tasks across projects.
- Status workflows: Backlog, Todo, In Progress, Review, Completed, Blocked.
- Priority tagging: Urgent, High, Medium, Low.
- Due date tracking with visual indicator of overdue items.

### 3.4 Projects & Boards (Phase 3)
- Project creation with customizable views: Kanban Board, List View, Timeline/Gantt.
- Milestone tracking and progress computation with real health indicators.
- Team-level and cross-functional project scoping.

### 3.5 Team Collaboration & Chat (Phase 4)
- Contextual real-time channels: Project channels, Team channels, 1-on-1 direct messages.
- Embedded task references inside chat messages.

### 3.6 People & Directory (Phase 5)
- Organization roster with search and filter by team, role, and online status.
- User profile drawers showing roles, teams, and active task ownership.

### 3.7 Insights & Velocity (Phase 6)
- Task velocity, team throughput, cycle times, bottleneck identification.
- Executive summary export and milestone burndown charts.

### 3.8 AI Assistance & Automation (Phase 7)
- Automated sprint standup summarization.
- Intelligent workload balancing recommendations.
- Natural language queries across organization tasks and projects.

---

## 4. Non-Functional Requirements

- **Performance**: Sub-100ms client-side page transitions via Next.js App Router; Core Web Vitals (LCP < 2.0s, INP < 150ms, CLS < 0.05).
- **Mobile-First Responsiveness**: 100% usable on screen sizes starting from 360px width with touch targets of at least 44x44px.
- **Security & Data Isolation**: Zero data leakage between organizations. Database-enforced RLS policies verify user's active tenant membership on every query. Complete threat model documented in `/docs/security-threat-model.md`.
- **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation support, high contrast semantic color pairings.
- **Progressive Web App (PWA)**: Installable manifest, mobile splash/theme color, offline-resilient caching shell.
