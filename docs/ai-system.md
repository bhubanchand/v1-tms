# AI System Architecture & Capabilities Roadmap — TMS

## 1. Overview & Principles

TMS integrates AI capabilities to eliminate administrative overhead, surface delivery risks before deadlines pass, and empower teams to maintain high execution velocity.

### Core Tenancy & Privacy Safeguards
- **Zero Cross-Tenant Leakage**: AI inference prompts and embedding vectors are strictly scoped by `organization_id`. Tenant data is never used for foundation model fine-tuning.
- **Auditable Generation**: All AI-assisted actions (e.g. creating tasks from summaries, reassigning tasks) require human-in-the-loop review and confirmation.
- **Graceful Degradation**: Core application features remain 100% functional even if external AI APIs encounter latency spikes or rate limits.

---

## 2. Capability Matrix by Phase

| Feature | Description | Target User | Planned Phase |
| :--- | :--- | :--- | :---: |
| **Morning Focus Brief** | Synthesizes assigned tasks, overdue deadlines, and urgent chat mentions into a 3-bullet morning briefing. | Employee | Phase 7 |
| **Natural Language Task Creation** | Parses natural language input (e.g. *"Create high priority ticket for Sarah to fix auth bug by Friday"*) into structured task records. | All | Phase 7 |
| **Sprint Bottleneck Predictor** | Detects stalled cards on Kanban boards and flags potential deadline slippage to project managers. | Manager | Phase 7 |
| **Executive Org Health Digest** | Summarizes cross-team completion velocity, blockers, and milestone completion percentages. | CEO / Admin | Phase 7 |
| **Thread Summarizer** | Generates instant TL;DR summaries for long chat channels and comment threads. | All | Phase 7 |

---

## 3. Technical Integration Architecture

```
+-------------------------------------------------------------------------+
|                              Client Layer                               |
|       Floating AI Assist Trigger  |  Embedded Context Actions           |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                      Next.js Edge / Server Route                        |
|  - Authenticate session and extract verified organization_id            |
|  - Rate-limiting per organization subscription tier                     |
|  - Retrieve strictly tenant-isolated contextual records from Supabase   |
|  - Construct structured prompt with system guardrails                   |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                          LLM Provider Endpoint                          |
|  - Streaming response via Server-Sent Events (SSE) / AI SDK             |
|  - Structured outputs (JSON schema / tool calls) for task operations    |
+-------------------------------------------------------------------------+
```
