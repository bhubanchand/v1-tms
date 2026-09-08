# Deployment & DevOps Guide — TMS

## 1. Hosting Architecture

TMS is optimized for cloud deployment with:
- **Frontend & Edge API**: [Vercel](https://vercel.com) (Global Edge Network, Next.js native optimization)
- **Database & Auth**: [Supabase](https://supabase.com) (Managed PostgreSQL, Auth, Realtime, Storage)

---

## 2. Environment Variables Specification

The application requires the following environment variables. Maintain identical keys in Vercel project settings and `.env.local`:

```bash
# ==============================================================================
# SUPABASE CONFIGURATION
# ==============================================================================
# Public project URL (accessible on client & server)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Public anonymous key (used for client-side queries protected by RLS)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional service role key (strictly server-side for administrative tasks, NEVER expose to client)
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ==============================================================================
# APPLICATION SETTINGS
# ==============================================================================
NEXT_PUBLIC_APP_URL=https://tms.yourdomain.com
NEXT_PUBLIC_APP_ENV=production
```

---

## 3. Database Migration Management

All schema changes are tracked via version-controlled SQL migration files using the Supabase CLI:

```bash
# Initialize Supabase configuration locally (if using CLI)
npx supabase init

# Link to remote project
npx supabase link --project-ref <project-id>

# Generate migration from schema diff
npx supabase db diff -f add_teams_table

# Apply migrations to remote production database
npx supabase db push
```

---

## 4. CI / CD Pipeline

Recommended GitHub Actions workflow on `main` branch pushes:

1. **Lint & Type Check**:
   ```bash
   npm run lint
   npx tsc --noEmit
   ```
2. **Build Verification**:
   ```bash
   npm run build
   ```
3. **Automated Preview Deployment**: Vercel automatically generates preview deployments for every Pull Request.
4. **Production Promotion**: Merges to `main` trigger zero-downtime production deployment.
