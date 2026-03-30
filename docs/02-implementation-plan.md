# ProjectPulse — Implementation Plan (Iteration #03)

> Last updated: 2026-03-30

---

## Problem Statement

As a Software Engineer working across multiple companies and capacities (junior developer, CEO, freelancer, etc.), I need a single tool to track all my work across every role and organization — so nothing falls through the cracks regardless of which hat I'm wearing.

The current app treats all projects as a flat list with no organizational context. There's no way to know which company a project belongs to, what role I'm serving in, or to quickly filter my world by any of those dimensions.

---

## Goals for This Iteration

1. Introduce **Roles** and **Companies** as first-class entities
2. Restructure the **Sidebar** to show company → project hierarchy
3. Enhance **Task creation** with optional fields and a description
4. Add a **Quick Add Task** button accessible from Dashboard
5. Add **Search** to Tasks and Projects pages
6. Make the **Profile** page editable with multi-role support
7. Fix the **Project modal overlay** issue
8. Make the **Sidebar responsive** (hamburger menu on mobile)
9. Lay groundwork for **data export/import** and future sync

---

## New & Modified Data Models

### Role (NEW)

```
{
  id: string,              // Auto-generated (role-xxx)
  title: string,           // e.g., "Junior Developer", "CEO", "Freelancer"
  company: string,         // e.g., "FHS Technologies", "Self-employed"
  type: enum,              // 'employee' | 'freelancer' | 'founder' | 'contractor' | 'other'
  isActive: boolean,       // Currently serving this role?
  startDate: string,       // When you started
  endDate: string | null,  // null if current
  createdAt: ISO 8601
}
```

### UserProfile (NEW)

```
{
  id: 'user-1',
  name: string,
  email: string,
  avatar: string | null,
  bio: string,
  primaryRoleId: string,   // The "main" role shown in sidebar
  skills: string[],        // Editable skill tags
  createdAt: ISO 8601
}
```

### Project (MODIFIED)

```diff
  {
    id, name, description, color, status, startDate, deadline,
    ownerId, memberIds, createdAt,
+   roleId: string,        // Links to a Role → gives us company + capacity
  }
```

Adding `roleId` to a project automatically ties it to a company (via Role.company) and a capacity (via Role.title/type). No need for a separate company entity — a Role already carries that context.

### Task (MODIFIED)

```diff
  {
    id, title, projectId, status, priority, deadline,
    estimatedHours, loggedHours, assigneeId, subtasks, createdAt,
+   description: string,   // Rich text / markdown body for task details
+   tags: string[],        // Optional labels for categorization
  }
```

---

## Implementation Phases

### Phase 1: Core Data Layer — Roles, Profile, Schema Changes

**Files to create:**
- `src/context/UserContext.jsx` — manages UserProfile + Roles array
- `src/data/userSeed.js` — seed data for profile + sample roles

**Files to modify:**
- `src/data/projects.js` — add `roleId` to each seed project
- `src/data/tasks.js` — add `description: ''` and `tags: []` to seed tasks
- `src/context/ProjectContext.jsx` — handle roleId in addProject
- `src/context/TaskContext.jsx` — handle description/tags in addTask
- `src/utils/storage.js` — add keys: `projectpulse_profile`, `projectpulse_roles`
- `src/App.jsx` — wrap with UserProvider

**Deliverables:**
- UserContext with CRUD for roles and profile edit
- All seed data updated with role associations
- localStorage persistence for user data
- Existing functionality unbroken

---

### Phase 2: Sidebar Restructure — Company → Project Hierarchy

**Current:** Flat nav list (Dashboard, Projects, Tasks, Calendar, ...)

**Target:**
```
Dashboard
─────────────
Companies
  ▼ FHS Technologies
      OOR
      OOC
      OES
  ▶ Freelance Projects
  ▶ Personal
─────────────
Tasks
Calendar
Time Tracking
Milestones
Analytics
─────────────
Profile
Settings
```

