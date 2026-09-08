# TMS — Task & Team Management System

A modern, high-performance, multi-tenant B2B SaaS platform engineered for fast-moving product, engineering, and creative teams.

## Tech Stack
- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui primitives
- **Database & Auth**: Supabase (PostgreSQL + RLS)
- **Theme**: Light / Dark mode with `next-themes`

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Documentation
See `/docs` for detailed architecture, requirements, database schemas, RBAC matrix, and deployment guides:
- [Product Requirements](./docs/product-requirements.md)
- [Architecture](./docs/architecture.md)
- [Database Schema & RLS](./docs/database-schema.md)
- [Roles & Permissions](./docs/roles-permissions.md)
- [Design System](./docs/design-system.md)
- [AI System Roadmap](./docs/ai-system.md)
- [Testing Strategy](./docs/testing-strategy.md)
- [Deployment](./docs/deployment.md)
