# Sequence Diagrams

> Show the interaction between components over time for key operations.

---

## 1. Task CRUD — Create, Update, Move, Delete

```mermaid
sequenceDiagram
    actor User
    participant UI as TasksPage (UI)
    participant Ctx as TaskContext
    participant Store as Local Storage / API
    participant Dash as DashboardPage

    Note over User, Dash: CREATE TASK
    User->>UI: Click "Add Task"
    UI->>UI: Open task creation modal
    User->>UI: Fill title, priority, deadline, project
    UI->>Ctx: dispatch(createTask(taskData))
    Ctx->>Store: POST /tasks or localStorage.setItem()
    Store-->>Ctx: Task created (id: 101)
    Ctx-->>UI: State updated — new task in "To Do" column
    UI-->>User: Task card appears in Kanban

    Note over User, Dash: MOVE TASK (Kanban Drag)
    User->>UI: Drag task from "To Do" → "In Progress"
    UI->>Ctx: dispatch(updateTaskStatus(101, "in_progress"))
    Ctx->>Store: PATCH /tasks/101 {status: "in_progress"}
    Store-->>Ctx: Updated
    Ctx-->>UI: Re-render Kanban columns
    Ctx-->>Dash: Dashboard stats recomputed

    Note over User, Dash: DELETE TASK
    User->>UI: Click "..." → Delete
    UI->>UI: Show confirmation dialog
    User->>UI: Confirm delete
    UI->>Ctx: dispatch(deleteTask(101))
    Ctx->>Store: DELETE /tasks/101
    Store-->>Ctx: Deleted
    Ctx-->>UI: Task removed from board
    Ctx-->>Dash: Stats updated
```

---

## 2. Time Tracking Session

```mermaid
sequenceDiagram
    actor User
    participant TT as TimeTrackingPage
    participant Timer as Timer Component
    participant Ctx as TimeContext
    participant Store as Local Storage / API
    participant Task as TaskContext

    User->>TT: Select task "Auth middleware refactor"
    TT->>Timer: Initialize timer for task #4
    User->>Timer: Click "Start"
    Timer->>Timer: setInterval — tick every second
    Timer-->>TT: Display 00:00:01, 00:00:02, ...

    Note over User, Task: User works on the task...

    User->>Timer: Click "Stop"
    Timer->>Timer: clearInterval
    Timer->>TT: Final duration: 01:23:45

    TT->>Ctx: dispatch(logTimeEntry({taskId: 4, duration: "1h 23m 45s", date: today}))
    Ctx->>Store: POST /time-entries
    Store-->>Ctx: Entry saved

    Ctx->>Task: dispatch(updateTaskHours(4, +1.4h))
    Task->>Store: PATCH /tasks/4 {loggedHours: +1.4}
    Store-->>Task: Updated

    Ctx-->>TT: New entry appears in "Recent Time Entries"
    TT-->>User: Timer reset, entry logged
```

---

## 3. Dashboard Data Loading

```mermaid
sequenceDiagram
    actor User
    participant Router as React Router
    participant Layout as AppLayout
    participant Dash as DashboardPage
    participant PCtx as ProjectContext
    participant TCtx as TaskContext
    participant TTCtx as TimeContext
    participant Store as Local Storage / API

    User->>Router: Navigate to "/"
    Router->>Layout: Render AppLayout
    Layout->>Dash: Render DashboardPage

    par Parallel Data Fetch
        Dash->>PCtx: getProjects()
        PCtx->>Store: GET /projects
        Store-->>PCtx: [8 projects]

        Dash->>TCtx: getTasksSummary()
        TCtx->>Store: GET /tasks/summary
        Store-->>TCtx: {total: 183, completed: 142, ...}

        Dash->>TTCtx: getWeeklyHours()
        TTCtx->>Store: GET /time-entries?range=week
        Store-->>TTCtx: {totalHours: 36.5}
    end

    PCtx-->>Dash: projects data ready
    TCtx-->>Dash: tasks summary ready
    TTCtx-->>Dash: time data ready

    Dash->>Dash: Compute stats, sort recent projects
    Dash-->>User: Render stat cards, project list, upcoming tasks
```

---

## 4. Authentication Flow (Planned)

```mermaid
sequenceDiagram
    actor User
    participant Login as LoginPage
    participant Auth as AuthContext
    participant API as Auth API
    participant Router as React Router
    participant Layout as AppLayout

    User->>Login: Enter email + password
    Login->>Auth: dispatch(login(email, password))
    Auth->>API: POST /auth/login {email, password}

    alt Valid Credentials
        API-->>Auth: {token, user: {id, name, role}}
        Auth->>Auth: Store token in localStorage
        Auth->>Auth: Set user in context state
        Auth-->>Router: Redirect to "/"
        Router->>Layout: Render authenticated layout
        Layout-->>User: Dashboard loads
    else Invalid Credentials
        API-->>Auth: 401 {error: "Invalid credentials"}
        Auth-->>Login: Show error message
        Login-->>User: "Invalid email or password"
    end

    Note over User, Layout: SUBSEQUENT REQUESTS
    User->>Layout: Navigate to /projects
    Layout->>API: GET /projects (Authorization: Bearer token)
    API-->>Layout: 200 — project data

    Note over User, Layout: TOKEN EXPIRED
    Layout->>API: GET /tasks
    API-->>Auth: 401 — Token expired
    Auth->>Auth: Clear token & user
    Auth-->>Router: Redirect to /login
    Router-->>User: Login page shown
```

---

## 5. Project Analytics Computation

```mermaid
sequenceDiagram
    actor User
    participant Analytics as AnalyticsPage
    participant PCtx as ProjectContext
    participant TCtx as TaskContext
    participant TTCtx as TimeContext
    participant Calc as MetricsCalculator (util)
    participant Charts as Recharts Components

    User->>Analytics: Navigate to /analytics
    Analytics->>PCtx: getAllProjects()
    Analytics->>TCtx: getAllTasks()
    Analytics->>TTCtx: getAllTimeEntries()

    PCtx-->>Analytics: projects[]
    TCtx-->>Analytics: tasks[]
    TTCtx-->>Analytics: timeEntries[]

    Analytics->>Calc: computeVelocity(tasks, sprintDates)
    Calc-->>Analytics: 34 pts/sprint

    Analytics->>Calc: computeBurnRate(tasks, sprintProgress)
    Calc-->>Analytics: 68%

    Analytics->>Calc: computeCycleTime(tasks)
    Calc-->>Analytics: avg 2.4 days

    Analytics->>Calc: computeValueDelivered(projects, tasks)
    Calc-->>Analytics: $42K

    Analytics->>Calc: computeTimeDistribution(timeEntries)
    Calc-->>Analytics: {byProject: {...}, byPriority: {...}}

    Analytics->>Charts: Render with computed data
    Charts-->>User: Interactive charts displayed
```
