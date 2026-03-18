# Class Diagram — Data Models

> Defines the core entities, their attributes, relationships, and methods that will drive the dynamic state of ProjectPulse.

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +String role
        +String department
        +String avatarUrl
        +Date joinedAt
        +Object preferences
        +getFullName() String
        +getInitials() String
    }

    class Project {
        +String id
        +String name
        +String description
        +String color
        +String status
        +Date startDate
        +Date deadline
        +String ownerId
        +String[] memberIds
        +Number progress
        +getTaskCount() Number
        +getCompletedTaskCount() Number
        +computeProgress() Number
        +isOverdue() Boolean
        +getDaysRemaining() Number
    }

    class Task {
        +String id
        +String title
        +String description
        +String status
        +String priority
        +String projectId
        +String assigneeId
        +Date createdAt
        +Date deadline
        +Number estimatedHours
        +Number loggedHours
        +Subtask[] subtasks
        +isOverdue() Boolean
        +getCompletionPercent() Number
        +getRemainingHours() Number
    }

    class Subtask {
        +String id
        +String title
        +Boolean completed
        +toggle() void
    }

    class TimeEntry {
        +String id
        +String taskId
        +String projectId
        +String userId
        +Date startTime
        +Date endTime
        +Number durationMinutes
        +String notes
        +getDurationFormatted() String
    }

    class Milestone {
        +String id
        +String title
        +String projectId
        +Date targetDate
        +Number progress
        +String status
        +String[] taskIds
        +isOverdue() Boolean
        +computeProgress() Number
    }

    class Sprint {
        +String id
        +String name
        +Date startDate
        +Date endDate
        +String[] taskIds
        +Number targetPoints
        +getVelocity() Number
        +getBurndownData() Object[]
        +isActive() Boolean
    }

    class Notification {
        +String id
        +String userId
        +String type
        +String title
        +String message
        +Boolean read
        +Date createdAt
        +String linkedEntityId
        +markAsRead() void
    }

    class Analytics {
        +computeVelocity(tasks, sprint) Number
        +computeBurnRate(tasks, sprint) Number
        +computeAvgCycleTime(tasks) Number
        +computeValueDelivered(projects) Number
        +getTimeDistribution(entries) Object
        +getProductivityTrends(tasks, range) Object[]
        +getProjectComparison(projects) Object[]
    }

    %% ── Relationships ──
    User "1" --> "*" Project : owns
    User "1" --> "*" Task : assigned to
    User "1" --> "*" TimeEntry : logs

    Project "1" --> "*" Task : contains
    Project "1" --> "*" Milestone : has
    Project "1" --> "0..*" Sprint : runs

    Task "1" --> "*" Subtask : has
    Task "1" --> "*" TimeEntry : tracked by

    Milestone "1" --> "*" Task : tracks
    Sprint "1" --> "*" Task : includes

    Notification "*" --> "1" User : sent to

    Analytics ..> Project : reads
    Analytics ..> Task : reads
    Analytics ..> TimeEntry : reads
    Analytics ..> Sprint : reads
```

## Entity Relationship Summary

| Relationship | Type | Description |
|-------------|------|-------------|
| User → Project | 1:N | A user owns/manages multiple projects |
| User → Task | 1:N | A user is assigned multiple tasks |
| Project → Task | 1:N | A project contains many tasks |
| Project → Milestone | 1:N | A project has key milestones |
| Project → Sprint | 1:N | A project runs in sprints |
| Task → Subtask | 1:N | A task can have a checklist of subtasks |
| Task → TimeEntry | 1:N | Multiple time sessions per task |
| Sprint → Task | 1:N | A sprint includes a set of tasks |
| User → Notification | 1:N | Users receive deadline/status notifications |
| Analytics → All | reads | Computes metrics from projects, tasks, time, sprints |

## Enum Definitions

```
TaskStatus:    "draft" | "todo" | "in_progress" | "in_review" | "done" | "on_hold" | "cancelled"
TaskPriority:  "low" | "medium" | "high" | "critical"
ProjectStatus: "planning" | "active" | "on_track" | "at_risk" | "behind" | "completed" | "paused" | "archived"
UserRole:      "employee" | "manager" | "admin"
NotificationType: "deadline_approaching" | "task_assigned" | "review_requested" | "milestone_reached" | "status_changed"
```
