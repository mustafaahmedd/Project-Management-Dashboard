# ProjectPulse — Full Codebase Context

> **Purpose**: This file gives any AI assistant complete context about the ProjectPulse codebase. Feed this file when starting a conversation in Cursor, Antigravity, Windsurf, or any other AI-powered code editor.

---

## What is ProjectPulse?

A personal project management dashboard for software engineers. Built with React 18 + Vite, dark-themed, SaaS-ready architecture. Tracks projects, tasks, time, milestones, ideas, payments, and generates invoices.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 (Vite 8) |
| Routing | React Router v6 |
| Styling | Tailwind CSS v4 + Material UI v7 |
| Animations | Framer Motion |
| Charts | Recharts |
| Fonts | Inter (body), Plus Jakarta Sans (headings) |
| Date Utils | date-fns |
| State | React Context + useReducer + localStorage |

## Commands

```bash
npm run dev      # Dev server → localhost:5173
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

---

## File Structure

```
src/
├── App.jsx                    # Routes + Provider hierarchy
├── main.jsx                   # React root entry
├── index.css                  # Tailwind + global styles + fonts
├── components/
│   ├── common/
│   │   ├── PageHeader.jsx     # Title + subtitle + action slot
│   │   ├── StatCard.jsx       # KPI card (icon, value, subtitle, color)
│   │   ├── FormDialog.jsx     # Modal form wrapper (create/edit)
│   │   ├── ConfirmDialog.jsx  # Delete confirmation modal
│   │   └── PlaceholderSection.jsx
│   └── layout/
│       ├── AppLayout.jsx      # Sidebar + main content wrapper
│       └── Sidebar.jsx        # Navigation (companies, tools, footer)
├── context/
│   ├── UserContext.jsx        # Profile + Roles
│   ├── ProjectContext.jsx     # Projects CRUD
│   ├── TaskContext.jsx        # Tasks CRUD + Kanban moves
│   ├── TimeContext.jsx        # Time entries + live timer
│   ├── MilestoneContext.jsx   # Milestones CRUD
│   ├── LogContext.jsx         # Daily logs
│   ├── IdeaContext.jsx        # Quick ideas capture
│   └── PaymentContext.jsx     # Payment tracking
├── pages/
│   ├── DashboardPage.jsx      # Overview stats + recent projects
│   ├── ProjectsPage.jsx       # Project cards grid
│   ├── ProjectDetailPage.jsx  # Single project view
│   ├── TasksPage.jsx          # Kanban board
│   ├── CalendarPage.jsx       # Timeline view
│   ├── TimeTrackingPage.jsx   # Timer + time entries
│   ├── MilestonesPage.jsx     # Milestones timeline
│   ├── AnalyticsPage.jsx      # KPIs + charts
│   ├── DailyLogPage.jsx       # Daily work logs
│   ├── IdeasPage.jsx          # Ideas grid with CRUD
│   ├── PaymentsPage.jsx       # Payment tracker + stats
│   ├── InvoicePage.jsx        # Invoice/quotation generator
│   ├── ProfilePage.jsx        # User profile + roles
│   └── SettingsPage.jsx       # App config
├── theme/
│   └── darkTheme.js           # MUI dark theme config
└── utils/
    ├── storage.js             # localStorage helpers (prefix: projectpulse_)
    ├── format.js              # Date/number formatting
    ├── uid.js                 # ID generator (prefix-timestamp)
    ├── seedData.js            # Initial demo data
    └── logParser.js           # Daily log parsing
```

---

## Routing

All routes are flat under a single `<AppLayout>` wrapper:

| Path | Page | Description |
|------|------|-------------|
| `/` | DashboardPage | Overview with stats, recent projects |
| `/projects` | ProjectsPage | All projects grid |
| `/projects/:id` | ProjectDetailPage | Single project detail |
| `/tasks` | TasksPage | Kanban board |
| `/calendar` | CalendarPage | Timeline view |
| `/time-tracking` | TimeTrackingPage | Timer + entries |
| `/milestones` | MilestonesPage | Milestone timeline |
| `/analytics` | AnalyticsPage | Charts + KPIs |
| `/daily-log` | DailyLogPage | Work logs |
| `/ideas` | IdeasPage | Quick ideas |
| `/payments` | PaymentsPage | Payment tracking |
| `/invoice` | InvoicePage | Invoice generator |
| `/profile` | ProfilePage | User profile |
| `/settings` | SettingsPage | App settings |

## Provider Hierarchy

```
ThemeProvider → UserProvider → ProjectProvider → TaskProvider →
  TimeProvider → MilestoneProvider → LogProvider →
    IdeaProvider → PaymentProvider → BrowserRouter → Routes
