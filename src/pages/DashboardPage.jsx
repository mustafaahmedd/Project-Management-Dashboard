import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, LinearProgress, Chip, Button, TextField, MenuItem } from '@mui/material';
import {
  FolderCopy,
  CheckCircleOutline,
  Timer,
  TrendingUp,
  Assignment,
  Add,
  EditNote,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import FormDialog from '../components/common/FormDialog';
import { useProjects } from '../context/ProjectContext';
import { useTasks } from '../context/TaskContext';
import { useTime } from '../context/TimeContext';
import { useUser } from '../context/UserContext';
import { computeProjectProgress, STATUS_DISPLAY, PRIORITY_COLOR, relativeDate, formatDuration } from '../utils/format';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const EMPTY_TASK_FORM = {
  title: '',
  projectId: '',
  priority: 'medium',
  deadline: '',
  description: '',
};

export default function DashboardPage() {
  const { projects } = useProjects();
  const { tasks, addTask } = useTasks();
  const { entries } = useTime();
  const { profile, roles } = useUser();
  const navigate = useNavigate();

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [taskForm, setTaskForm] = useState(EMPTY_TASK_FORM);

  // Group projects by company for dropdown
  const projectsByCompany = useMemo(() => {
    const roleMap = {};
    roles.forEach((r) => { roleMap[r.id] = r; });
    const groups = {};
    projects.forEach((p) => {
      const role = p.roleId ? roleMap[p.roleId] : null;
      const company = role ? role.company : 'Unassigned';
      if (!groups[company]) groups[company] = [];
      groups[company].push(p);
    });
    return Object.entries(groups).sort(([a], [b]) => {
      if (a === 'Unassigned') return 1;
      if (b === 'Unassigned') return -1;
      return a.localeCompare(b);
    });
  }, [projects, roles]);

  const stats = useMemo(() => {
    const activeProjects = projects.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekMinutes = entries
      .filter((e) => new Date(e.startTime) >= weekStart)
      .reduce((sum, e) => sum + e.durationMinutes, 0);

    return { activeProjects, completedTasks, completionRate, weekMinutes };
  }, [projects, tasks, entries]);

  const recentProjects = useMemo(() => {
    return projects.slice(0, 4).map((p) => {
      const projectTasks = tasks.filter((t) => t.projectId === p.id);
      const progress = computeProjectProgress(projectTasks);
      const statusInfo = STATUS_DISPLAY[p.status] || STATUS_DISPLAY.on_track;
      return { ...p, progress, statusInfo, taskCount: projectTasks.length };
    });
  }, [projects, tasks]);

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== 'done' && t.deadline)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 6);
  }, [tasks]);

  const handleQuickAdd = () => {
    if (!taskForm.title.trim()) return;
    addTask({
      ...taskForm,
      status: 'todo',
    });
    setTaskForm(EMPTY_TASK_FORM);
    setQuickAddOpen(false);
  };

  const setField = (field) => (e) => setTaskForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${profile?.name?.split(' ')[0] || 'there'} — here's what's happening across your projects.`}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outlined"
              startIcon={<EditNote />}
              size="small"
              onClick={() => navigate('/daily-log')}
              sx={{ borderColor: '#34D39950', color: '#34D399', '&:hover': { borderColor: '#34D399', bgcolor: '#34D39910' } }}
            >
              Log Today's Work
            </Button>
            <Button variant="contained" startIcon={<Add />} size="small" onClick={() => setQuickAddOpen(true)}>
              Quick Add Task
            </Button>
          </div>
        }
      />

      {/* Stat cards */}
      <motion.div variants={item} className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          subtitle={`${projects.length} total`}
          icon={FolderCopy}
          color="#6C63FF"
        />
        <StatCard
          title="Tasks Completed"
          value={stats.completedTasks}
          subtitle={`${stats.completionRate}% completion rate`}
          icon={CheckCircleOutline}
          color="#34D399"
        />
        <StatCard
          title="Hours Logged"
          value={formatDuration(stats.weekMinutes)}
          subtitle="This week"
          icon={Timer}
          color="#60A5FA"
        />
        <StatCard
          title="In Progress"
          value={tasks.filter((t) => t.status === 'in_progress').length}
          subtitle="Active tasks"
          icon={TrendingUp}
          color="#FBBF24"
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Recent projects */}
        <motion.div variants={item} className="xl:col-span-3">
          <Card>
            <CardContent sx={{ p: 3 }}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Recent Projects</h3>
                <button
                  onClick={() => navigate('/projects')}
                  className="text-xs font-medium text-[#6C63FF] hover:text-[#918AFF] transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-xl border border-[#2A2D35] p-4 cursor-pointer hover:border-[#6C63FF30] transition-colors"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="text-sm font-medium text-slate-200">
                          {project.name}
                        </span>
                      </div>
                      <Chip
                        label={project.statusInfo.label}
                        size="small"
                        sx={{
                          backgroundColor: `${project.statusInfo.color}15`,
                          color: project.statusInfo.color,
                          fontSize: '0.7rem',
                          height: 24,
                        }}
                      />
                    </div>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#1E2128',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          backgroundColor: project.color,
                        },
                      }}
                    />
                    <div className="mt-1.5 flex justify-between">
                      <span className="text-xs text-slate-500">
                        {project.taskCount} tasks
                      </span>
                      <span className="text-xs text-slate-500">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming tasks */}
        <motion.div variants={item} className="xl:col-span-2">
          <Card>
            <CardContent sx={{ p: 3 }}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Upcoming Tasks</h3>
                <button
                  onClick={() => navigate('/tasks')}
                  className="text-xs font-medium text-[#6C63FF] hover:text-[#918AFF] transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {upcomingTasks.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId);
                  const priorityColor = PRIORITY_COLOR[task.priority] || '#94A3B8';
                  return (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 rounded-lg border border-[#2A2D35] p-3 cursor-pointer hover:border-[#6C63FF30] transition-colors"
                      onClick={() => navigate('/tasks')}
                    >
                      <Assignment
                        sx={{ fontSize: 18, color: '#6C63FF', mt: '2px' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">
                          {task.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            {relativeDate(task.deadline)}
                          </span>
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: priorityColor }}
                          />
                          <span
                            className="text-xs font-medium capitalize"
                            style={{ color: priorityColor }}
                          >
                            {task.priority}
                          </span>
                          {project && (
                            <span className="text-xs text-slate-600 truncate">
                              · {project.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {upcomingTasks.length === 0 && (
                  <p className="py-6 text-center text-sm text-slate-500">No upcoming tasks</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Add Task dialog */}
      <FormDialog
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        title="Quick Add Task"
        submitLabel="Add Task"
        onSubmit={handleQuickAdd}
      >
        <div className="space-y-4 pt-1">
          <TextField
            label="Task Title"
            fullWidth
            value={taskForm.title}
            onChange={setField('title')}
            autoFocus
            placeholder="What needs to be done?"
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={taskForm.description}
            onChange={setField('description')}
            placeholder="Optional details..."
          />
          <TextField
            select
            label="Project"
            fullWidth
            value={taskForm.projectId}
            onChange={setField('projectId')}
          >
            <MenuItem value="">No Project</MenuItem>
            {projectsByCompany.map(([company, companyProjects]) => [
              <MenuItem key={`header-${company}`} disabled sx={{ opacity: 0.6, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', mt: 1 }}>
                {company}
              </MenuItem>,
              ...companyProjects.map((p) => (
                <MenuItem key={p.id} value={p.id} sx={{ pl: 3 }}>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </div>
                </MenuItem>
              )),
            ])}
          </TextField>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              select
              label="Priority"
              fullWidth
              value={taskForm.priority}
              onChange={setField('priority')}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </TextField>
            <TextField
              label="Deadline"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={taskForm.deadline}
              onChange={setField('deadline')}
            />
          </div>
        </div>
      </FormDialog>
    </motion.div>
  );
}