**Implementation:**
- Group projects by `Role.company` (derived from `project.roleId → role.company`)
- Each company section is collapsible (open/close toggle)
- Clicking a project navigates to `/projects/:id` (project detail view — new route)
- Keep the existing top-level nav items for global views
- Store collapsed/expanded state in localStorage (`projectpulse_sidebar_state`)

**Files to modify:**
- `src/components/layout/Sidebar.jsx` — major refactor for hierarchical nav
- `src/App.jsx` — add `/projects/:id` route

**Files to create:**
- `src/pages/ProjectDetailPage.jsx` — single project view (tasks, milestones, time for that project)

---

### Phase 3: Task Enhancements — Description, Quick Add, Search

#### 3a. Task Description Field
- Add a multiline text field to the task create/edit modal
- Show description in an expandable section on the task card or a task detail drawer
- Keep it optional — title is the only required field

#### 3b. Quick Add Task (Dashboard)
- Floating action button (FAB) or header button on DashboardPage
- Opens the task create modal with project selection dropdown
- Project dropdown grouped by company for easy selection
- All fields optional except title: project, priority, deadline, description

#### 3c. Task Search
- Search bar at top of TasksPage
- Filters across: title, description, tags, project name
- Debounced input (300ms)
- Results filter the Kanban columns in real-time

**Files to modify:**
- `src/pages/TasksPage.jsx` — add search bar, update create/edit modal with description
- `src/pages/DashboardPage.jsx` — add Quick Add Task button + modal

---

### Phase 4: Project Enhancements — Role Association, Search, Filter

#### 4a. Role Selection in Project Modal
- Add a "Role / Company" dropdown to the project create/edit modal
- Dropdown shows: `Role.title @ Role.company` (e.g., "Junior Developer @ FHS Technologies")
- Selected role auto-associates the project with that company

#### 4b. Project Search
- Search bar on ProjectsPage
- Searches across: name, description, company name

#### 4c. Role/Company Filter
- Filter dropdown: "All Roles" or specific role
- Stacks with existing status filter

#### 4d. Fix Project Modal Overlay
- Investigate z-index / positioning issue on the New Project modal
- Ensure modal renders above all content with proper backdrop

**Files to modify:**
- `src/pages/ProjectsPage.jsx` — add role dropdown in modal, search bar, role filter, fix modal z-index

---

### Phase 5: Profile Page — Multi-Role Management

**Current:** Static card with hardcoded name, title, skills.

**Target:**
- Editable profile header (name, email, bio, avatar placeholder)
- **Roles section** with:
  - List of all roles (active + inactive)
  - Add Role button → modal with: title, company, type, start date, end date
  - Edit / Delete each role
  - Active/inactive toggle
  - Badge showing which is the primary role
- Stats sections remain but become filterable by role
- Skill tags become editable (add/remove)

**Files to modify:**
- `src/pages/ProfilePage.jsx` — major rewrite for editable profile + roles management

---

### Phase 6: Mobile Responsive Sidebar

**Breakpoint:** `md` (768px)

**Desktop (>= 768px):** Current fixed sidebar behavior

**Mobile (< 768px):**
- Sidebar hidden by default
- Hamburger icon (☰) in top-left corner
- Tapping hamburger slides sidebar in from left (Framer Motion `animate`)
- Backdrop overlay behind sidebar — tap to close
- Sidebar auto-closes on route navigation

**Implementation:**
- Add `isMobile` state using `window.matchMedia` or a custom hook
- Manage sidebar open/close state
- Framer Motion `AnimatePresence` for slide-in/out animation
- Apply to AppLayout

**Files to modify:**
- `src/components/layout/AppLayout.jsx` — add hamburger button, manage mobile state
- `src/components/layout/Sidebar.jsx` — accept open/close props, animation variants

---

### Phase 7: Data Portability — Export / Import

