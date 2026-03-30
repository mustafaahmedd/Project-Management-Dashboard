# ProjectPulse — Current Situation & Functionality

> Last updated: 2026-03-30

---

## Overview

ProjectPulse is a personal project management dashboard built with React 18 (Vite), Tailwind CSS v4, Material UI v6, and Framer Motion. It currently tracks **projects**, **tasks**, **time entries**, and **milestones** — all persisted in browser localStorage under the `projectpulse_` prefix.

The app uses four React Context providers (`ProjectContext`, `TaskContext`, `TimeContext`, `MilestoneContext`) layered around a single `<AppLayout>` with a dark-themed sidebar and an `<Outlet>` for page content.

---

## Data Models (Current)

### Project

| Field | Type | Notes |
|-------|------|-------|
| id | string | Auto-generated (`proj-xxx`) |
| name | string | Required |
| description | string | Optional |
| color | hex string | 8 preset colors, default `#6C63FF` |
| status | enum | `on_track`, `at_risk`, `behind`, `active`, `planning`, `paused`, `archived` |
| startDate | YYYY-MM-DD | Optional |
| deadline | YYYY-MM-DD | Optional |
| ownerId | string | Hardcoded `user-1` |
| memberIds | string[] | Hardcoded `['user-1']` |
| createdAt | ISO 8601 | Auto-set |

**Seed data:** 6 generic projects (E-Commerce Platform, Mobile App Redesign, API Migration v3, Dashboard Analytics, CI/CD Pipeline Revamp, Design System v2).

### Task

| Field | Type | Notes |
|-------|------|-------|
| id | string | Auto-generated (`task-xxx`) |
| title | string | Required |
| projectId | string | Links to project |
| status | enum | `todo`, `in_progress`, `in_review`, `done` |
| priority | enum | `critical`, `high`, `medium`, `low` |
| deadline | YYYY-MM-DD | Optional |
| estimatedHours | number | Default `0` |
| loggedHours | number | Default `0` |
| assigneeId | string | Hardcoded `user-1` |
| subtasks | array | `{ id, title, completed }` |
| createdAt | ISO 8601 | Auto-set |

**Seed data:** 26 tasks across all 6 projects.

### Time Entry

| Field | Type | Notes |
|-------|------|-------|
| id | string | Auto-generated (`te-xxx`) |
| taskId | string | Links to task |
| projectId | string | Links to project |
| userId | string | Hardcoded `user-1` |
| startTime | ISO 8601 | When tracking started |
| endTime | ISO 8601 | When tracking stopped |
| durationMinutes | number | Computed |
| notes | string | Optional |

### Milestone

| Field | Type | Notes |
|-------|------|-------|
| id | string | Auto-generated (`ms-xxx`) |
| title | string | Required |
| projectId | string | Links to project |
| targetDate | YYYY-MM-DD | Required |
| status | enum | `on_track`, `at_risk`, `behind`, `completed` |
| taskIds | string[] | Tasks associated with milestone |

---

## Pages & Current Functionality

### Dashboard (`/`)
- 4 stat cards: Active Projects, Tasks Completed (%), Hours Logged (this week), In Progress count
- Recent Projects grid (top 4) with computed progress bars
- Upcoming Tasks (top 6 non-done, sorted by deadline)
- **No quick-add actions** — purely a read-only overview

### Projects (`/projects`)
- Grid of project cards with progress bar, task counts, deadline, status chip
- Create/Edit modal: name, description, color picker, status dropdown, start date, deadline
- Status filter dropdown (All / On Track / At Risk / Behind)
- Delete with confirmation dialog
- **No search, no grouping by company or role**

### Tasks (`/tasks`)
- Kanban board with 4 columns: To Do → In Progress → In Review → Done
- Create/Edit modal: title, project dropdown, priority, status, deadline, estimated hours
- Project filter dropdown
- Context menu: Edit, Move Forward/Back, Delete
- Column header "+" button creates task with pre-selected status
- **No search, no description/details field, no tags**

### Calendar (`/calendar`)
- Monthly grid view with navigation
- Shows task deadlines as colored dots (project color) and milestones as orange dots
- Click a date to see tasks + milestones due that day in a side panel
- Today highlighted, selected date highlighted

### Time Tracking (`/time-tracking`)
- 3 stat cards: Today, This Week, Total Entries
- Active timer with task selector, play/pause/stop controls
- Timer display in HH:MM:SS format, ticks every second
- Recent entries list (up to 15) with delete
- Manual entry modal: task, duration, date, notes

