# State Diagrams

> Model the lifecycle states and transitions for key entities.

---

## 1. Task State Machine

```mermaid
stateDiagram-v2
    [*] --> Draft: User creates task

    Draft --> ToDo: Save task details
    Draft --> [*]: Discard

    ToDo --> InProgress: Start working
    ToDo --> Cancelled: Cancel task

    InProgress --> InReview: Submit for review
    InProgress --> ToDo: Put back (blocked)
    InProgress --> OnHold: Pause work

    OnHold --> InProgress: Resume work
    OnHold --> Cancelled: Cancel task

    InReview --> InProgress: Changes requested
    InReview --> Done: Review approved

    Done --> Reopened: Bug found / Rework needed
    Reopened --> InProgress: Start rework

    Done --> [*]: Archived
    Cancelled --> [*]: Archived

    state Draft {
        [*] --> FillTitle
        FillTitle --> SetPriority
        SetPriority --> SetDeadline
        SetDeadline --> AssignProject
        AssignProject --> [*]
    }

    state InProgress {
        [*] --> TimerActive
        TimerActive --> WorkingOnSubtasks
        WorkingOnSubtasks --> AllSubtasksDone
        AllSubtasksDone --> [*]
    }
```

---

## 2. Project State Machine

```mermaid
stateDiagram-v2
    [*] --> Planning: Create project

    Planning --> Active: Add tasks & set milestones
    Planning --> [*]: Discard

    Active --> OnTrack: Progress >= expected
    Active --> AtRisk: Deadline approaching,<br/>progress behind
    Active --> Behind: Significantly behind schedule

    OnTrack --> AtRisk: Slipping
    AtRisk --> OnTrack: Caught up
    AtRisk --> Behind: Further slipping
    Behind --> AtRisk: Some recovery

    OnTrack --> Completed: All milestones met
    AtRisk --> Completed: All milestones met
    Behind --> Completed: All milestones met (late)

    Completed --> Archived: Archive project
    Active --> Paused: Freeze project
    Paused --> Active: Resume project

    Archived --> [*]
```

---

## 3. Timer State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Page loaded

    Idle --> Running: Click Start
    Running --> Paused: Click Pause
    Running --> Stopped: Click Stop

    Paused --> Running: Click Resume
    Paused --> Stopped: Click Stop
    Paused --> Idle: Discard session

    Stopped --> Saving: Auto-save entry
    Saving --> Idle: Entry saved
    Saving --> Error: Save failed
    Error --> Saving: Retry
    Error --> Idle: Discard

    state Running {
        [*] --> Ticking
        Ticking --> Ticking: Every 1 second
    }
```

---

## 4. User Authentication State

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated: App loads

    Unauthenticated --> Authenticating: Submit credentials
    Authenticating --> Authenticated: Valid token received
    Authenticating --> Unauthenticated: Invalid credentials

    Authenticated --> TokenRefreshing: Token near expiry
    TokenRefreshing --> Authenticated: New token received
    TokenRefreshing --> Unauthenticated: Refresh failed

    Authenticated --> Unauthenticated: Logout
    Authenticated --> Unauthenticated: Token expired (401)

    state Authenticated {
        [*] --> BrowsingDashboard
        BrowsingDashboard --> ViewingProjects
        ViewingProjects --> ManagingTasks
        ManagingTasks --> TrackingTime
        TrackingTime --> ViewingAnalytics
        ViewingAnalytics --> BrowsingDashboard
    }
```
