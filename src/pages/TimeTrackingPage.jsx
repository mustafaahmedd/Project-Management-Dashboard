import { motion } from 'framer-motion';
import { Card, CardContent, Button } from '@mui/material';
import { Timer, PlayArrow, Stop } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import PlaceholderSection from '../components/common/PlaceholderSection';

const timeEntries = [
  { task: 'Auth middleware refactor', project: 'API Migration', duration: '2h 15m', date: 'Today' },
  { task: 'Product listing component', project: 'E-Commerce', duration: '1h 45m', date: 'Today' },
  { task: 'PR review — Auth Module', project: 'API Migration', duration: '0h 40m', date: 'Today' },
  { task: 'Sprint planning meeting', project: 'General', duration: '1h 00m', date: 'Yesterday' },
  { task: 'CI pipeline debugging', project: 'CI/CD Revamp', duration: '3h 10m', date: 'Yesterday' },
];

export default function TimeTrackingPage() {
  return (
    <div>
      <PageHeader
        title="Time Tracking"
        subtitle="Track time spent across tasks and projects for accurate effort estimation."
      />

      {/* Active timer */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card sx={{ border: '1px solid #6C63FF30' }}>
          <CardContent sx={{ p: 3 }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6C63FF]/10">
                  <Timer sx={{ color: '#6C63FF' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    No active timer
                  </p>
                  <p className="text-xs text-slate-400">
                    Start tracking time on a task
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-bold text-white">
                  00:00:00
                </span>
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  size="small"
                >
                  Start
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent entries */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent sx={{ p: 3 }}>
            <h3 className="mb-4 text-base font-semibold text-white">
              Recent Time Entries
            </h3>
            <div className="space-y-3">
              {timeEntries.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-[#2A2D35] p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {entry.task}
                    </p>
                    <p className="text-xs text-slate-500">{entry.project}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold text-white">
                      {entry.duration}
                    </p>
                    <p className="text-xs text-slate-500">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