### Milestones (`/milestones`)
- Vertical timeline layout with colored status dots
- Create/Edit modal: title, project, target date, status
- Progress bar computed from linked task completion
- Sorted by target date ascending

### Analytics (`/analytics`)
- 4 KPI cards: Completion Rate, Total Time Logged, Avg Hours/Task, In Progress
- Task status distribution (progress bars)
- Priority distribution (progress bars)
- Time distribution by project (horizontal bars)
- Project health overview (all projects with progress + hours)
- **All computed from live context data — no charts/Recharts yet**

### Profile (`/profile`)
- Hardcoded user card: "Mustafa Ahmed", "Software Engineer"
- Hardcoded skills: "Full-Stack", "Team Lead"
- Performance summary: 4 stat cards
- Priority spread breakdown
- Top projects by task count
- **Completely static identity — no editable roles, no multi-role support**

### Settings (`/settings`)
- Placeholder only — "SaaS-ready settings panel coming soon"

---

## Status & Priority Systems — Thought Process

### Task Statuses

| Status | Purpose | When to use |
|--------|---------|-------------|
| `todo` | Backlog / not started | Task is identified but no work has begun |
| `in_progress` | Actively being worked on | You've started coding, designing, or building |
| `in_review` | Work done, awaiting validation | PR submitted, design review pending, waiting on feedback |
| `done` | Completed and verified | Merged, deployed, or signed off — no further action |

The 4-column Kanban provides a clear visual flow: each task moves left-to-right as it progresses through the lifecycle. "In Review" is the key differentiator from simpler todo apps — it captures the reality that finished work still needs validation before it's truly done.

### Task Priorities

| Priority | Color | Intent |
|----------|-------|--------|
| `critical` | `#EF4444` (red) | Blocking other work or has immediate deadline — drop everything |
| `high` | `#F87171` (lighter red) | Important and time-sensitive — do this sprint/day |
| `medium` | `#FBBF24` (yellow) | Normal cadence — plan it, but no urgency |
| `low` | `#34D399` (green) | Nice-to-have — do when you have breathing room |

### Project Statuses

| Status | Color | Intent |
|--------|-------|--------|
| `on_track` | `#34D399` (green) | Progress matches or exceeds expected pace vs. deadline |
| `at_risk` | `#FBBF24` (yellow) | Falling behind — may miss deadline without intervention |
| `behind` | `#F87171` (red) | Already past expected progress — needs immediate attention |
| `completed` | `#34D399` (green) | All work finished |
| `active` | `#60A5FA` (blue) | Project is live and in progress (general state) |
| `planning` | `#C084FC` (purple) | Not yet started — scoping, requirements gathering |
| `paused` | `#94A3B8` (gray) | On hold — deprioritized or blocked externally |
| `archived` | `#64748B` (dim gray) | No longer active — kept for records |

The status is currently **manually set** by the user. The utility function `computeProjectStatus()` exists to auto-calculate status based on progress % and deadline proximity, but it's not wired into the UI as the primary source.

### Milestone Statuses
Same as project: `on_track`, `at_risk`, `behind`, `completed` — tracks whether the milestone will hit its target date based on linked task progress.

---

## Architecture Observations

### What's Working Well
- Clean context + reducer pattern with localStorage persistence
- Consistent dark theme via MUI's `createTheme` with Tailwind for layout
- Framer Motion stagger animations give the UI a polished feel
- Seed data makes the app immediately usable on first load
- Utility functions (`format.js`, `storage.js`) are well-structured and reusable

### What's Missing / Limitations
1. **No concept of Company or Role** — projects are flat, no organizational hierarchy
2. **Hardcoded user identity** — name, email, skills are all static in ProfilePage
3. **No task description/details** — only a title, no rich content
4. **No search anywhere** — tasks, projects, nothing is searchable
5. **No mobile responsiveness** — sidebar has no hamburger/collapse behavior
6. **Project modal overlaps UI** — the "New Project" dialog has z-index/positioning issues
7. **No data portability** — no export/import, no cross-device sync
8. **No quick-add from Dashboard** — have to navigate to Tasks page to create a task
9. **ID generation is counter-based** — resets on page refresh, can collide with seed data (uses base-36 counter starting from 0)
10. **Single user assumption** — ownerId and assigneeId are always `user-1`

---

## localStorage Keys

| Key | Content |
|-----|---------|
| `projectpulse_projects` | All projects array |
| `projectpulse_tasks` | All tasks array |
| `projectpulse_timeEntries` | All time entries array |
| `projectpulse_milestones` | All milestones array |
