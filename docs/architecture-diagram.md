# System Architecture — Component Diagram

> Shows how the frontend layers, state management, and future backend interact.

```mermaid
graph TB
    subgraph Client["🖥️ Client — Browser"]
        direction TB

        subgraph Routing["React Router v6"]
            BR[BrowserRouter]
            Routes[Route Definitions]
        end

        subgraph Layout["Layout Layer"]
            AppLayout[AppLayout]
            Sidebar[Sidebar Navigation]
            PageHeader[PageHeader]
        end

        subgraph Pages["Page Components"]
            Dashboard[DashboardPage]
            Projects[ProjectsPage]
            Tasks[TasksPage]
            Calendar[CalendarPage]
            TimeTracking[TimeTrackingPage]
            Milestones[MilestonesPage]
            Analytics[AnalyticsPage]
            Profile[ProfilePage]
            Settings[SettingsPage]
        end

        subgraph SharedUI["Shared UI Components"]
            StatCard[StatCard]
            PlaceholderSection[PlaceholderSection]
            Charts[Chart Components]
            TaskCard[TaskCard]
            ProjectCard[ProjectCard]
        end

        subgraph StateLayer["State Management Layer"]
            AuthCtx[AuthContext]
            ProjectCtx[ProjectContext]
            TaskCtx[TaskContext]
            TimeCtx[TimeTrackingContext]
            ThemeCtx[MUI ThemeProvider]
        end

        subgraph Styling["Styling Layer"]
            Tailwind[Tailwind CSS v4]
            MUI[Material UI v6]
            Framer[Framer Motion]
            DarkTheme[darkTheme.js]
        end
    end

    subgraph Backend["☁️ Backend — API Layer (Planned)"]
        API[REST / GraphQL API]
        AuthService[Auth Service]
        DB[(Database)]
        Storage[File Storage]
    end

    BR --> Routes
    Routes --> AppLayout
    AppLayout --> Sidebar
    AppLayout --> Pages
    Pages --> SharedUI
    Pages --> StateLayer
    StateLayer --> API
    Styling --> Layout
    Styling --> Pages
    Styling --> SharedUI
    API --> AuthService
    API --> DB
    API --> Storage

    style Client fill:#0B0D11,stroke:#6C63FF,color:#F1F5F9
    style Backend fill:#12141A,stroke:#2A2D35,color:#94A3B8
    style Routing fill:#181B22,stroke:#6C63FF,color:#918AFF
    style Layout fill:#181B22,stroke:#2A2D35,color:#F1F5F9
    style Pages fill:#181B22,stroke:#2A2D35,color:#F1F5F9
    style SharedUI fill:#181B22,stroke:#34D399,color:#F1F5F9
    style StateLayer fill:#181B22,stroke:#FBBF24,color:#F1F5F9
    style Styling fill:#181B22,stroke:#60A5FA,color:#F1F5F9
```

## Layer Responsibilities

| Layer | Responsibility |
|-------|---------------|
| **Routing** | URL-to-page mapping, layout wrapping, route guards (planned) |
| **Layout** | Sidebar nav, page header, main content area with `<Outlet>` |
| **Pages** | Route-level containers, data fetching, page-specific logic |
| **Shared UI** | Reusable presentational components (cards, charts, placeholders) |
| **State** | React Context providers for auth, projects, tasks, time entries |
| **Styling** | MUI theme (dark palette), Tailwind utilities, Framer animations |
| **Backend** | API endpoints, authentication, database, file storage (planned) |
