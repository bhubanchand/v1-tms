# Testing Strategy & Quality Assurance — TMS

## 1. Quality Philosophy

A mission-critical team management system requires uncompromising standards for data isolation, runtime resilience, and multi-device usability. Our testing strategy follows a tiered pyramid:

```
                  / \
                 /   \       End-to-End & Security Isolation Tests
                / E2E \      (Browser walkthroughs, RLS leak tests)
               /-------\
              /         \    Integration & Route Guard Tests
             /Component  \   (AppShell responsiveness, auth guards)
            /-------------\
           /   Unit Tests  \ (Utils, date helpers, RBAC logic)
          /-----------------\
         / Static Validation \ (TypeScript strict mode, ESLint)
        +---------------------+
```

---

## 2. Test Suites & Commands

### 2.1 Static Analysis & Type Safety
- **Command**: `npm run build` or `npx tsc --noEmit`
- **Objective**: Ensure 0 type errors across all routes, components, and server actions under strict TypeScript rules.
- **Linting**: `npm run lint` ensures standard code formatting, unused import removal, and accessibility rule conformance.

### 2.2 Component & Responsive Layout Testing
- **Viewport Protocols**:
  - **Mobile 360px** (Galaxy S8 / Compact viewport):
    - Verify horizontal scroll is absent (`overflow-x: hidden`).
    - Verify top bar does not clip title or action icons.
    - Verify bottom navigation renders all 5 icons with touch targets >= 44x44px.
    - Verify content area padding prevents occlusion by the fixed bottom nav.
  - **Mobile 390px** (iPhone standard viewport):
    - Verify safe-area inset rendering at the bottom bar.
    - Verify cards and tables adapt to vertical stacked layouts.
  - **Tablet 768px**:
    - Verify transition from bottom nav to desktop sidebar.
  - **Desktop 1440px**:
    - Verify desktop sidebar persists on left rail.
    - Verify multi-column grid layouts expand appropriately without stretching text excessively.

---

## 3. Security & Multi-Tenant Isolation Testing

### 3.1 Tenant Data Leakage Verification
- **Test Objective**: User A in Organization 1 must never be able to view, query, or mutate records belonging to Organization 2.
- **Protocol**:
  1. Seed Database with User 1 (Org 1) and User 2 (Org 2).
  2. Perform client queries using User 1's JWT asking for records from Org 2.
  3. Assert PostgreSQL RLS returns 0 records and raises zero unhandled exceptions.
  4. Attempt direct mutations passing Org 2's ID. Assert RLS rejects the mutation with an unauthorized violation.

### 3.2 Role-Based Access Control Verification
- Verify `employee` cannot access admin endpoints (`/settings/organization`, invite member actions).
- Verify `manager` cannot delete an organization or remove the CEO.
- Verify unauthorized routes redirect gracefully to `/login` or display a clean 403 Forbidden screen.
