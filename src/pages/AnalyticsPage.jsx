import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, LinearProgress, Chip } from '@mui/material';
import {
  BarChart,
  TrendingUp,
  PieChart as PieChartIcon,
  Speed,
  CheckCircle,
  AccessTime,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import { useProjects } from '../context/ProjectContext';
import { useTasks } from '../context/TaskContext';
import { useTime } from '../context/TimeContext';
import { formatDuration, computeProjectProgress, STATUS_DISPLAY, PRIORITY_COLOR } from '../utils/format';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function AnalyticsPage() {
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { entries } = useTime();

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const completionRate = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const totalEstimated = tasks.reduce((s, t) => s + (t.estimatedHours || 0), 0);
    const totalLogged = tasks.reduce((s, t) => s + (t.loggedHours || 0), 0);
    const totalMinutes = entries.reduce((s, e) => s + e.durationMinutes, 0);

    // Avg cycle time (simple: logged hours / done tasks)
    const avgHoursPerTask = doneTasks ? (totalLogged / doneTasks).toFixed(1) : 0;

    // Priority breakdown
    const byPriority = { critical: 0, high: 0, medium: 0, low: 0 };
    tasks.forEach((t) => { if (byPriority[t.priority] !== undefined) byPriority[t.priority]++; });

    // Status breakdown
    const byStatus = { todo: 0, in_progress: 0, in_review: 0, done: 0 };
    tasks.forEach((t) => { if (byStatus[t.status] !== undefined) byStatus[t.status]++; });

    return {
      totalTasks, doneTasks, inProgress, completionRate,
      totalEstimated, totalLogged, totalMinutes,
      avgHoursPerTask, byPriority, byStatus,
    };
  }, [tasks, entries]);

  // Per-project breakdown
  const projectBreakdown = useMemo(() => {
    return projects.map((p) => {
      const pTasks = tasks.filter((t) => t.projectId === p.id);
      const progress = computeProjectProgress(pTasks);
      const logged = pTasks.reduce((s, t) => s + (t.loggedHours || 0), 0);
      const estimated = pTasks.reduce((s, t) => s + (t.estimatedHours || 0), 0);
      const statusInfo = STATUS_DISPLAY[p.status] || STATUS_DISPLAY.on_track;
      return { ...p, progress, logged, estimated, taskCount: pTasks.length, statusInfo };
    }).sort((a, b) => b.progress - a.progress);
  }, [projects, tasks]);

  // Time by project for the "pie chart" display
  const timeByProject = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      if (!map[e.projectId]) map[e.projectId] = 0;
      map[e.projectId] += e.durationMinutes;
    });
    return projects
      .map((p) => ({ name: p.name, color: p.color, minutes: map[p.id] || 0 }))
      .filter((x) => x.minutes > 0)
      .sort((a, b) => b.minutes - a.minutes);
  }, [projects, entries]);

  const totalTimeMinutes = timeByProject.reduce((s, x) => s + x.minutes, 0);

  const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', in_review: 'In Review', done: 'Done' };
  const STATUS_COLORS = { todo: '#94A3B8', in_progress: '#6C63FF', in_review: '#FBBF24', done: '#34D399' };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <PageHeader
        title="Analytics"
        subtitle="Performance metrics, productivity insights, and value delivery tracking."
      />

      {/* KPI row */}
      <motion.div variants={item} className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          subtitle={`${stats.doneTasks}/${stats.totalTasks} tasks`}
          icon={CheckCircle}
          color="#34D399"
        />
        <StatCard
          title="Total Time Logged"
          value={formatDuration(stats.totalMinutes)}
          subtitle={`${stats.totalLogged.toFixed(1)}h on tasks`}
          icon={AccessTime}
          color="#60A5FA"
        />
        <StatCard
          title="Avg Hours/Task"
          value={`${stats.avgHoursPerTask}h`}
          subtitle="Completed tasks"
          icon={Speed}
          color="#6C63FF"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          subtitle="Active tasks now"
          icon={TrendingUp}
          color="#FBBF24"
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Task status distribution */}
        <motion.div variants={item}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <h3 className="mb-4 text-base font-semibold text-white">Task Status Distribution</h3>
              <div className="space-y-4">
                {Object.entries(stats.byStatus).map(([status, count]) => {
                  const pct = stats.totalTasks ? Math.round((count / stats.totalTasks) * 100) : 0;
                  return (
                    <div key={status}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[status] }} />
                          <span className="text-sm text-slate-300">{STATUS_LABELS[status]}</span>
                        </div>
                        <span className="text-sm font-semibold text-white">{count} <span className="text-xs text-slate-500 font-normal">({pct}%)</span></span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: '#1E2128',
                          '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: STATUS_COLORS[status] },
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Priority breakdown */}
        <motion.div variants={item}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <h3 className="mb-4 text-base font-semibold text-white">Priority Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(stats.byPriority).map(([priority, count]) => {
                  const pct = stats.totalTasks ? Math.round((count / stats.totalTasks) * 100) : 0;
                  const color = PRIORITY_COLOR[priority];
                  return (
                    <div key={priority}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-sm capitalize text-slate-300">{priority}</span>
                        </div>
                        <span className="text-sm font-semibold text-white">{count} <span className="text-xs text-slate-500 font-normal">({pct}%)</span></span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: '#1E2128',
                          '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: color },
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Time by project */}
        <motion.div variants={item}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <h3 className="mb-4 text-base font-semibold text-white">Time Distribution by Project</h3>
              {timeByProject.length > 0 ? (
                <div className="space-y-4">
                  {timeByProject.map((p) => {
                    const pct = totalTimeMinutes ? Math.round((p.minutes / totalTimeMinutes) * 100) : 0;
                    return (
                      <div key={p.name}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                            <span className="text-sm text-slate-300">{p.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-white">
                            {formatDuration(p.minutes)} <span className="text-xs text-slate-500 font-normal">({pct}%)</span>
                          </span>
                        </div>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#1E2128',
                            '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: p.color },
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-slate-500">No time entries recorded yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Project health */}
        <motion.div variants={item}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <h3 className="mb-4 text-base font-semibold text-white">Project Health Overview</h3>
              <div className="space-y-4">
                {projectBreakdown.map((p) => (
                  <div key={p.id} className="rounded-lg border border-[#2A2D35] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-sm font-medium text-slate-200">{p.name}</span>
                      </div>
                      <Chip
                        label={p.statusInfo.label}
                        size="small"
                        sx={{ backgroundColor: p.statusInfo.color + '15', color: p.statusInfo.color, fontSize: '0.6rem', height: 20 }}
                      />
                    </div>
                    <LinearProgress
                      variant="determinate"
                      value={p.progress}
                      sx={{
                        height: 5,
                        borderRadius: 3,
                        backgroundColor: '#1E2128',
                        '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: p.color },
                      }}
                    />
                    <div className="mt-1.5 flex justify-between text-xs text-slate-500">
                      <span>{p.taskCount} tasks · {p.logged.toFixed(1)}/{p.estimated.toFixed(1)}h</span>
                      <span>{p.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
