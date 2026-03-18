# Flowcharts — Application Navigation & User Flow

---

## 1. Complete App Navigation Flow

```mermaid
flowchart TD
    Entry([User Opens App]) --> AuthCheck{Authenticated?}

    AuthCheck -->|No| LoginPage[Login / Register Page]
    LoginPage --> AuthCheck

    AuthCheck -->|Yes| Dashboard[📊 Dashboard]

    Dashboard --> |Sidebar Nav| Projects[📁 Projects]
    Dashboard --> |Sidebar Nav| Tasks[✅ Tasks]
    Dashboard --> |Sidebar Nav| Calendar[📅 Calendar]
    Dashboard --> |Sidebar Nav| TimeTracking[⏱️ Time Tracking]
    Dashboard --> |Sidebar Nav| Milestones[🚩 Milestones]
    Dashboard --> |Sidebar Nav| Analytics[📈 Analytics]
    Dashboard --> |Bottom Nav| Profile[👤 Profile]
    Dashboard --> |Bottom Nav| Settings[⚙️ Settings]

    %% Cross-page navigation
    Dashboard -->|Click project card| ProjectDetail[Project Detail View]
    Dashboard -->|Click task| TaskDetail[Task Detail Modal]

    Projects -->|Click project| ProjectDetail
    ProjectDetail -->|View tasks| Tasks
    ProjectDetail -->|View milestones| ProjectMilestones[Project Milestones]

    Tasks -->|Click task| TaskDetail
    TaskDetail -->|Start timer| TimeTracking
    TaskDetail -->|View project| ProjectDetail

    TimeTracking -->|Click task name| TaskDetail
    Milestones -->|Click milestone| ProjectDetail
    Analytics -->|Drill into project| ProjectDetail

    %% All pages can reach all pages via sidebar
    Projects --> Dashboard
    Tasks --> Dashboard
    Calendar --> Dashboard
    TimeTracking --> Dashboard
    Milestones --> Dashboard
    Analytics --> Dashboard

    style Entry fill:#6C63FF,stroke:#6C63FF,color:#fff
    style Dashboard fill:#181B22,stroke:#6C63FF,color:#F1F5F9
    style Projects fill:#181B22,stroke:#918AFF,color:#F1F5F9
    style Tasks fill:#181B22,stroke:#34D399,color:#F1F5F9
    style Calendar fill:#181B22,stroke:#C084FC,color:#F1F5F9
    style TimeTracking fill:#181B22,stroke:#60A5FA,color:#F1F5F9
    style Milestones fill:#181B22,stroke:#FBBF24,color:#F1F5F9
    style Analytics fill:#181B22,stroke:#F87171,color:#F1F5F9
    style Profile fill:#181B22,stroke:#2A2D35,color:#F1F5F9
    style Settings fill:#181B22,stroke:#2A2D35,color:#F1F5F9
```

---

## 2. Data Flow — How State Propagates Across Pages

```mermaid
flowchart LR
    subgraph UserActions["🖱️ User Actions"]
        A1[Create Task]
        A2[Move Task in Kanban]
        A3[Start/Stop Timer]
        A4[Create Project]
        A5[Complete Milestone]
    end

    subgraph ContextLayer["🧠 State (React Context)"]
        TC[TaskContext]
        PC[ProjectContext]
        TTC[TimeContext]
    end

    subgraph Storage["💾 Persistence"]
        LS[localStorage]
        API[REST API — future]
    end

    subgraph AffectedPages["📄 Pages That Re-render"]
        Dash[Dashboard Stats]
        ProjList[Projects Grid]
        Kanban[Tasks Kanban]
        TimeLog[Time Entries]
        Analytic[Analytics KPIs]
        Mile[Milestones Timeline]
    end

    A1 --> TC
    A2 --> TC
    A3 --> TTC
    A4 --> PC
    A5 --> PC

    TC --> LS
    PC --> LS
    TTC --> LS
    LS -.-> API

    TC --> Dash
    TC --> Kanban
    TC --> Analytic
    TC --> Mile

    PC --> Dash
    PC --> ProjList
    PC --> Analytic
    PC --> Mile

    TTC --> Dash
    TTC --> TimeLog
    TTC --> Analytic

    style UserActions fill:#0B0D11,stroke:#6C63FF,color:#F1F5F9
    style ContextLayer fill:#12141A,stroke:#FBBF24,color:#F1F5F9
    style Storage fill:#12141A,stroke:#34D399,color:#F1F5F9
    style AffectedPages fill:#12141A,stroke:#60A5FA,color:#F1F5F9
```