```

---

## State Management Pattern

Every context follows the same pattern:

```jsx
// 1. Context + Reducer + localStorage
const [data, dispatch] = useReducer(reducer, null, () => loadState('key', SEED));

// 2. Auto-persist to localStorage
useEffect(() => { saveState('key', data); }, [data]);

// 3. CRUD methods exposed via Provider value
// 4. Custom hook: useXxx() for consumption
```

**localStorage prefix**: `projectpulse_`

---

## Data Models

### Profile
```js
{ id, name, email, avatar, bio, primaryRoleId, skills: [], createdAt }
```

### Role
```js
{ id, title, company, type: 'employee'|'freelancer'|'founder', isActive, startDate, endDate, createdAt }
```

### Project
```js
{ id, name, description, color, status: 'on_track'|'at_risk'|'behind'|'completed',
  priority: 'critical'|'high'|'medium'|'low', startDate, deadline,
  ownerId, memberIds: [], roleId, createdAt }
```

### Task
```js
{ id, title, description, projectId, status: 'todo'|'in_progress'|'in_review'|'done',
  priority, deadline, estimatedHours, loggedHours, assigneeId,
  subtasks: [{ id, title, completed }], tags: [], createdAt }
```

### Time Entry
```js
{ id, taskId, projectId, userId, startTime, endTime, durationMinutes, notes }
```

### Milestone
```js
{ id, title, projectId, targetDate, status, taskIds: [] }
```

### Daily Log
```js
{ id, date, content, parsedItems: [{ text, projectId, projectName, taskId, hoursSpent, tags }],
  priorityNotes, createdAt }
```

### Idea
```js
{ id, title, description, category: 'feature'|'integration'|'improvement'|'general',
  priority: 'low'|'medium'|'high'|'critical', status: 'new'|'exploring'|'planned'|'building'|'done'|'parked',
  createdAt }
```

### Payment
```js
{ id, projectId, clientName, description, amount, currency: 'USD'|'PKR'|'EUR'|'GBP',
  status: 'pending'|'received'|'overdue'|'cancelled',
  type: 'freelance'|'salary'|'bonus'|'refund'|'other', date, dueDate, createdAt }
```

---

## Context API Reference

| Context | Hook | Storage Key | Key Methods |
|---------|------|-------------|------------|
| UserContext | `useUser()` | `profile`, `roles` | `updateProfile`, `addRole`, `updateRole`, `deleteRole`, `getRole`, `getActiveRoles`, `getCompanies` |
| ProjectContext | `useProjects()` | `projects` | `addProject`, `updateProject`, `deleteProject`, `getProject` |
| TaskContext | `useTasks()` | `tasks` | `addTask`, `updateTask`, `deleteTask`, `moveTask`, `toggleSubtask`, `getTask`, `getTasksByProject`, `getTasksByStatus` |
| TimeContext | `useTime()` | `timeEntries` | `startTimer`, `pauseTimer`, `resumeTimer`, `stopTimer`, `resetTimer`, `addManualEntry`, `deleteEntry`, `getEntriesByTask`, `getEntriesByProject`, `getTotalMinutes` |
| MilestoneContext | `useMilestones()` | `milestones` | `addMilestone`, `updateMilestone`, `deleteMilestone`, `getMilestonesByProject` |
| LogContext | `useLogs()` | `logs` | `addLog`, `updateLog`, `deleteLog`, `getLog`, `getLogByDate`, `getLogsByMonth` |
| IdeaContext | `useIdeas()` | `ideas` | `addIdea`, `updateIdea`, `deleteIdea` |
| PaymentContext | `usePayments()` | `payments` | `addPayment`, `updatePayment`, `deletePayment`, `getPaymentsByProject`, `getTotalReceived`, `getTotalPending` |

---

## Theme & Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#6C63FF` | Accent, buttons, active states |
| Primary Light | `#918AFF` | Gradients, hover |
| Secondary | `#00D4AA` | Success, teal accent |
| Background | `#0B0D11` | Page background |
| Paper | `#12141A` | Cards, dialogs |
| Surface | `#181B22` | Elevated surfaces |
| Border | `#2A2D35` | All borders |
| Text Primary | `#F1F5F9` | White text |
| Text Secondary | `#94A3B8` | Gray text |
| Error | `#F87171` | Red |
| Warning | `#FBBF24` | Yellow |
| Success | `#34D399` | Green |
| Info | `#60A5FA` | Blue |

