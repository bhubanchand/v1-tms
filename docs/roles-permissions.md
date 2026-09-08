# Roles & Permissions Specification (RBAC) — TMS

## 1. Role Hierarchy

TMS enforces a multi-tiered Role-Based Access Control (RBAC) model scoped strictly to each organization:

```
          +-------------------------+
          |      CEO / Admin        |  Highest privilege level within an organization
          +-------------------------+
                       |
                       v
          +-------------------------+
          |        Manager          |  Team lead & project coordinator level
          +-------------------------+
                       |
                       v
          +-------------------------+
          |        Employee         |  Individual contributor / team member level
          +-------------------------+
```

---

## 2. Granular Permissions Matrix

| Domain / Resource | Action | Employee | Manager | CEO / Admin |
| :--- | :--- | :---: | :---: | :---: |
| **Organization** | View details | Yes | Yes | Yes |
| | Update name / logo / branding | No | No | **Yes** |
| | View billing / subscription | No | No | **Yes** |
| | Delete organization | No | No | **Yes** |
| **Members & Invites** | View directory | Yes | Yes | Yes |
| | Invite new members | No | **Yes** | **Yes** |
| | Change member role to Manager | No | No | **Yes** |
| | Remove members | No | No | **Yes** |
| **Teams** | View teams & members | Yes | Yes | Yes |
| | Create new team | No | **Yes** | **Yes** |
| | Add / remove team members | No | **Yes** (Own team) | **Yes** (All teams) |
| | Delete / archive team | No | No | **Yes** |
| **Projects** | View org projects | Yes | Yes | Yes |
| | Create project | No | **Yes** | **Yes** |
| | Edit project metadata & budget | No | **Yes** (Own project) | **Yes** (All projects) |
| | Delete project | No | No | **Yes** |
| **Tasks & Work** | View tasks | Yes | Yes | Yes |
| | Create & assign tasks | Yes | Yes | Yes |
| | Update status of assigned tasks | Yes | Yes | Yes |
| | Reassign / cancel any task | No | **Yes** | **Yes** |
| **Insights** | Personal productivity metrics | Yes | Yes | Yes |
| | Team throughput & velocity | No | **Yes** (Own team) | **Yes** (All teams) |
| | Executive org-wide analytics | No | No | **Yes** |

---

## 3. Enforcement Layers

### 3.1 Layer 1: Database Row Level Security (RLS)
The database is the ultimate authority. No client query or API route can bypass PostgreSQL RLS policies. Even if a compromised client requests rows from another organization or tries to alter a record without permission, PostgreSQL returns an empty set or raises a permission error.

### 3.2 Layer 2: Server Actions & Route Handlers
Every server-side endpoint validates permissions prior to executing mutations:
```typescript
// Example: Server-side role guard pattern
export async function assertUserRole(orgId: string, allowedRoles: OrgRole[]) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (!member || !allowedRoles.includes(member.role)) {
    throw new Error("Forbidden: Insufficient organization privileges");
  }

  return { user, role: member.role };
}
```

### 3.3 Layer 3: Client UI Adaptation
The UI conditionally renders action buttons (e.g. "Invite Member", "Create Team", "Organization Settings") based on the verified role passed down from Server Components.
- Disabled buttons provide informative tooltips (e.g. *"Only Managers or CEOs can create teams"*).
- Direct URL access to unauthorized pages renders a 403 Forbidden state with a fallback redirect.
