# Design System & UI Specification — TMS

## 1. Design Philosophy

TMS is designed with an aesthetic centered on **precision, minimalism, and high-velocity clarity**. Work management tools must reduce cognitive load, not amplify it.

- **High Information Density with Visual Breathing Room**: Clean card borders, subtle neutral surfaces, and generous whitespace.
- **Consistent Visual Hierarchy**: Consistent header sizes, semantic typography tokens, and predictable button styles.
- **Mobile-First Touch Ergonomics**: Minimum 44x44px touch targets on mobile, bottom-sheet interactions for single-hand phone usage, and thumb-friendly bottom navigation.

---

## 2. Color Tokens & Theme Architecture

The design system utilizes HSL-based CSS custom properties compatible with Tailwind CSS and shadcn/ui.

### 2.1 Light Theme Tokens
- `background`: `0 0% 100%` (`#ffffff`)
- `foreground`: `240 10% 3.9%` (`#09090b`)
- `card`: `0 0% 100%`
- `card-foreground`: `240 10% 3.9%`
- `popover`: `0 0% 100%`
- `popover-foreground`: `240 10% 3.9%`
- `primary`: `240 5.9% 10%` (`#18181b`)
- `primary-foreground`: `0 0% 98%` (`#fafafa`)
- `secondary`: `240 4.8% 95.9%` (`#f4f4f5`)
- `secondary-foreground`: `240 5.9% 10%`
- `muted`: `240 4.8% 95.9%`
- `muted-foreground`: `240 3.8% 46.1%` (`#71717a`)
- `accent`: `240 4.8% 95.9%`
- `accent-foreground`: `240 5.9% 10%`
- `destructive`: `0 84.2% 60.2%` (`#ef4444`)
- `destructive-foreground`: `0 0% 98%`
- `border`: `240 5.9% 90%` (`#e4e4e7`)
- `input`: `240 5.9% 90%`
- `ring`: `240 5.9% 10%`

### 2.2 Dark Theme Tokens
- `background`: `240 10% 3.9%` (`#09090b`)
- `foreground`: `0 0% 98%` (`#fafafa`)
- `card`: `240 10% 4.9%` (`#0c0c0e`)
- `card-foreground`: `0 0% 98%`
- `popover`: `240 10% 4.9%`
- `popover-foreground`: `0 0% 98%`
- `primary`: `0 0% 98%` (`#fafafa`)
- `primary-foreground`: `240 5.9% 10%` (`#18181b`)
- `secondary`: `240 3.7% 15.9%` (`#27272a`)
- `secondary-foreground`: `0 0% 98%`
- `muted`: `240 3.7% 15.9%`
- `muted-foreground`: `240 5% 64.9%` (`#a1a1aa`)
- `accent`: `240 3.7% 15.9%`
- `accent-foreground`: `0 0% 98%`
- `destructive`: `0 62.8% 30.6%`
- `destructive-foreground`: `0 0% 98%`
- `border`: `240 3.7% 15.9%` (`#27272a`)
- `input`: `240 3.7% 15.9%`
- `ring`: `240 4.9% 83.9%`

---

## 3. Responsive Breakpoints & Layout Specs

| Breakpoint | Width (px) | Application Shell Layout |
| :--- | :--- | :--- |
| **Mobile Min** | `360px` | Top bar (56px), Bottom nav (56px + safe-area), 100% fluid card width, single column. |
| **Mobile Standard** | `390px` | Top bar (56px), Bottom nav (56px + safe-area), fluid content, single column. |
| **Tablet** | `768px` (`md`) | Collapsible desktop sidebar (240px), Bottom nav hidden, top bar with search. |
| **Desktop** | `1024px` (`lg`)| Expanded sidebar (240px), multi-column grids (2–3 columns). |
| **Widescreen** | `1440px` (`2xl`)| Centered or maximized dashboard views with structured side panels (3–4 columns). |

---

## 4. Navigation Architecture

### 4.1 Desktop Sidebar (>= 768px)
- **Width**: `240px` (or `64px` collapsed)
- **Position**: Sticky left rail
- **Structure**:
  - Organization Badge & Switcher
  - Main Navigation: Home, My Work, Projects, Chat
  - Management Navigation: People, Insights
  - System Navigation: Settings, Help & Documentation
  - Current User Profile pill with status

### 4.2 Mobile Bottom Navigation (< 768px)
- **Height**: `56px` + `env(safe-area-inset-bottom)`
- **Position**: Fixed bottom rail (`z-40`)
- **Action Slots**:
  1. `Home` (Icon: Home)
  2. `My Work` (Icon: CheckSquare)
  3. `Projects` (Icon: FolderKanban)
  4. `Chat` (Icon: MessageSquare)
  5. `More` (Icon: Menu — opens slide-over sheet for People, Insights, Settings)

### 4.3 Application Top Bar
- **Height**: `56px`
- **Elements**: Current section breadcrumb / title, global search bar trigger (`Cmd+K`), notification bell, theme toggle, mobile menu toggle.