### Typography
- **Headings**: Plus Jakarta Sans, weight 700-800, letter-spacing -0.02em
- **Body**: Inter, 15px base, line-height 1.6
- **Buttons**: No text-transform, weight 600, border-radius 10px

### Component Conventions
- Cards: bg `#12141A`, border `#2A2D35`, radius 16px
- Chips: radius 8px
- All hex values used directly (not Tailwind color classes)
- Tailwind for layout/spacing, MUI for interactive components

---

## UI Patterns

### Page Structure
Every page follows this pattern:
1. `<PageHeader>` with title, subtitle, and action button(s)
2. Filters/search bar (optional)
3. Content area with Framer Motion stagger animations
4. `<FormDialog>` for create/edit
5. `<ConfirmDialog>` for delete confirmation

### Animation Variants
```js
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
```

### How to Add a New Page
1. Create `src/pages/NewPage.jsx` following the pattern above
2. Add route in `src/App.jsx` inside the `<Route element={<AppLayout />}>` block
3. Add nav item in `src/components/layout/Sidebar.jsx` → `bottomNavItems` array
4. If new data is needed, create `src/context/NewContext.jsx` and wrap in App.jsx provider chain

### ID Generation
```js
uid('prefix') → 'prefix-la8x3q' // timestamp-based, always unique
```

---

## Sidebar Navigation Structure

```
MAIN MENU
  └── Dashboard

COMPANIES (grouped by role.company)
  ├── DataViz Labs → project links
  ├── FHS Technologies → project links
  └── Freelance → project links

TOOLS
  ├── Tasks
  ├── Daily Log
  ├── Ideas
  ├── Calendar
  ├── Time Tracking
  ├── Milestones
  ├── Payments
  ├── Invoice
  └── Analytics

FOOTER
  ├── Profile
  └── Settings
```

---

## Key Utility Functions

### format.js
- `formatDuration(minutes)` → "5h 30m"
- `formatTimer(seconds)` → "05:30:45"
- `formatDate(dateStr)` → "Mar 15, 2026"
- `relativeDate(dateStr)` → "In 3 days", "Yesterday"
- `computeProjectProgress(tasks)` → percentage
- `computeProjectStatus(progress, deadline)` → status string
- `STATUS_DISPLAY` → { label, color } map
- `PRIORITY_COLOR` → color map

### storage.js
- `loadState(key, fallback)` — reads from localStorage with `projectpulse_` prefix
- `saveState(key, value)` — writes to localStorage
- `clearAll()` — removes all projectpulse_ keys

---

## Data Relationships

```
Role ──< Project ──< Task ──< Subtask
                  ──< Milestone
                  ──< TimeEntry
                  ──< Payment (optional)
User ──< Role
     ──< Profile
Log (date-based, references projects/tasks in parsed content)
Idea (standalone, no relations)
```

---

## What's Working
- Full CRUD on projects, tasks, milestones, time entries, logs, ideas, payments
- Kanban board with drag-to-move
- Live timer for time tracking
- Invoice/quotation generator with print/PDF support
- Service-based invoicing with add-ons
- Payment stats (total income, received, pending, monthly)
- Sidebar with company-grouped project navigation
- All data persists to localStorage
- Responsive layout (sidebar collapses on mobile)

## What's Planned
- Auth flow (login/register) for multi-user SaaS
- Real-time sync (replace localStorage with backend)
- Interactive calendar with date-fns
- Search/filter across all entities
- Notifications & integrations (Slack, email)
- Mobile bottom nav layout
