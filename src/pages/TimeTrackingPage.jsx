import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Timer,
  PlayArrow,
  Pause,
  Stop,
  Add,
  Delete,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import FormDialog from '../components/common/FormDialog';
import { useTime } from '../context/TimeContext';
import { useTasks } from '../context/TaskContext';
import { useProjects } from '../context/ProjectContext';
import { formatTimer, formatDuration, formatDate } from '../utils/format';

export default function TimeTrackingPage() {
  const { entries, timer, startTimer, pauseTimer, resumeTimer, stopTimer, deleteEntry, addManualEntry } = useTime();
  const { tasks } = useTasks();
  const { projects } = useProjects();

  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [stopNotes, setStopNotes] = useState('');
  const [manualOpen, setManualOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    taskId: '',
    durationMinutes: 60,
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const activeTasks = useMemo(
    () => tasks.filter((t) => t.status !== 'done'),
    [tasks],
  );

  const timerTask = useMemo(
    () => tasks.find((t) => t.id === timer.taskId),
    [tasks, timer.taskId],
  );

  const timerProject = useMemo(
    () => projects.find((p) => p.id === timer.projectId),
    [projects, timer.projectId],
  );

  // Stats
  const todayMinutes = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return entries
      .filter((e) => e.startTime && e.startTime.startsWith(today))
      .reduce((sum, e) => sum + e.durationMinutes, 0);
  }, [entries]);

  const weekMinutes = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return entries
      .filter((e) => new Date(e.startTime) >= weekStart)
      .reduce((sum, e) => sum + e.durationMinutes, 0);
  }, [entries]);

  const handleStart = () => {
    if (!selectedTaskId) return;
    const task = tasks.find((t) => t.id === selectedTaskId);
    startTimer(selectedTaskId, task?.projectId || '');
  };

  const handleStop = () => {
    stopTimer(stopNotes);
    setStopNotes('');
    setSelectedTaskId('');
  };

  const handleManualSubmit = () => {
    const task = tasks.find((t) => t.id === manualForm.taskId);
    addManualEntry({
      taskId: manualForm.taskId,
      projectId: task?.projectId || '',
      startTime: `${manualForm.date}T09:00:00Z`,
      endTime: `${manualForm.date}T09:00:00Z`,
      durationMinutes: Number(manualForm.durationMinutes),
      notes: manualForm.notes,
    });
    setManualOpen(false);
    setManualForm({ taskId: '', durationMinutes: 60, notes: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div>
      <PageHeader
        title="Time Tracking"
        subtitle="Track time spent across tasks and projects for accurate effort estimation."
        action={
          <Button variant="outlined" startIcon={<Add />} size="small" sx={{ borderColor: '#2A2D35', color: '#94A3B8' }} onClick={() => setManualOpen(true)}>
            Manual Entry
          </Button>
        }
      />

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Today" value={formatDuration(todayMinutes)} subtitle="Time logged" icon={Timer} color="#6C63FF" />
        <StatCard title="This Week" value={formatDuration(weekMinutes)} subtitle="Total hours" icon={Timer} color="#34D399" />
        <StatCard title="Entries" value={entries.length} subtitle="Total tracked" icon={Timer} color="#60A5FA" />
      </div>

      {/* Active timer */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card sx={{ border: timer.running ? '1px solid #6C63FF30' : '1px solid #2A2D35' }}>
          <CardContent sx={{ p: 3 }}>
            {!timer.running ? (
              /* No timer running */
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6C63FF]/10">
                    <Timer sx={{ color: '#6C63FF' }} />
                  </div>
                  <div className="flex-1">
                    <TextField
                      select
                      size="small"
                      label="Select a task"
                      value={selectedTaskId}
                      onChange={(e) => setSelectedTaskId(e.target.value)}
                      sx={{ minWidth: 280 }}
                    >
                      {activeTasks.map((t) => {
                        const proj = projects.find((p) => p.id === t.projectId);
                        return (
                          <MenuItem key={t.id} value={t.id}>
                            <div className="flex items-center gap-2">
                              {proj && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: proj.color }} />}
                              <span className="truncate">{t.title}</span>
                            </div>
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl font-bold text-slate-500">00:00:00</span>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    size="small"
                    onClick={handleStart}
                    disabled={!selectedTaskId}
                  >
                    Start
                  </Button>
                </div>
              </div>
            ) : (
              /* Timer running */
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6C63FF]/10">
                    <motion.div
                      animate={{ scale: timer.paused ? 1 : [1, 1.2, 1] }}
                      transition={{ repeat: timer.paused ? 0 : Infinity, duration: 1.5 }}
                    >
                      <Timer sx={{ color: timer.paused ? '#FBBF24' : '#6C63FF' }} />
                    </motion.div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {timerTask?.title || 'Tracking...'}
                    </p>
                    <div className="flex items-center gap-2">
                      {timerProject && (
                        <Chip
                          label={timerProject.name}
                          size="small"
                          sx={{ backgroundColor: timerProject.color + '15', color: timerProject.color, fontSize: '0.65rem', height: 20 }}
                        />
                      )}
                      {timer.paused && (
                        <Chip label="Paused" size="small" sx={{ backgroundColor: '#FBBF2415', color: '#FBBF24', fontSize: '0.65rem', height: 20 }} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl font-bold text-white">
                    {formatTimer(timer.elapsed)}
                  </span>
                  {timer.paused ? (
                    <Tooltip title="Resume">
                      <IconButton onClick={resumeTimer} sx={{ color: '#34D399' }}>
                        <PlayArrow />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Pause">
                      <IconButton onClick={pauseTimer} sx={{ color: '#FBBF24' }}>
                        <Pause />
                      </IconButton>
                    </Tooltip>
                  )}
                  <div className="flex items-center gap-2">
                    <TextField
                      size="small"
                      placeholder="Notes (optional)"
                      value={stopNotes}
                      onChange={(e) => setStopNotes(e.target.value)}
                      sx={{ width: 180 }}
                    />
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Stop />}
                      size="small"
                      onClick={handleStop}
                    >
                      Stop
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
              <AnimatePresence>
                {entries.slice(0, 15).map((entry) => {
                  const task = tasks.find((t) => t.id === entry.taskId);
                  const project = projects.find((p) => p.id === entry.projectId);
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between rounded-lg border border-[#2A2D35] p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-200 truncate">
                          {task?.title || 'Unknown Task'}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2">
                          {project && (
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.color }} />
                              {project.name}
                            </span>
                          )}
                          {entry.notes && (
                            <span className="text-xs text-slate-600 truncate max-w-[200px]">
                              · {entry.notes}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-mono text-sm font-semibold text-white">
                            {formatDuration(entry.durationMinutes)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatDate(entry.startTime)}
                          </p>
                        </div>
                        <Tooltip title="Delete entry">
                          <IconButton
                            size="small"
                            onClick={() => deleteEntry(entry.id)}
                            sx={{ color: '#47556970', '&:hover': { color: '#F87171' } }}
                          >
                            <Delete sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {entries.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-500">
                  No time entries yet. Start a timer to begin tracking.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Manual entry dialog */}
      <FormDialog
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        title="Add Manual Time Entry"
        submitLabel="Add Entry"
        onSubmit={handleManualSubmit}
      >
        <div className="space-y-4 pt-1">
          <TextField
            select
            label="Task"
            fullWidth
            value={manualForm.taskId}
            onChange={(e) => setManualForm((prev) => ({ ...prev, taskId: e.target.value }))}
          >
            {tasks.map((t) => {
              const proj = projects.find((p) => p.id === t.projectId);
              return (
                <MenuItem key={t.id} value={t.id}>
                  <div className="flex items-center gap-2">
                    {proj && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: proj.color }} />}
                    {t.title}
                  </div>
                </MenuItem>
              );
            })}
          </TextField>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Duration (minutes)"
              type="number"
              fullWidth
              value={manualForm.durationMinutes}
              onChange={(e) => setManualForm((prev) => ({ ...prev, durationMinutes: e.target.value }))}
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={manualForm.date}
              onChange={(e) => setManualForm((prev) => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={2}
            value={manualForm.notes}
            onChange={(e) => setManualForm((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </div>
      </FormDialog>
    </div>
  );
}
