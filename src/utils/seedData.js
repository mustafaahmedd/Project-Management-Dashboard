// Seed data uses fixed IDs — uid.js is used at runtime for new items

const SEED_ROLES = [
  {
    id: 'role-1',
    title: 'Software Engineer',
    company: 'FHS Technologies',
    type: 'employee',
    isActive: true,
    startDate: '2025-06-01',
    endDate: null,
    createdAt: '2025-06-01T09:00:00Z',
  },
  {
    id: 'role-2',
    title: 'Freelance Developer',
    company: 'Freelance',
    type: 'freelancer',
    isActive: true,
    startDate: '2024-01-15',
    endDate: null,
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'role-3',
    title: 'Co-founder & CTO',
    company: 'DataViz Labs',
    type: 'founder',
    isActive: true,
    startDate: '2025-11-01',
    endDate: null,
    createdAt: '2025-11-01T09:00:00Z',
  },
];

const SEED_PROFILE = {
  id: 'user-1',
  name: 'Mustafa Ahmed',
  email: 'mustafa@example.com',
  avatar: null,
  bio: 'Full-stack software engineer working across multiple companies and projects.',
  primaryRoleId: 'role-1',
  skills: ['React', 'Node.js', 'TypeScript', 'Python', 'UI/UX', 'DevOps'],
  createdAt: '2025-01-01T09:00:00Z',
};

const SEED_PROJECTS = [
  {
    id: 'proj-1',
    name: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration and admin panel.',
    color: '#6C63FF',
    status: 'on_track',
    priority: 'high',
    startDate: '2026-01-15',
    deadline: '2026-04-15',
    ownerId: 'user-1',
    memberIds: ['user-1'],
    roleId: 'role-1',
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'proj-2',
    name: 'Mobile App Redesign',
    description: 'UI/UX overhaul for the flagship mobile application across iOS and Android.',
    color: '#FBBF24',
    status: 'at_risk',
    priority: 'high',
    startDate: '2026-02-01',
    deadline: '2026-04-01',
    ownerId: 'user-1',
    memberIds: ['user-1'],
    roleId: 'role-2',
    createdAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'proj-3',
    name: 'API Migration v3',
    description: 'Migrate REST endpoints to v3 with improved auth, rate limiting and caching.',
    color: '#34D399',
    status: 'on_track',
    priority: 'critical',
    startDate: '2026-01-20',
    deadline: '2026-03-28',
    ownerId: 'user-1',
    memberIds: ['user-1'],
    roleId: 'role-1',
    createdAt: '2026-01-20T09:00:00Z',
  },
  {
    id: 'proj-4',
    name: 'Dashboard Analytics',
    description: 'Build real-time analytics dashboard with charts, KPIs and export capabilities.',
    color: '#F87171',
    status: 'behind',
    priority: 'medium',
    startDate: '2026-02-15',
    deadline: '2026-05-10',
    ownerId: 'user-1',
    memberIds: ['user-1'],
    roleId: 'role-3',
    createdAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'proj-5',
    name: 'CI/CD Pipeline Revamp',
    description: 'Redesign the CI/CD pipeline for faster builds, better caching and parallel jobs.',
    color: '#60A5FA',
    status: 'on_track',
    priority: 'medium',
    startDate: '2026-02-10',
    deadline: '2026-04-20',
    ownerId: 'user-1',
    memberIds: ['user-1'],
    roleId: 'role-1',
    createdAt: '2026-02-10T09:00:00Z',
  },
  {
    id: 'proj-6',
    name: 'Design System v2',
    description: 'Component library update with new tokens, accessibility improvements and docs.',
    color: '#C084FC',
    status: 'at_risk',
    priority: 'low',
    startDate: '2026-02-20',
    deadline: '2026-04-30',
    ownerId: 'user-1',
    memberIds: ['user-1'],
    roleId: 'role-2',
    createdAt: '2026-02-20T09:00:00Z',
  },
];

