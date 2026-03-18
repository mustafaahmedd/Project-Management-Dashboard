import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, Avatar, Chip, LinearProgress } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import { useProjects } from '../context/ProjectContext';
import { useTasks } from '../context/TaskContext';
import { useTime } from '../context/TimeContext';
import { formatDuration, PRIORITY_COLOR } from '../utils/format';

export default function ProfilePage() {
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { entries } = useTime();

  const stats = useMemo(() => {
    const activeProjects = projects.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const totalTasks = tasks.length;

    // Hours this week
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekMinutes = entries
      .filter((e) => new Date(e.startTime) >= weekStart)
      .reduce((sum, e) => sum + e.durationMinutes, 0);

    const totalMinutes = entries.reduce((sum, e) => sum + e.durationMinutes, 0);

    // Top priority worked on
    const byPriority = { critical: 0, high: 0, medium: 0, low: 0 };
    tasks.forEach((t) => { if (byPriority[t.priority] !== undefined) byPriority[t.priority]++; });

    return { activeProjects, completedTasks, totalTasks, weekMinutes, totalMinutes, byPriority };
  }, [projects, tasks, entries]);

  // Top projects by task count
  const topProjects = useMemo(() => {
    return projects
      .map((p) => ({
        ...p,
        taskCount: tasks.filter((t) => t.projectId === p.id).length,
        doneCount: tasks.filter((t) => t.projectId === p.id && t.status === 'done').length,
      }))
      .sort((a, b) => b.taskCount - a.taskCount)
      .slice(0, 4);
  }, [projects, tasks]);

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Your account details and activity summary."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-1"
        >
          <Card>
            <CardContent sx={{ p: 4 }}>
              <div className="flex flex-col items-center text-center">
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: '#6C63FF',
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  MA
                </Avatar>
                <h3 className="text-xl font-bold text-white">Mustafa Ahmed</h3>
                <p className="text-sm text-slate-400">Software Engineer</p>
                <div className="mt-3 flex gap-2">
                  <Chip label="Full-Stack" size="small" sx={{ bgcolor: '#6C63FF15', color: '#918AFF', fontSize: '0.7rem' }} />
                  <Chip label="Team Lead" size="small" sx={{ bgcolor: '#34D39915', color: '#34D399', fontSize: '0.7rem' }} />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-[#2A2D35] p-3">
                  <span className="text-sm text-slate-400">Email</span>
                  <span className="text-sm text-slate-200">mustafa@company.com</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#2A2D35] p-3">
                  <span className="text-sm text-slate-400">Department</span>
                  <span className="text-sm text-slate-200">Engineering</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#2A2D35] p-3">
                  <span className="text-sm text-slate-400">Joined</span>
                  <span className="text-sm text-slate-200">Jan 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats + Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="xl:col-span-2 space-y-6"
        >
          {/* Key stats */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <h3 className="mb-4 text-base font-semibold text-white">Performance Summary</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-[#2A2D35] p-4 text-center">
                  <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
                  <p className="text-xs text-slate-500">Active Projects</p>
                </div>
                <div className="rounded-xl border border-[#2A2D35] p-4 text-center">
                  <p className="text-2xl font-bold text-white">{stats.completedTasks}</p>
                  <p className="text-xs text-slate-500">Tasks Completed</p>
                </div>
                <div className="rounded-xl border border-[#2A2D35] p-4 text-center">
                  <p className="text-2xl font-bold text-white">{formatDuration(stats.weekMinutes)}</p>
                  <p className="text-xs text-slate-500">Hours This Week</p>
                </div>
                <div className="rounded-xl border border-[#2A2D35] p-4 text-center">
                  <p className="text-2xl font-bold text-white">{formatDuration(stats.totalMinutes)}</p>
                  <p className="text-xs text-slate-500">Total Logged</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priority breakdown */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <h3 className="mb-4 text-base font-semibold text-white">Task Priority Spread</h3>
              <div className="space-y-3">
                {Object.entries(stats.byPriority).map(([priority, count]) => {
                  const pct = stats.totalTasks ? Math.round((count / stats.totalTasks) * 100) : 0;
                  return (
                    <div key={priority}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm capitalize text-slate-300">{priority}</span>
                        <span className="text-sm text-slate-400">{count} ({pct}%)</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 5,
                          borderRadius: 3,
                          backgroundColor: '#1E2128',
                          '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: PRIORITY_COLOR[priority] },
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top projects */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <h3 className="mb-4 text-base font-semibold text-white">Top Projects</h3>
              <div className="space-y-3">
                {topProjects.map((p) => {
                  const pct = p.taskCount ? Math.round((p.doneCount / p.taskCount) * 100) : 0;
                  return (
                    <div key={p.id} className="rounded-lg border border-[#2A2D35] p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                          <span className="text-sm font-medium text-slate-200">{p.name}</span>
                        </div>
                        <span className="text-xs text-slate-500">{p.doneCount}/{p.taskCount} tasks</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 4,
                          borderRadius: 3,
                          backgroundColor: '#1E2128',
                          '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: p.color },
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
