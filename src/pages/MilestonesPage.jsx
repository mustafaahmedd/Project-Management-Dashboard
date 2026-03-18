import { motion } from 'framer-motion';
import { Card, CardContent, Chip, LinearProgress } from '@mui/material';
import { Flag } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

const milestones = [
  {
    title: 'API v3 Launch',
    project: 'API Migration v3',
    date: '2026-03-28',
    progress: 90,
    status: 'On Track',
    tasks: { done: 18, total: 20 },
  },
  {
    title: 'E-Commerce Beta Release',
    project: 'E-Commerce Platform',
    date: '2026-04-01',
    progress: 72,
    status: 'On Track',
    tasks: { done: 35, total: 48 },
  },
  {
    title: 'Mobile App Alpha',
    project: 'Mobile App Redesign',
    date: '2026-04-10',
    progress: 45,
    status: 'At Risk',
    tasks: { done: 14, total: 32 },
  },
  {
    title: 'Design System Docs',
    project: 'Design System v2',
    date: '2026-04-15',
    progress: 35,
    status: 'Behind',
    tasks: { done: 10, total: 28 },
  },
  {
    title: 'Analytics Dashboard MVP',
    project: 'Dashboard Analytics',
    date: '2026-05-01',
    progress: 20,
    status: 'Behind',
    tasks: { done: 8, total: 40 },
  },
];

const statusColor = {
  'On Track': '#34D399',
  'At Risk': '#FBBF24',
  Behind: '#F87171',
};

export default function MilestonesPage() {
  return (
    <div>
      <PageHeader
        title="Milestones"
        subtitle="Track key delivery checkpoints across all your projects."
      />

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-[#2A2D35]" />

        <div className="space-y-5">
          {milestones.map((ms, i) => (
            <motion.div
              key={ms.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative pl-14"
            >
              {/* Timeline dot */}
              <div
                className="absolute left-[18px] top-5 h-3.5 w-3.5 rounded-full border-2 border-[#0B0D11]"
                style={{ backgroundColor: statusColor[ms.status] }}
              />

              <Card>
                <CardContent sx={{ p: 3 }}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Flag sx={{ fontSize: 16, color: statusColor[ms.status] }} />
                        <h4 className="text-sm font-semibold text-white">
                          {ms.title}
                        </h4>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {ms.project} &middot; Due {ms.date}
                      </p>
                    </div>
                    <Chip
                      label={ms.status}
                      size="small"
                      sx={{
                        backgroundColor: statusColor[ms.status] + '15',
                        color: statusColor[ms.status],
                        fontSize: '0.65rem',
                        height: 22,
                      }}
                    />
                  </div>

                  <div className="mt-3">
                    <LinearProgress
                      variant="determinate"
                      value={ms.progress}
                      sx={{
                        height: 5,
                        borderRadius: 3,
                        backgroundColor: '#1E2128',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          backgroundColor: statusColor[ms.status],
                        },
                      }}
                    />
                    <div className="mt-1.5 flex justify-between text-xs text-slate-500">
                      <span>{ms.tasks.done}/{ms.tasks.total} tasks complete</span>
                      <span>{ms.progress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
