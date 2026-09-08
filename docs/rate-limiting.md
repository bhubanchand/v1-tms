# Rate Limiting Architecture & Defense Strategy — TMS

## 1. Overview

Rate limiting protects TMS against brute-force credential stuffing, denial-of-service (DoS), resource exhaustion, spamming in team channels, and API abuse.

---

## 2. Rate Limiting Tiers & Thresholds

| Route Category | Target Endpoints | Rate Limit Policy | Window | Action on Violation |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | `/auth/login`, `/auth/signup`, `/auth/reset-password` | **5 requests** per IP / email | 15 minutes | HTTP 429 + Exponential backoff |
| **Invitations** | `/api/organizations/invite` | **10 invitations** per organization | 1 hour | HTTP 429 + Admin notification |
| **Chat & Messaging** | `/api/chat/messages` | **30 messages** per user | 1 minute | HTTP 429 + Client cooldown toast |
| **Task & Work Mutations** | `/api/tasks`, `/api/projects` | **60 mutations** per user | 1 minute | HTTP 429 |
| **AI Generation** | `/api/ai/summarize`, `/api/ai/suggest` | **10 requests** per user<br>**100 requests** per org | 1 hour | HTTP 429 + Quota notice |
| **File Uploads** | `/api/storage/upload` | **10 uploads** per user | 5 minutes | HTTP 429 |
| **Global Search** | `/api/search` | **60 queries** per user | 1 minute | HTTP 429 |

---

## 3. Implementation Strategy for Production

### 3.1 Edge / Server-Side Sliding Window (Upstash Redis / Vercel KV)
- In production, rate limiting operates at the Edge middleware layer using a **Sliding Window Counter** algorithm.
- Requests are tracked by `hash(IP + UserID + Route)`.

```typescript
// Architectural implementation pattern (Phase 1+):
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const authLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "@tms/auth",
});
```

### 3.2 Standard 429 Response Format
When a rate limit is exceeded, the server returns a standard structured JSON response:
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again in 420 seconds.",
  "retryAfter": 420
}
```
HTTP response headers include:
- `X-RateLimit-Limit`: Maximum allowed requests in window
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Unix timestamp when quota resets
- `Retry-After`: Seconds to wait before retrying