const SEED_TASKS = [
  // E-Commerce Platform (FHS Technologies)
  { id: 'task-1', title: 'Set up project repo and boilerplate', description: '', tags: [], projectId: 'proj-1', status: 'done', priority: 'low', deadline: '2026-01-20', estimatedHours: 2, loggedHours: 1.5, createdAt: '2026-01-15T10:00:00Z', subtasks: [] },
  { id: 'task-2', title: 'Design database schema', description: 'Define tables for products, orders, users, and payments. Include indexes and relationships.', tags: ['database'], projectId: 'proj-1', status: 'done', priority: 'high', deadline: '2026-01-25', estimatedHours: 6, loggedHours: 5, createdAt: '2026-01-16T10:00:00Z', subtasks: [] },
  { id: 'task-3', title: 'Build product listing component', description: 'React component with grid/list view toggle, filtering by category, and pagination.', tags: ['frontend', 'component'], projectId: 'proj-1', status: 'in_progress', priority: 'medium', deadline: '2026-03-21', estimatedHours: 8, loggedHours: 3.5, createdAt: '2026-03-10T10:00:00Z', subtasks: [{ id: 'st-1', title: 'Product card UI', completed: true }, { id: 'st-2', title: 'Filtering logic', completed: false }, { id: 'st-3', title: 'Pagination', completed: false }] },
  { id: 'task-4', title: 'Implement shopping cart', description: '', tags: ['frontend', 'state'], projectId: 'proj-1', status: 'todo', priority: 'high', deadline: '2026-03-28', estimatedHours: 12, loggedHours: 0, createdAt: '2026-03-12T10:00:00Z', subtasks: [] },
  { id: 'task-5', title: 'Payment integration (Stripe)', description: '', tags: ['backend', 'payments'], projectId: 'proj-1', status: 'todo', priority: 'high', deadline: '2026-04-05', estimatedHours: 16, loggedHours: 0, createdAt: '2026-03-12T10:00:00Z', subtasks: [] },
  { id: 'task-6', title: 'Admin panel — product management', description: '', tags: ['frontend', 'admin'], projectId: 'proj-1', status: 'todo', priority: 'medium', deadline: '2026-04-10', estimatedHours: 10, loggedHours: 0, createdAt: '2026-03-12T10:00:00Z', subtasks: [] },

  // API Migration v3 (FHS Technologies)
  { id: 'task-7', title: 'Implement auth middleware refactor', description: 'Refactor auth middleware to support JWT validation, refresh tokens, and role-based guards.', tags: ['backend', 'auth'], projectId: 'proj-3', status: 'in_progress', priority: 'high', deadline: '2026-03-20', estimatedHours: 10, loggedHours: 6.5, createdAt: '2026-03-05T10:00:00Z', subtasks: [{ id: 'st-4', title: 'JWT validation', completed: true }, { id: 'st-5', title: 'Refresh token flow', completed: true }, { id: 'st-6', title: 'Role-based guards', completed: false }] },
  { id: 'task-8', title: 'PR #247 — Auth Module tests', description: '', tags: ['testing'], projectId: 'proj-3', status: 'in_review', priority: 'high', deadline: '2026-03-19', estimatedHours: 4, loggedHours: 3, createdAt: '2026-03-15T10:00:00Z', subtasks: [] },
  { id: 'task-9', title: 'Write API documentation for v3', description: '', tags: ['docs'], projectId: 'proj-3', status: 'todo', priority: 'medium', deadline: '2026-03-24', estimatedHours: 6, loggedHours: 0, createdAt: '2026-03-10T10:00:00Z', subtasks: [] },
  { id: 'task-10', title: 'Rate limiting middleware', description: '', tags: ['backend', 'security'], projectId: 'proj-3', status: 'done', priority: 'high', deadline: '2026-03-10', estimatedHours: 8, loggedHours: 7, createdAt: '2026-02-20T10:00:00Z', subtasks: [] },
  { id: 'task-11', title: 'Cache layer implementation', description: '', tags: ['backend', 'performance'], projectId: 'proj-3', status: 'done', priority: 'medium', deadline: '2026-03-05', estimatedHours: 6, loggedHours: 5.5, createdAt: '2026-02-20T10:00:00Z', subtasks: [] },

  // Mobile App Redesign (Freelance)
  { id: 'task-12', title: 'Design onboarding flow wireframes', description: '', tags: ['design', 'ux'], projectId: 'proj-2', status: 'todo', priority: 'low', deadline: '2026-03-25', estimatedHours: 5, loggedHours: 0, createdAt: '2026-03-10T10:00:00Z', subtasks: [] },
  { id: 'task-13', title: 'Redesign home screen', description: '', tags: ['design', 'ui'], projectId: 'proj-2', status: 'in_progress', priority: 'high', deadline: '2026-03-22', estimatedHours: 12, loggedHours: 4, createdAt: '2026-03-05T10:00:00Z', subtasks: [] },
  { id: 'task-14', title: 'Update navigation patterns', description: '', tags: ['design'], projectId: 'proj-2', status: 'done', priority: 'medium', deadline: '2026-03-10', estimatedHours: 6, loggedHours: 5.5, createdAt: '2026-02-15T10:00:00Z', subtasks: [] },
  { id: 'task-15', title: 'Implement gesture controls', description: '', tags: ['frontend', 'mobile'], projectId: 'proj-2', status: 'todo', priority: 'medium', deadline: '2026-03-30', estimatedHours: 8, loggedHours: 0, createdAt: '2026-03-10T10:00:00Z', subtasks: [] },

  // Dashboard Analytics (DataViz Labs)
  { id: 'task-16', title: 'Set up project repo and boilerplate', description: '', tags: [], projectId: 'proj-4', status: 'done', priority: 'low', deadline: '2026-02-20', estimatedHours: 2, loggedHours: 1.5, createdAt: '2026-02-15T10:00:00Z', subtasks: [] },
  { id: 'task-17', title: 'Define KPI data models', description: '', tags: ['backend', 'data'], projectId: 'proj-4', status: 'in_progress', priority: 'high', deadline: '2026-03-25', estimatedHours: 6, loggedHours: 2, createdAt: '2026-03-10T10:00:00Z', subtasks: [] },
  { id: 'task-18', title: 'Build chart components', description: '', tags: ['frontend', 'charts'], projectId: 'proj-4', status: 'todo', priority: 'high', deadline: '2026-04-05', estimatedHours: 14, loggedHours: 0, createdAt: '2026-03-10T10:00:00Z', subtasks: [] },

  // CI/CD Pipeline Revamp (FHS Technologies)
  { id: 'task-19', title: 'Set up CI/CD pipeline for staging', description: '', tags: ['devops'], projectId: 'proj-5', status: 'todo', priority: 'high', deadline: '2026-03-22', estimatedHours: 8, loggedHours: 0, createdAt: '2026-03-10T10:00:00Z', subtasks: [] },
  { id: 'task-20', title: 'Configure parallel job execution', description: '', tags: ['devops'], projectId: 'proj-5', status: 'done', priority: 'medium', deadline: '2026-03-05', estimatedHours: 6, loggedHours: 5, createdAt: '2026-02-15T10:00:00Z', subtasks: [] },
  { id: 'task-21', title: 'Implement build caching', description: '', tags: ['devops', 'performance'], projectId: 'proj-5', status: 'done', priority: 'high', deadline: '2026-03-10', estimatedHours: 10, loggedHours: 9, createdAt: '2026-02-15T10:00:00Z', subtasks: [] },
  { id: 'task-22', title: 'CI pipeline debugging', description: '', tags: ['devops'], projectId: 'proj-5', status: 'in_review', priority: 'medium', deadline: '2026-03-20', estimatedHours: 4, loggedHours: 3.5, createdAt: '2026-03-15T10:00:00Z', subtasks: [] },

  // Design System v2 (Freelance)
  { id: 'task-23', title: 'Configure Tailwind + MUI theme', description: '', tags: ['frontend', 'design-system'], projectId: 'proj-6', status: 'done', priority: 'medium', deadline: '2026-03-01', estimatedHours: 4, loggedHours: 3, createdAt: '2026-02-20T10:00:00Z', subtasks: [] },
  { id: 'task-24', title: 'Update color tokens for dark mode', description: '', tags: ['design-system'], projectId: 'proj-6', status: 'in_review', priority: 'medium', deadline: '2026-03-21', estimatedHours: 5, loggedHours: 4, createdAt: '2026-03-10T10:00:00Z', subtasks: [] },
  { id: 'task-25', title: 'Build button component variants', description: '', tags: ['frontend', 'design-system'], projectId: 'proj-6', status: 'in_progress', priority: 'low', deadline: '2026-03-28', estimatedHours: 6, loggedHours: 2, createdAt: '2026-03-10T10:00:00Z', subtasks: [] },
  { id: 'task-26', title: 'Accessibility audit', description: '', tags: ['a11y'], projectId: 'proj-6', status: 'todo', priority: 'high', deadline: '2026-04-10', estimatedHours: 8, loggedHours: 0, createdAt: '2026-03-10T10:00:00Z', subtasks: [] },
];