**Export:**
- Settings page gets an "Export Data" button
- Exports all localStorage keys as a single JSON file
- File named: `projectpulse-backup-YYYY-MM-DD.json`
- Structure:
  ```json
  {
    "version": "1.0",
    "exportedAt": "ISO 8601",
    "data": {
      "profile": {...},
      "roles": [...],
      "projects": [...],
      "tasks": [...],
      "timeEntries": [...],
      "milestones": [...]
    }
  }
  ```

**Import:**
- Settings page gets an "Import Data" button
- File picker accepts `.json`
- Validates structure + version
- Confirmation dialog: "This will replace all existing data. Continue?"
- Loads data into all contexts and localStorage

**Future Sync Considerations:**
- The export format doubles as the sync payload
- For cross-machine sync, options to explore later:
  - **File-based:** Export to iCloud Drive / Dropbox / Google Drive — manual but zero infra
  - **Git-based:** Auto-commit JSON to a private GitHub repo on save — version history for free
  - **WebSocket/Supabase:** Real-time sync via Supabase Realtime or a simple WebSocket server
  - **CouchDB/PouchDB:** Built for offline-first sync — PouchDB in browser syncs to CouchDB server
- For now, export/import gives full data portability between machines

**Files to modify:**
- `src/pages/SettingsPage.jsx` — replace placeholder with export/import UI
- `src/utils/storage.js` — add `exportAll()` and `importAll(json)` functions

---

## Implementation Order & Dependencies

```
Phase 1 (Core Data Layer)
  │
  ├──→ Phase 2 (Sidebar Restructure)  ← depends on roles/projects having roleId
  │
  ├──→ Phase 3 (Task Enhancements)    ← depends on new task fields
  │
  └──→ Phase 5 (Profile Page)         ← depends on UserContext
          │
Phase 4 (Project Enhancements)        ← depends on Phase 1 + Phase 2
  │
Phase 6 (Mobile Sidebar)              ← independent, can start anytime after Phase 2
  │
Phase 7 (Data Portability)            ← should be last, after all data models are stable
```

**Recommended execution:**
1. Phase 1 first (everything else depends on it)
2. Phase 2 + 3 + 5 in parallel (independent once Phase 1 is done)
3. Phase 4 after Phase 2
4. Phase 6 anytime after Phase 2
5. Phase 7 last

---

## Files Summary

### New Files
| File | Purpose |
|------|---------|
| `src/context/UserContext.jsx` | Profile + Roles state management |
| `src/data/userSeed.js` | Seed data for profile + sample roles |
| `src/pages/ProjectDetailPage.jsx` | Single project detail view |

### Major Modifications
| File | Changes |
|------|---------|
| `src/components/layout/Sidebar.jsx` | Company → Project hierarchy, collapsible sections, mobile support |
| `src/components/layout/AppLayout.jsx` | Hamburger menu, mobile sidebar management |
| `src/pages/TasksPage.jsx` | Search bar, description field in modal |
| `src/pages/ProjectsPage.jsx` | Role dropdown, search, role filter, modal fix |
| `src/pages/ProfilePage.jsx` | Full rewrite — editable profile + roles CRUD |
| `src/pages/DashboardPage.jsx` | Quick Add Task button |
| `src/pages/SettingsPage.jsx` | Export/Import UI |
| `src/context/ProjectContext.jsx` | Handle roleId |
| `src/context/TaskContext.jsx` | Handle description, tags |
| `src/data/projects.js` | Add roleId to seeds |
| `src/data/tasks.js` | Add description, tags to seeds |
| `src/utils/storage.js` | New keys, export/import functions |
| `src/App.jsx` | UserProvider, new route |

---

## Design Notes

- All new UI follows the existing dark theme (`darkTheme.js`) — no theme changes needed
- New modals use the existing `FormDialog` component
- Search bars follow MUI `TextField` with `InputAdornment` (search icon)
- Collapsible sidebar sections use Framer Motion `AnimatePresence` + `motion.div` with height animation
- Mobile sidebar uses `motion.aside` with `x` animation (slide from left)
- Quick Add Task uses MUI `Fab` component positioned in the bottom-right or as a header action
- Role type badges use the existing `Chip` component with semantic colors
