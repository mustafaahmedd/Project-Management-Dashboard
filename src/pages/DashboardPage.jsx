import { motion } from 'framer-motion';
import { Card, CardContent, LinearProgress, Chip } from '@mui/material';
import {
  FolderCopy,
  CheckCircleOutline,
  Timer,
  TrendingUp,
  Assignment,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const recentProjects = [
  { name: 'E-Commerce Platform', progress: 72, status: 'On Track', color: '#34D399' },
  { name: 'Mobile App Redesign', progress: 45, status: 'At Risk', color: '#FBBF24' },
  { name: 'API Migration v3', progress: 90, status: 'On Track', color: '#34D399' },
  { name: 'Dashboard Analytics', progress: 20, status: 'Behind', color: '#F87171' },
];

const upcomingTasks = [
  { title: 'Review PR #247 — Auth Module', due: 'Today', priority: 'High' },
  { title: 'Update deployment scripts', due: 'Tomorrow', priority: 'Medium' },
  { title: 'Write unit tests for Cart API', due: 'Mar 22', priority: 'High' },
  { title: 'Design review — Settings page', due: 'Mar 23', priority: 'Low' },
  { title: 'Sprint retrospective notes', due: 'Mar 24', priority: 'Medium' },
];

const priorityColor = {
  High: '#F87171',
  Medium: '#FBBF24',
  Low: '#34D399',
};

export default function DashboardPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, Mustafa — here's what's happening across your projects."
      />

      {/* Stat cards */}
      <motion.div variants={item} className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Projects"
          value="8"
          subtitle="+2 this month"
          icon={FolderCopy}
          color="#6C63FF"
        />
        <StatCard
          title="Tasks Completed"
          value="142"
          subtitle="87% completion rate"
          icon={CheckCircleOutline}
          color="#34D399"
        />
        <StatCard
          title="Hours Logged"
          value="36.5h"
          subtitle="This week"
          icon={Timer}
          color="#60A5FA"
        />
        <StatCard
          title="Productivity"
          value="+12%"
          subtitle="vs. last week"
          icon={TrendingUp}
          color="#FBBF24"
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Recent projects */}
        <motion.div variants={item} className="xl:col-span-3">
          <Card>
            <CardContent sx={{ p: 3 }}>
              <h3 className="mb-4 text-base font-semibold text-white">
                Recent Projects
              </h3>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.name} className="rounded-xl border border-[#2A2D35] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">
                        {project.name}
                      </span>
                      <Chip
                        label={project.status}
                        size="small"
                        sx={{
                          backgroundColor: `${project.color}15`,
                          color: project.color,
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
                    <p className="mt-1.5 text-right text-xs text-slate-500">
                      {project.progress}%
                    </p>
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
              <h3 className="mb-4 text-base font-semibold text-white">
                Upcoming Tasks
              </h3>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.title}
                    className="flex items-start gap-3 rounded-lg border border-[#2A2D35] p-3"
                  >
                    <Assignment
                      sx={{ fontSize: 18, color: '#6C63FF', mt: '2px' }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-200">
                        {task.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                          Due: {task.due}
                        </span>
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: priorityColor[task.priority] }}
                        />
                        <span
                          className="text-xs font-medium"
                          style={{ color: priorityColor[task.priority] }}
                        >
                          {task.priority}
                        </span>
                      </div>
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