// Add assigneeId to all tasks
SEED_TASKS.forEach((t) => { t.assigneeId = 'user-1'; });

const SEED_TIME_ENTRIES = [
  { id: 'te-1', taskId: 'task-7', projectId: 'proj-3', userId: 'user-1', startTime: '2026-03-19T09:00:00Z', endTime: '2026-03-19T11:15:00Z', durationMinutes: 135, notes: 'Worked on JWT validation and refresh token flow' },
  { id: 'te-2', taskId: 'task-3', projectId: 'proj-1', userId: 'user-1', startTime: '2026-03-19T11:30:00Z', endTime: '2026-03-19T13:15:00Z', durationMinutes: 105, notes: 'Built product card UI component' },
  { id: 'te-3', taskId: 'task-8', projectId: 'proj-3', userId: 'user-1', startTime: '2026-03-19T14:00:00Z', endTime: '2026-03-19T14:40:00Z', durationMinutes: 40, notes: 'Reviewed auth module PR and added comments' },
  { id: 'te-4', taskId: 'task-22', projectId: 'proj-5', userId: 'user-1', startTime: '2026-03-18T09:00:00Z', endTime: '2026-03-18T12:10:00Z', durationMinutes: 190, notes: 'Debugged CI pipeline failures on staging' },
  { id: 'te-5', taskId: 'task-13', projectId: 'proj-2', userId: 'user-1', startTime: '2026-03-18T13:00:00Z', endTime: '2026-03-18T14:00:00Z', durationMinutes: 60, notes: 'Sprint planning meeting' },
  { id: 'te-6', taskId: 'task-17', projectId: 'proj-4', userId: 'user-1', startTime: '2026-03-17T10:00:00Z', endTime: '2026-03-17T12:00:00Z', durationMinutes: 120, notes: 'Defined KPI data models for analytics' },
  { id: 'te-7', taskId: 'task-25', projectId: 'proj-6', userId: 'user-1', startTime: '2026-03-17T14:00:00Z', endTime: '2026-03-17T16:00:00Z', durationMinutes: 120, notes: 'Built initial button component variants' },
  { id: 'te-8', taskId: 'task-7', projectId: 'proj-3', userId: 'user-1', startTime: '2026-03-16T09:00:00Z', endTime: '2026-03-16T13:00:00Z', durationMinutes: 240, notes: 'Auth middleware refactor — role-based guards' },
  { id: 'te-9', taskId: 'task-3', projectId: 'proj-1', userId: 'user-1', startTime: '2026-03-16T14:00:00Z', endTime: '2026-03-16T16:30:00Z', durationMinutes: 150, notes: 'Product listing — filtering logic started' },
  { id: 'te-10', taskId: 'task-24', projectId: 'proj-6', userId: 'user-1', startTime: '2026-03-15T10:00:00Z', endTime: '2026-03-15T14:00:00Z', durationMinutes: 240, notes: 'Updated dark mode color tokens across all components' },
];

