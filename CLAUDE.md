# ProjectPulse — Project Management Dashboard

## Purpose
A personal project management dashboard for software engineers to track progress across multiple projects, manage tasks, monitor deadlines, log time, and measure performance. Built with a SaaS-ready architecture so other employees can deploy their own instance.

## Mission
Empower individual contributors and team leads with a unified view of their project portfolio — replacing scattered spreadsheets, sticky notes, and siloed tools with a single, beautiful, dark-themed command center.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | React 18 (Vite) |
| Routing | React Router v6 |
| Styling | Tailwind CSS v4 + Material UI v6 |
| Animations | Framer Motion |
| Charts | Recharts (planned) |
| Fonts | Inter (body), Plus Jakarta Sans (headings) |
| Date Utilities | date-fns |
| Build Tool | Vite 8 |

## Folder Structure
```
src/
├── assets/              # Static images, icons
├── components/
│   ├── common/          # Reusable UI: PageHeader, StatCard, PlaceholderSection
│   ├── layout/          # AppLayout, Sidebar
│   └── charts/          # Chart components (planned)
├── context/             # React Context providers (planned)
├── hooks/               # Custom hooks (planned)
├── pages/               # Route-level page components
│   ├── DashboardPage    # Overview with stats, recent projects, upcoming tasks
│   ├── ProjectsPage     # Project cards grid with progress & status
│   ├── TasksPage        # Kanban board (To Do / In Progress / In Review / Done)
│   ├── CalendarPage     # Timeline & deadline visualization (placeholder)
│   ├── TimeTrackingPage # Timer + recent time entries
│   ├── MilestonesPage   # Timeline view of key delivery milestones
│   ├── AnalyticsPage    # KPIs, charts, performance metrics (placeholder charts)
│   ├── ProfilePage      # User profile & stats summary
│   └── SettingsPage     # App config (placeholder)
├── theme/
│   └── darkTheme.js     # MUI createTheme — dark palette, typography, component overrides
├── utils/               # Utility functions (planned)
├── App.jsx              # Route definitions + MUI ThemeProvider
├── main.jsx             # React root entry
└── index.css            # Tailwind directives + global styles + font imports
```

## Design Decisions

### Dark Theme
- Background: `#0B0D11` (deepest), `#0F1117` (sidebar), `#12141A` (cards/paper), `#181B22` (elevated surfaces)
- Borders: `#2A2D35` throughout for subtle separation
- Primary accent: `#6C63FF` (indigo-violet) with gradient to `#918AFF`
- Secondary accent: `#00D4AA` (teal-green) for success states
- Semantic colors: red `#F87171`, yellow `#FBBF24`, green `#34D399`, blue `#60A5FA`

### Typography
- **Body**: Inter — clean, highly legible at small sizes
- **Headings**: Plus Jakarta Sans — geometric, modern, distinctive
- Heading weight: 700-800, tight letter-spacing (`-0.02em`)
- Body: 15px base, 1.6 line-height

### Component Conventions
- Pages receive a `<PageHeader>` with title, subtitle, and optional action slot
- Stat cards use `<StatCard>` with icon, value, subtitle, and color props
- Placeholder sections use `<PlaceholderSection>` for pages not yet built out
- All page-level animations use Framer Motion `variants` with stagger patterns
- MUI Card components are styled via the theme (border, radius, dark bg) — not per-instance
- Tailwind is used for layout, spacing, and one-off utilities; MUI for interactive components
- Colors reference hex values directly (not Tailwind color classes) to stay consistent with the MUI theme palette

### Routing
- React Router v6 with a single `<AppLayout>` wrapper using `<Outlet>`
- Sidebar navigation with animated active indicators
- All routes are flat (no nesting beyond the layout)

### SaaS Readiness (Planned)
- Auth context + protected routes
- Per-user data isolation
- Settings page for notifications, integrations, workspace config
- Deployable as a standalone instance per employee

## Commands
```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
```

## What's Next
- [ ] Wire up real state management (Context or Zustand)
- [ ] Build interactive calendar with date-fns
- [ ] Implement Recharts graphs on Analytics page
- [ ] Add task CRUD with local storage persistence
- [ ] Implement working timer on Time Tracking page
- [ ] Add search/filter functionality across tasks & projects
- [ ] Auth flow (login/register) for multi-user SaaS deployment
- [ ] Responsive mobile layout (sidebar → bottom nav)
