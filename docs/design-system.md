# Design System Specification — Relay TMS

## 1. Design Philosophy: "Operating System for Work"

Relay moves away from generic, dark enterprise SaaS dashboards toward a **friendly, tactile, premium operating system for work**.

The design language fuses three core inspirations into an original visual system:
1. **Apple-Level Polish**: Soft dimensional layering, liquid glass translucency (`backdrop-filter: blur(20px)`), subtle inner top highlights (`inset 0 1px 0 0 rgba(...)`), and fluid spring transitions.
2. **Modern Material You Friendliness**: Expressive typography, generous rounded geometry (`rounded-2xl` to `rounded-3xl` / 16px to 24px), warm neutral foundations (warm charcoal and warm off-white instead of harsh pure black), and harmonious tonal badges.
3. **Linear-Level Simplicity**: Keyboard-first velocity (`Cmd+K`), zero visual clutter, deliverable-first workflows, and immediate tactile task interactions.

---

## 2. 4-Layer Depth Hierarchy

| Layer | Semantic Name | CSS Utility | Implementation Details |
| :--- | :--- | :--- | :--- |
| **Layer 0** | **Ambient Canvas** | `layer-canvas` | Warm neutral foundation with subtle ambient radial illumination mesh: `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary) / 0.06), transparent 70%)`. |
| **Layer 1** | **Content Surfaces** | `layer-surface` | Soft content surfaces (`bg-card/85 backdrop-blur-md border border-border/70 shadow-2xs`). |
| **Layer 2** | **Elevated Interaction Cards** | `layer-elevated` | Interactive cards with subtle top inner highlight: `box-shadow: inset 0 1px 0 0 var(--glass-highlight), 0 4px 20px -2px rgba(0,0,0,0.04)`. Lift on hover. |
| **Layer 3** | **Floating Controls** | `layer-floating` | Floating navigation dock, mobile Quick Create FAB (`fixed bottom-20 right-4 z-40`), and sticky action bars with Liquid Glass tokens. |
| **Layer 4** | **Overlays & Modals** | `layer-overlay` | Command Palette (`Cmd+K`), Quick Create modal, and interactive Task Detail Sheets (`TaskSheet`). |

---

## 3. Color Tokens & Theme Architecture

The design system utilizes HSL-based CSS custom properties compatible with Tailwind CSS and shadcn/ui.

### 3.1 Light Theme Tokens (Warm Off-White)
- `background`: `40 20% 98.5%` (`#faf9f6` — warm, soft canvas)
- `foreground`: `224 25% 12%` (`#161a24` — rich charcoal)
- `card`: `0 0% 100%` (`#ffffff`)
- `primary`: `226 70% 50%` (`#285ae6` — electric indigo)
- `secondary`: `40 15% 94%` (`#f2efe9` — warm subtle gray)
- `muted`: `40 15% 94%`
- `muted-foreground`: `220 10% 46%` (`#68707d`)
- `destructive`: `0 74% 54%` (`#e53935` — gentle coral red)
- `border`: `220 14% 90%` (`#e3e6eb` — crisp subtle border)
- `radius`: `1rem` (16px)

### 3.2 Dark Theme Tokens (Deep Warm Charcoal)
- `background`: `225 18% 7.5%` (`#0f1219` — deep warm navy-charcoal, never harsh pure black)
- `foreground`: `210 25% 96%` (`#f3f5f9` — soft readable white)
- `card`: `225 16% 10.5%` (`#151923` — elevated surface)
- `primary`: `226 80% 64%` (`#537ff8` — luminous friendly indigo)
- `secondary`: `225 14% 15%` (`#1f2433`)
- `muted`: `225 14% 14%`
- `muted-foreground`: `217 14% 63%` (`#939cb0`)
- `border`: `225 14% 16.5%` (`#222838` — subtle calm border)

### 3.3 Liquid Glass Tokens
```css
/* Light Mode */
--glass-bg: rgba(255, 255, 255, 0.78);
--glass-border: rgba(220, 224, 232, 0.7);
--glass-highlight: rgba(255, 255, 255, 0.9);
--glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);

/* Dark Mode */
--glass-bg: rgba(21, 25, 35, 0.75);
--glass-border: rgba(255, 255, 255, 0.09);
--glass-highlight: rgba(255, 255, 255, 0.07);
--glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.35);
```

---

## 4. Tactile Micro-Interactions & Components

### 4.1 Interactive Task Detail Sheet (`TaskSheet`)
- **Desktop**: Smooth slide-over drawer anchored to right viewport (420px width).
- **Mobile**: Responsive bottom sheet (`rounded-t-3xl`) with swipe handle and safe-area insets.
- **Editable Properties**:
  - Title: Inline editable on click with auto-save.
  - Status: Interactive chip toggle (`To Do`, `In Progress`, `In Review`, `Completed`).
  - Priority: Colored chip toggle (`Low`, `Medium`, `High`, `Urgent`).
  - Assignee: User avatar + name.
  - Due Date: Real deadline indicator with overdue badge.
  - Completion: Satisfying tactile checkmark animation with strikethrough.

### 4.2 Global Quick Create (`QuickCreate`)
- **Mobile Thumb Zone**: Floating Action Button (FAB) anchored at `bottom-20 right-4` (`z-40`), perfectly positioned above bottom navigation for single-thumb trigger.
- **Desktop Top Bar**: Integrated `+ New` button beside search bar and `Cmd+K` palette trigger.
- **Modal Creation**: Quickly create tasks or projects with instant feedback.

### 4.3 Floating Mobile Dock (`BottomNav`)
- Translucent floating pill dock (`max-w-md mx-auto rounded-2xl bg-card/90 backdrop-blur-xl border border-border/80 shadow-xl mb-1.5`).
- Active pill indicator underneath active tab.
- WCAG compliant touch targets (>= 48px width, 56px height).

---

## 5. Responsive Breakpoints & Ergonomics

| Breakpoint | Width | Shell & Navigation Layout |
| :--- | :--- | :--- |
| **Mobile Min** | `360px` | Top bar (56px), Floating Dock (56px), Quick Create FAB, full width fluid cards. |
| **Mobile Standard** | `390px` | Top bar, Floating Dock, Bottom Sheet drawers, thumb-zone controls. |
| **Mobile Large** | `430px` | Edge-to-edge content with comfortable 16px margins. |
| **Tablet** | `768px` (`md`) | Collapsible desktop sidebar (256px), Topbar with search & `+ New`, 2-column grids. |
| **Desktop** | `1024px` (`lg`) | Persistent glass sidebar, multi-column dashboard, slide-over task sheets. |
| **Widescreen** | `1440px` (`2xl`)| Centered 1280px container with generous breathing room. |
