import { motion } from 'framer-motion';
import { Card, CardContent, Chip, LinearProgress, Button } from '@mui/material';
import { Add, FolderCopy } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

const projects = [
  {
    id: 1,
    name: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration and admin panel.',
    progress: 72,
    status: 'On Track',
    tasks: { total: 48, completed: 35 },
    deadline: '2026-04-15',
    team: 5,
    color: '#6C63FF',
  },
  {
    id: 2,
    name: 'Mobile App Redesign',
    description: 'UI/UX overhaul for the flagship mobile application across iOS and Android.',
    progress: 45,
    status: 'At Risk',
    tasks: { total: 32, completed: 14 },
    deadline: '2026-04-01',
    team: 3,
    color: '#FBBF24',
  },
  {
    id: 3,
    name: 'API Migration v3',
    description: 'Migrate REST endpoints to v3 with improved auth, rate limiting and caching.',
    progress: 90,
    status: 'On Track',
    tasks: { total: 20, completed: 18 },
    deadline: '2026-03-28',
    team: 4,
    color: '#34D399',
  },
  {
    id: 4,
    name: 'Dashboard Analytics',
    description: 'Build real-time analytics dashboard with charts, KPIs and export capabilities.',
    progress: 20,
    status: 'Behind',
    tasks: { total: 40, completed: 8 },
    deadline: '2026-05-10',
    team: 2,
    color: '#F87171',
  },
  {
    id: 5,
    name: 'CI/CD Pipeline Revamp',
    description: 'Redesign the CI/CD pipeline for faster builds, better caching and parallel jobs.',
    progress: 60,
    status: 'On Track',
    tasks: { total: 15, completed: 9 },
    deadline: '2026-04-20',
    team: 2,
    color: '#60A5FA',
  },
  {
    id: 6,
    name: 'Design System v2',
    description: 'Component library update with new tokens, accessibility improvements and docs.',
    progress: 35,
    status: 'At Risk',
    tasks: { total: 28, completed: 10 },
    deadline: '2026-04-30',
    team: 3,
    color: '#C084FC',
  },
];

const statusColor = {
  'On Track': '#34D399',
  'At Risk': '#FBBF24',
  Behind: '#F87171',
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function ProjectsPage() {
  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Manage and monitor all your active projects."
        action={
          <Button variant="contained" startIcon={<Add />}>
            New Project
          </Button>
        }
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3"
      >
        {projects.map((project) => (
          <motion.div key={project.id} variants={item} whileHover={{ y: -4 }}>
            <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { borderColor: project.color + '40' } }}>
              <CardContent sx={{ p: 3 }}>
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: project.color + '15' }}
                    >
                      <FolderCopy sx={{ fontSize: 16, color: project.color }} />
                    </div>
                    <h4 className="text-sm font-semibold text-white">
                      {project.name}
                    </h4>
                  </div>
                  <Chip
                    label={project.status}
                    size="small"
                    sx={{
                      backgroundColor: statusColor[project.status] + '15',
                      color: statusColor[project.status],
                      fontSize: '0.65rem',
                      height: 22,
                    }}
                  />
                </div>

                <p className="mb-4 text-xs leading-relaxed text-slate-400">
                  {project.description}
                </p>

                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  sx={{
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: '#1E2128',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      backgroundColor: project.color,
                    },
                  }}
                />

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {project.tasks.completed}/{project.tasks.total} tasks
                  </span>
                  <span>Due {project.deadline}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
