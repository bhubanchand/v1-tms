# Security Threat Model & Defense-in-Depth Architecture — TMS

> **Security Statement**: No system is 100% immune to vulnerabilities. TMS implements rigorous defense-in-depth controls across every architectural layer (database, network, server, runtime, and client), continuously documents attack surfaces, and proactively outlines mitigations alongside residual risks.

---

## 1. System Architecture & Trust Boundaries

```
[ Untrusted Client (Browser/Mobile) ]
                |
                | HTTPS / TLS 1.3 + Strict CSP + Secure HTTP Cookies
                v
[ Next.js Edge / Server Boundary ]
  - Rate limiting & request fingerprinting
  - Zod server-side input sanitization
  - Session verification via Supabase SSR Cookies
  - Tenant context derived ONLY from verified session (Never from client params)
                |
                | Parameterized Queries / Supabase Client (Anon Key with User JWT)
                v
[ Database Boundary: PostgreSQL on Supabase ]
  - Row Level Security (RLS) enabled on 100% of tenant-owned tables
  - Default Deny policy on all tables
  - Tenant isolation: WHERE organization_id = get_user_org_id()
  - Zero client-supplied role trusting
```

---

## 2. Threat Matrix & Mitigations

| Threat | Risk Level | Attack Vector | Mitigation Strategy | Residual Risk & Monitoring |
| :--- | :---: | :--- | :--- | :--- |
| **Cross-Tenant Data Access** | **Critical** | Attacker tampers with `organization_id` in request query/body to read another org's data. | **1.** Never accept `organization_id` from client payloads.<br>**2.** Derive active org from server session.<br>**3.** PostgreSQL Row Level Security (RLS) on every table using `auth.uid()` lookup.<br>**4.** Default DENY on all tables. | Complex cross-table JOIN policies could contain logic bugs. Mitigate with automated RLS test suites on each migration. |
| **Privilege Escalation** | **Critical** | Member sends request with `role: "ceo"` or alters localStorage role state to execute admin actions. | **1.** Roles are stored exclusively in PostgreSQL `organization_members`.<br>**2.** Role checks are performed server-side on every Server Action/Route Handler.<br>**3.** UI role states are cosmetic only; mutations verify DB role. | Compromised service-role key could bypass RLS. Keep service key strictly server-side and never in source code. |
| **Insecure Direct Object References (IDOR)** | **High** | Attacker guesses or enumerates task/project/team UUIDs belonging to other organizations. | **1.** All queries filter by `organization_id` bound to current user.<br>**2.** RLS ensures querying an ID from another tenant yields `404 / 0 rows` regardless of query params.<br>**3.** Use v4 cryptographically random UUIDs. | Timing attacks on single row lookups. RLS policy evaluation time must be uniform. |
| **Unauthorized Team Access** | **Medium** | User attempts to read private team channels or tasks without team membership. | **1.** Explicit `team_members` junction table.<br>**2.** RLS policy enforces membership check for team-scoped resources. | Org admins retain super-view permissions; ensure audit logging on admin cross-team inspections. |
| **Cross-Site Scripting (XSS)** | **High** | Attacker inserts `<script>` or event handlers into chat messages, task descriptions, or profile names. | **1.** React JSX automatic HTML escaping by default.<br>**2.** Strict Content Security Policy (CSP) blocking `unsafe-inline` and `unsafe-eval`.<br>**3.** Zod input schema sanitization stripping raw HTML tags.<br>**4.** No `dangerouslySetInnerHTML` in codebase. | Third-party script injection or browser extension tampering. CSP `script-src 'self'` restricts executable domains. |
| **Cross-Site Request Forgery (CSRF)** | **Medium** | Malicious third-party website submits unauthorized state changes via authenticated user's browser. | **1.** Supabase session cookies use `SameSite=Lax` or `SameSite=Strict`.<br>**2.** Next.js Server Actions enforce Origin and Host header verification.<br>**3.** State-changing operations require POST/PATCH methods with JSON body. | Subdomain takeover or compromised cookie scope. Keep auth cookies pinned to top-level domain. |
| **SQL Injection (SQLi)** | **Critical** | Crafted inputs exploit dynamic SQL queries. | **1.** Supabase client uses parameterized queries via PostgREST.<br>**2.** Zero raw string-concatenated SQL queries in application code.<br>**3.** Helper PL/pgSQL functions strictly parameterized. | Vulnerabilities within database extensions. Keep Supabase PostgreSQL versions updated. |
| **Authentication & Brute Force** | **High** | Password spraying, dictionary attacks, credential stuffing on login or password reset. | **1.** Rate limiting on `/auth/login`, `/auth/signup`, and `/auth/reset-password`.<br>**2.** Supabase Auth built-in brute-force lockouts.<br>**3.** Minimum password complexity requirements (8+ chars, numbers, symbols). | Credential reuse from external breaches. Plan for MFA/TOTP in future phases. |
| **Session & Token Theft** | **High** | Attacker steals JWT or session token via network interception or physical access. | **1.** Strict HTTPS with HSTS (`Strict-Transport-Security`).<br>**2.** `HttpOnly`, `Secure`, `SameSite` flags on auth cookies.<br>**3.** Short-lived access JWTs (1 hour) with automatic token refresh. | Malicious software on client machine. Session invalidation on password change or explicit logout. |
| **Leaked Secrets & Exposed Service Role** | **Critical** | Developer commits `.env` with `SUPABASE_SERVICE_ROLE_KEY` or exposes it in `NEXT_PUBLIC_*`. | **1.** `.gitignore` strictly excludes `.env*` except `.env.example`.<br>**2.** Service role key is NEVER prefixed with `NEXT_PUBLIC_`.<br>**3.** CI secret scanners (e.g. GitHub secret scanning) enabled. | Compromise during local developer workstation compromise. Enforce principle of least privilege. |
| **Malicious File Uploads** | **High** | Attacker uploads executables (.exe, .sh, .svg containing JS) to project attachments or chat. | **1.** Whitelist allowed MIME types and file extensions.<br>**2.** Enforce strict 10MB file size cap.<br>**3.** Private Supabase Storage buckets with signed URLs.<br>**4.** Disallow executable execution via `Content-Disposition: attachment`. | Zero-day parser vulnerabilities in image processing libraries. Strip metadata on upload. |
| **Malicious Task / Chat Content** | **Medium** | Phishing links, deceptive markup, or spam flooding team channels. | **1.** Zod schema validates message length (max 4,000 characters).<br>**2.** Rate-limiting on message creation (max 30 msgs/min per user).<br>**3.** External links opened with `rel="noopener noreferrer"`. | Social engineering between employees. Org admins can moderate or delete spam. |
| **Prompt Injection against AI** | **High** | Attacker crafts task descriptions or chat messages with instructions to override AI system prompts. | **1.** AI prompts clearly delineate system instructions from untrusted data using markdown XML tags `<user_data>...</user_data>`.<br>**2.** AI is NEVER given privileged actions (cannot change roles, delete orgs, or bypass RLS).<br>**3.** AI only receives data already filtered by caller's RLS permissions. | Evolving jailbreak prompts. Documented in `/docs/ai-security.md`. |
| **Accidental Exposure of Private Employee Info** | **Medium** | Non-admin users view private employee phone numbers, salaries, or internal feedback. | **1.** Granular column selection in Supabase queries.<br>**2.** Strict RBAC separating employee public profiles from administrative records. | Application developer querying `SELECT *` by accident. Enforce explicit column lists in queries. |
| **Insecure Logging** | **Medium** | Passwords, tokens, or PII printed to server logs or client console. | **1.** Structured logger redacts sensitive keys (`password`, `token`, `key`, `secret`, `cookie`).<br>**2.** Production logs suppress verbose debug output. | Logs stored in third-party log providers. Restrict log access to authorized DevOps personnel. |
| **Overly Permissive Database Policies** | **Critical** | RLS policies written with `USING (true)` for convenience during development. | **1.** Strict policy review required on all migration files.<br>**2.** Automated CI tests verify tenant isolation by attempting cross-org reads.<br>**3.** No developer bypass flags in production schemas. | Subtle boolean logic flaws in complex policies. Keep policies modular and audited. |

---

## 3. Defense-in-Depth Verification Protocol

1. **Static Analysis**: TypeScript strict type checks and ESLint security plugins prevent unhandled error states and insecure patterns.
2. **HTTP Layer**: Mandatory security response headers configured in `next.config.mjs` (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Frame-Options).
3. **Application Layer**: Centralized Zod validation schemas (`src/lib/validation/schemas.ts`) validate all inputs before server logic executes.
4. **Data Layer**: PostgreSQL RLS policies enforce isolation independently of any application layer flaws.