const SEED_MILESTONES = [
  { id: 'ms-1', title: 'API v3 Launch', projectId: 'proj-3', targetDate: '2026-03-28', status: 'on_track', taskIds: ['task-7', 'task-8', 'task-9', 'task-10', 'task-11'] },
  { id: 'ms-2', title: 'E-Commerce Beta Release', projectId: 'proj-1', targetDate: '2026-04-01', status: 'on_track', taskIds: ['task-1', 'task-2', 'task-3', 'task-4'] },
  { id: 'ms-3', title: 'Mobile App Alpha', projectId: 'proj-2', targetDate: '2026-04-10', status: 'at_risk', taskIds: ['task-12', 'task-13', 'task-14', 'task-15'] },
  { id: 'ms-4', title: 'Design System Docs', projectId: 'proj-6', targetDate: '2026-04-15', status: 'behind', taskIds: ['task-23', 'task-24', 'task-25', 'task-26'] },
  { id: 'ms-5', title: 'Analytics Dashboard MVP', projectId: 'proj-4', targetDate: '2026-05-01', status: 'behind', taskIds: ['task-16', 'task-17', 'task-18'] },
];

const SEED_LOGS = [
  {
    id: 'log-1',
    date: '2026-03-19',
    content: '@API Migration: Worked on JWT validation and refresh token flow for 2h\n@E-Commerce: Built product card UI component\n@API Migration: Reviewed auth module PR and added comments\n!Need to follow up on the role-based guards PR tomorrow',
    parsedItems: [
      { text: 'Worked on JWT validation and refresh token flow for 2h', projectId: 'proj-3', projectName: 'API Migration v3', taskId: null, hoursSpent: 2, tags: [] },
      { text: 'Built product card UI component', projectId: 'proj-1', projectName: 'E-Commerce Platform', taskId: null, hoursSpent: null, tags: [] },
      { text: 'Reviewed auth module PR and added comments', projectId: 'proj-3', projectName: 'API Migration v3', taskId: null, hoursSpent: null, tags: [] },
    ],
    priorityNotes: 'Need to follow up on the role-based guards PR tomorrow',
    createdAt: '2026-03-19T18:00:00Z',
  },
  {
    id: 'log-2',
    date: '2026-03-18',
    content: '@CI/CD Pipeline: Debugged CI pipeline failures on staging for 3h\n@Mobile App: Sprint planning meeting 1h\n- Reviewed PRs from team\n!CI staging still flaky — need to check caching config',
    parsedItems: [
      { text: 'Debugged CI pipeline failures on staging for 3h', projectId: 'proj-5', projectName: 'CI/CD Pipeline Revamp', taskId: null, hoursSpent: 3, tags: [] },
      { text: 'Sprint planning meeting 1h', projectId: 'proj-2', projectName: 'Mobile App Redesign', taskId: null, hoursSpent: 1, tags: [] },
      { text: 'Reviewed PRs from team', projectId: null, projectName: null, taskId: null, hoursSpent: null, tags: [] },
    ],
    priorityNotes: 'CI staging still flaky — need to check caching config',
    createdAt: '2026-03-18T18:00:00Z',
  },
  {
    id: 'log-3',
    date: '2026-03-17',
    content: '@Dashboard Analytics: Defined KPI data models 2h\n@Design System: Built initial button component variants 2h\n- Team standup\n- Code review for auth module',
    parsedItems: [
      { text: 'Defined KPI data models 2h', projectId: 'proj-4', projectName: 'Dashboard Analytics', taskId: null, hoursSpent: 2, tags: [] },
      { text: 'Built initial button component variants 2h', projectId: 'proj-6', projectName: 'Design System v2', taskId: null, hoursSpent: 2, tags: [] },
      { text: 'Team standup', projectId: null, projectName: null, taskId: null, hoursSpent: null, tags: [] },
      { text: 'Code review for auth module', projectId: null, projectName: null, taskId: null, hoursSpent: null, tags: [] },
    ],
    priorityNotes: '',
    createdAt: '2026-03-17T18:00:00Z',
  },
];

export { SEED_ROLES, SEED_PROFILE, SEED_PROJECTS, SEED_TASKS, SEED_TIME_ENTRIES, SEED_MILESTONES, SEED_LOGS };