---

## 3. Making It Dynamic — Implementation Roadmap Flow

```mermaid
flowchart TD
    Start([Current State:<br/>Static UI]) --> Phase1

    subgraph Phase1["Phase 1 — State & Context"]
        P1A[Create React Contexts<br/>Project / Task / Time]
        P1B[Define data models<br/>& initial mock data]
        P1C[Wire contexts into<br/>existing pages]
        P1A --> P1B --> P1C
    end

    Phase1 --> Phase2

    subgraph Phase2["Phase 2 — CRUD Operations"]
        P2A[Task CRUD<br/>Create / Edit / Delete / Move]
        P2B[Project CRUD<br/>Create / Edit / Archive]
        P2C[Time Entry CRUD<br/>Start / Stop / Log / Edit]
        P2D[Milestone CRUD<br/>Create / Update Progress]
        P2A --> P2B --> P2C --> P2D
    end

    Phase2 --> Phase3

    subgraph Phase3["Phase 3 — Persistence"]
        P3A[localStorage adapter]
        P3B[Auto-save on state change]
        P3C[Load state on app mount]
        P3A --> P3B --> P3C
    end

    Phase3 --> Phase4

    subgraph Phase4["Phase 4 — Interactive Features"]
        P4A[Working timer with intervals]
        P4B[Kanban drag-and-drop]
        P4C[Calendar with date-fns]
        P4D[Recharts — analytics graphs]
        P4A --> P4B --> P4C --> P4D
    end

    Phase4 --> Phase5

    subgraph Phase5["Phase 5 — SaaS & Auth"]
        P5A[Auth flow — Login / Register]
        P5B[Backend API integration]
        P5C[Per-user data isolation]
        P5D[Notifications system]
        P5A --> P5B --> P5C --> P5D
    end

    Phase5 --> End([🚀 Fully Dynamic<br/>SaaS-Ready App])

    style Start fill:#F87171,stroke:#F87171,color:#fff
    style End fill:#34D399,stroke:#34D399,color:#fff
    style Phase1 fill:#12141A,stroke:#6C63FF,color:#F1F5F9
    style Phase2 fill:#12141A,stroke:#918AFF,color:#F1F5F9
    style Phase3 fill:#12141A,stroke:#34D399,color:#F1F5F9
    style Phase4 fill:#12141A,stroke:#FBBF24,color:#F1F5F9
    style Phase5 fill:#12141A,stroke:#60A5FA,color:#F1F5F9
```

---

## 4. Component Hierarchy Tree

```mermaid
flowchart TD
    App["App.jsx<br/><small>ThemeProvider + Router</small>"]
    App --> AppLayout["AppLayout<br/><small>Sidebar + Outlet</small>"]

    AppLayout --> Sidebar["Sidebar<br/><small>NavLinks + User Card</small>"]
    AppLayout --> PageSlot["<Outlet /> — Active Page"]

    PageSlot --> DashboardPage
    PageSlot --> ProjectsPage
    PageSlot --> TasksPage
    PageSlot --> CalendarPage
    PageSlot --> TimeTrackingPage
    PageSlot --> MilestonesPage
    PageSlot --> AnalyticsPage
    PageSlot --> ProfilePage
    PageSlot --> SettingsPage

    DashboardPage --> PageHeader
    DashboardPage --> StatCard["StatCard ×4"]
    DashboardPage --> ProjectList["Recent Projects<br/>(Card + LinearProgress)"]
    DashboardPage --> TaskList["Upcoming Tasks<br/>(Card list)"]

    ProjectsPage --> PageHeader2[PageHeader]
    ProjectsPage --> ProjectCards["ProjectCard ×N"]

    TasksPage --> PageHeader3[PageHeader]
    TasksPage --> KanbanCols["Kanban Columns ×4"]
    KanbanCols --> TaskCards["TaskCard ×N"]

    AnalyticsPage --> PageHeader4[PageHeader]
    AnalyticsPage --> StatCards2["StatCard ×4"]
    AnalyticsPage --> ChartPlaceholders["PlaceholderSection ×2<br/>(→ Recharts)"]

    style App fill:#6C63FF,stroke:#6C63FF,color:#fff
    style AppLayout fill:#181B22,stroke:#918AFF,color:#F1F5F9
    style PageSlot fill:#12141A,stroke:#2A2D35,color:#94A3B8
```
