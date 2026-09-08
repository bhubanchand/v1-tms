# Database Schema & RLS Architecture — TMS

## 1. Schema Overview

TMS uses PostgreSQL hosted on Supabase with strict relational integrity, UUID primary keys, and comprehensive Row Level Security (RLS) enforcement.

```
                      +-------------------+
                      |    auth.users     | (Supabase Auth)
                      +-------------------+
                                | 1:1
                                v
                      +-------------------+
                      |     profiles      |
                      +-------------------+
                                |
             +------------------+------------------+
             |                                     |
             v                                     v
+------------------------+             +------------------------+
|     organizations      |             |  organization_members  |
+------------------------+             +------------------------+
             |                                     ^
             +------------------+------------------+
             |                  |
             v                  v
+------------------------+  +---------------------------+
|         teams          |  | organization_invitations  |
+------------------------+  +---------------------------+
             |
             v
+------------------------+
|      team_members      |
+------------------------+
```

---

## 2. Table Definitions

### 2.1 `profiles`
Extends `auth.users` with user display information.

```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    job_title TEXT,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_profiles_email ON public.profiles(email);
```

### 2.2 `organizations`
The root tenant unit. Every project, team, and task is bound to an organization.

```sql
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_organizations_slug ON public.organizations(slug);
```

### 2.3 `organization_members`
Maps users to organizations with their assigned RBAC role.

```sql
CREATE TYPE public.org_role AS ENUM ('employee', 'manager', 'ceo');

CREATE TABLE public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role public.org_role NOT NULL DEFAULT 'employee',
    joined_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE (organization_id, user_id)
);

CREATE INDEX idx_org_members_org_user ON public.organization_members(organization_id, user_id);
CREATE INDEX idx_org_members_user ON public.organization_members(user_id);
```

### 2.4 `teams`
Departments or cross-functional groups within an organization (e.g. Design, Engineering, Operations).

```sql
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE (organization_id, name)
);

CREATE INDEX idx_teams_organization ON public.teams(organization_id);
```

### 2.5 `team_members`
Maps members to teams within their organization.

```sql
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE (team_id, user_id)
);

CREATE INDEX idx_team_members_team ON public.team_members(team_id);
CREATE INDEX idx_team_members_user ON public.team_members(user_id);
```

### 2.6 `organization_invitations`
Tracks pending invitations sent to prospective members.

```sql
CREATE TABLE public.organization_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role public.org_role NOT NULL DEFAULT 'employee',
    token TEXT NOT NULL UNIQUE,
    invited_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_org_invitations_token ON public.organization_invitations(token);
CREATE INDEX idx_org_invitations_org_email ON public.organization_invitations(organization_id, email);
```

---

## 3. Row Level Security (RLS) Helper Functions & Policies

### 3.1 Security Helper Functions

```sql
-- Checks if auth.uid() belongs to the specified organization
CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.organization_members
        WHERE organization_id = org_id
        AND user_id = auth.uid()
    );
$$;

-- Checks if auth.uid() is a manager or CEO in the specified organization
CREATE OR REPLACE FUNCTION public.is_org_manager_or_admin(org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.organization_members
        WHERE organization_id = org_id
        AND user_id = auth.uid()
        AND role IN ('manager', 'ceo')
    );
$$;

-- Checks if auth.uid() is the CEO/admin of the specified organization
CREATE OR REPLACE FUNCTION public.is_org_ceo(org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.organization_members
        WHERE organization_id = org_id
        AND user_id = auth.uid()
        AND role = 'ceo'
    );
$$;
```

### 3.2 Core RLS Policies

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view profiles in their organizations"
    ON public.profiles FOR SELECT
    USING (
        id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.organization_members m1
            JOIN public.organization_members m2 ON m1.organization_id = m2.organization_id
            WHERE m1.user_id = auth.uid() AND m2.user_id = public.profiles.id
        )
    );

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (id = auth.uid());

-- ORGANIZATIONS
CREATE POLICY "Members can view their organizations"
    ON public.organizations FOR SELECT
    USING (public.is_org_member(id));

CREATE POLICY "Authenticated users can create organizations"
    ON public.organizations FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "CEOs can update their organization"
    ON public.organizations FOR UPDATE
    USING (public.is_org_ceo(id));

-- ORGANIZATION MEMBERS
CREATE POLICY "Members can view fellow members in same org"
    ON public.organization_members FOR SELECT
    USING (public.is_org_member(organization_id));

CREATE POLICY "Managers and CEOs can add or update members"
    ON public.organization_members FOR ALL
    USING (public.is_org_manager_or_admin(organization_id));

-- TEAMS
CREATE POLICY "Members can view teams in their organization"
    ON public.teams FOR SELECT
    USING (public.is_org_member(organization_id));

CREATE POLICY "Managers and CEOs can manage teams"
    ON public.teams FOR ALL
    USING (public.is_org_manager_or_admin(organization_id));
```
