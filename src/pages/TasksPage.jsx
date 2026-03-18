import { motion } from 'framer-motion';
import { Card, CardContent, Checkbox, Chip, Button, IconButton } from '@mui/material';
import { Add, FilterList, MoreVert } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

const columns = [
  {
    title: 'To Do',
    color: '#94A3B8',
    tasks: [
      { id: 1, title: 'Set up CI/CD pipeline for staging', project: 'CI/CD Revamp', priority: 'High', due: 'Mar 22' },
      { id: 2, title: 'Write API documentation for v3', project: 'API Migration', priority: 'Medium', due: 'Mar 24' },
      { id: 3, title: 'Design onboarding flow wireframes', project: 'Mobile App', priority: 'Low', due: 'Mar 25' },
    ],
  },
  {
    title: 'In Progress',
    color: '#6C63FF',
    tasks: [
      { id: 4, title: 'Implement auth middleware refactor', project: 'API Migration', priority: 'High', due: 'Mar 20' },
      { id: 5, title: 'Build product listing component', project: 'E-Commerce', priority: 'Medium', due: 'Mar 21' },
    ],
  },
  {
    title: 'In Review',
    color: '#FBBF24',
    tasks: [
      { id: 6, title: 'PR #247 — Auth Module tests', project: 'API Migration', priority: 'High', due: 'Today' },
      { id: 7, title: 'Update color tokens for dark mode', project: 'Design System', priority: 'Medium', due: 'Mar 21' },
    ],
  },
  {
    title: 'Done',
    color: '#34D399',
    tasks: [
      { id: 8, title: 'Set up project repo and boilerplate', project: 'Dashboard Analytics', priority: 'Low', due: 'Mar 18' },
      { id: 9, title: 'Configure Tailwind + MUI theme', project: 'Design System', priority: 'Medium', due: 'Mar 17' },
    ],
  },
];

const priorityColor = { High: '#F87171', Medium: '#FBBF24', Low: '#34D399' };

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function TasksPage() {
  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Kanban board view of all your tasks across projects."
        action={
          <div className="flex gap-2">
            <Button variant="outlined" startIcon={<FilterList />} size="small" sx={{ borderColor: '#2A2D35', color: '#94A3B8' }}>
              Filter
            </Button>
            <Button variant="contained" startIcon={<Add />} size="small">
              Add Task
            </Button>
          </div>
        }
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
      >
        {columns.map((col) => (
          <motion.div key={col.title} variants={item}>
            <div className="rounded-2xl border border-[#2A2D35] bg-[#12141A] p-4">
              <div className="mb-4 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <h4 className="text-sm font-semibold text-white">{col.title}</h4>
                <span className="ml-auto text-xs text-slate-500">
                  {col.tasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {col.tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl border border-[#2A2D35] bg-[#181B22] p-3"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <p className="text-sm font-medium text-slate-200">
                        {task.title}
                      </p>
                      <IconButton size="small" sx={{ color: '#475569', p: 0.5 }}>
                        <MoreVert sx={{ fontSize: 16 }} />
                      </IconButton>
                    </div>
                    <p className="mb-2 text-xs text-slate-500">{task.project}</p>
                    <div className="flex items-center justify-between">
                      <Chip
                        label={task.priority}
                        size="small"
                        sx={{
                          backgroundColor: priorityColor[task.priority] + '15',
                          color: priorityColor[task.priority],
                          fontSize: '0.6rem',
                          height: 20,
                        }}
                      />
                      <span className="text-[11px] text-slate-500">
                        {task.due}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
