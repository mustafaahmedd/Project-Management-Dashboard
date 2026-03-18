# Activity Diagrams

> Model the step-by-step workflows for key user actions.

---

## 1. Task Lifecycle — From Creation to Completion

```mermaid
flowchart TD
    Start([Start]) --> CreateTask[Create New Task]
    CreateTask --> FillDetails[Fill Title, Description,<br/>Priority, Deadline]
    FillDetails --> AssignProject{Assign to<br/>Project?}

    AssignProject -->|Yes| SelectProject[Select Project]
    AssignProject -->|No| Backlog[Add to Personal Backlog]
    SelectProject --> SetEstimate[Set Time Estimate]
    Backlog --> SetEstimate

    SetEstimate --> AddSubtasks{Add<br/>Subtasks?}
    AddSubtasks -->|Yes| CreateSubtasks[Create Subtask Checklist]
    AddSubtasks -->|No| TaskReady[Task Ready — Status: To Do]
    CreateSubtasks --> TaskReady

    TaskReady --> StartWork[Move to In Progress]
    StartWork --> StartTimer[Start Time Tracker]
    StartTimer --> DoWork[Work on Task]
    DoWork --> SubtaskCheck{All Subtasks<br/>Done?}

    SubtaskCheck -->|No| DoWork
    SubtaskCheck -->|Yes| StopTimer[Stop Timer]
    StopTimer --> SubmitReview[Move to In Review]

    SubmitReview --> ReviewDecision{Review<br/>Passed?}
    ReviewDecision -->|No| Rework[Move Back to In Progress]
    Rework --> StartTimer
    ReviewDecision -->|Yes| MarkDone[Move to Done]
    MarkDone --> LogMetrics[Log Completion Metrics]
    LogMetrics --> End([End])

    style Start fill:#6C63FF,stroke:#6C63FF,color:#fff
    style End fill:#34D399,stroke:#34D399,color:#fff
    style TaskReady fill:#181B22,stroke:#60A5FA,color:#F1F5F9
    style MarkDone fill:#181B22,stroke:#34D399,color:#F1F5F9
    style Rework fill:#181B22,stroke:#F87171,color:#F1F5F9
```

---

## 2. Project Creation & Setup Workflow

```mermaid
flowchart TD
    Start([Start]) --> InitProject[Click 'New Project']
    InitProject --> EnterDetails[Enter Name, Description,<br/>Color, Category]
    EnterDetails --> SetDeadline[Set Project Deadline]
    SetDeadline --> AddMilestones{Add<br/>Milestones?}

    AddMilestones -->|Yes| DefineMilestones[Define Milestone Name,<br/>Target Date, Criteria]
    AddMilestones -->|No| AddTasks
    DefineMilestones --> AddTasks{Add Initial<br/>Tasks?}

    AddTasks -->|Yes| BulkCreate[Bulk Create Tasks<br/>with Priorities & Deadlines]
    AddTasks -->|No| ProjectCreated
    BulkCreate --> ProjectCreated[Project Created<br/>Status: Active]

    ProjectCreated --> DashboardUpdate[Dashboard Stats Updated]
    DashboardUpdate --> SidebarUpdate[Project Appears in Sidebar]
    SidebarUpdate --> End([End])

    style Start fill:#6C63FF,stroke:#6C63FF,color:#fff
    style End fill:#34D399,stroke:#34D399,color:#fff
    style ProjectCreated fill:#181B22,stroke:#6C63FF,color:#F1F5F9
```

---

## 3. Time Tracking Session Workflow

```mermaid
flowchart TD
    Start([Start]) --> SelectTask[Select Task to Track]
    SelectTask --> HasEstimate{Has Time<br/>Estimate?}

    HasEstimate -->|No| SetEstimate[Set Estimated Duration]
    HasEstimate -->|Yes| StartTimer
    SetEstimate --> StartTimer[Click Start Timer]

    StartTimer --> TimerRunning[Timer Running ⏱️]
    TimerRunning --> UserAction{User Action}

    UserAction -->|Pause| PauseTimer[Pause Timer]
    PauseTimer --> ResumeDecision{Resume?}
    ResumeDecision -->|Yes| TimerRunning
    ResumeDecision -->|No| DiscardOrSave{Save<br/>Progress?}

    UserAction -->|Stop| StopTimer[Stop Timer]
    UserAction -->|Switch Task| SaveAndSwitch[Save Current Entry<br/>& Switch Task]
    SaveAndSwitch --> SelectTask

    StopTimer --> AddNotes{Add Notes?}
    AddNotes -->|Yes| WriteNotes[Write Session Notes]
    AddNotes -->|No| SaveEntry
    WriteNotes --> SaveEntry[Save Time Entry]

    DiscardOrSave -->|Save| SaveEntry
    DiscardOrSave -->|Discard| Discard[Discard Entry]

    SaveEntry --> UpdateMetrics[Update Task Hours<br/>& Project Totals]
    UpdateMetrics --> End([End])
    Discard --> End

    style Start fill:#6C63FF,stroke:#6C63FF,color:#fff
    style End fill:#34D399,stroke:#34D399,color:#fff
    style TimerRunning fill:#181B22,stroke:#FBBF24,color:#F1F5F9
```

---

## 4. Analytics Report Generation Workflow

```mermaid
flowchart TD
    Start([Start]) --> OpenAnalytics[Navigate to Analytics]
    OpenAnalytics --> LoadData[Fetch Projects, Tasks,<br/>Time Entries Data]
    LoadData --> ComputeKPIs[Compute KPIs:<br/>Velocity, Burn Rate,<br/>Cycle Time, Value]

    ComputeKPIs --> RenderCharts[Render Charts:<br/>Trends, Distribution,<br/>Burndown]
    RenderCharts --> UserInteraction{User Interaction}

    UserInteraction -->|Filter by Date| ApplyDateFilter[Apply Date Range Filter]
    UserInteraction -->|Filter by Project| ApplyProjectFilter[Apply Project Filter]
    UserInteraction -->|Export| SelectFormat{Select Format}
    UserInteraction -->|Drill Down| DrillDown[Expand Chart Detail]

    ApplyDateFilter --> ComputeKPIs
    ApplyProjectFilter --> ComputeKPIs
    DrillDown --> ShowDetail[Show Detailed Breakdown]
    ShowDetail --> UserInteraction

    SelectFormat -->|PDF| ExportPDF[Generate PDF Report]
    SelectFormat -->|CSV| ExportCSV[Generate CSV Data]
    ExportPDF --> Download[Download File]
    ExportCSV --> Download
    Download --> End([End])

    style Start fill:#6C63FF,stroke:#6C63FF,color:#fff
    style End fill:#34D399,stroke:#34D399,color:#fff
    style RenderCharts fill:#181B22,stroke:#FBBF24,color:#F1F5F9
```
