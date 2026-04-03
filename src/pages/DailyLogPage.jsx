import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  IconButton,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  CalendarMonth,
  Edit as EditIcon,
  Delete,
  ChevronLeft,
  ChevronRight,
  Add,
  Save,
  Close,
  PriorityHigh,
  Circle,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useLogs } from '../context/LogContext';
import { useProjects } from '../context/ProjectContext';
import { parseLogContent } from '../utils/logParser';
import { formatDate } from '../utils/format';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];

  // Leading empty cells
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return days;
}

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function DailyLogPage() {
  const { logs, addLog, updateLog, deleteLog, getLogByDate } = useLogs();
  const { projects } = useProjects();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toDateStr(today.getFullYear(), today.getMonth(), today.getDate()));
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const monthDays = useMemo(() => getMonthDays(viewYear, viewMonth), [viewYear, viewMonth]);
  const monthName = new Date(viewYear, viewMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Dates that have logs in the current month
  const logDates = useMemo(() => {
    const set = new Set();
    logs.forEach((l) => {
      const d = new Date(l.date);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        set.add(d.getDate());
      }
    });
    return set;
  }, [logs, viewYear, viewMonth]);

  const selectedLog = useMemo(() => getLogByDate(selectedDate), [getLogByDate, selectedDate]);

  const parsedItems = useMemo(() => {
    if (!selectedLog) return { items: [], priorityNotes: '' };
    return parseLogContent(selectedLog.content, projects);
  }, [selectedLog, projects]);

  const totalHours = useMemo(
    () => parsedItems.items.reduce((sum, i) => sum + (i.hoursSpent || 0), 0),
    [parsedItems],
  );

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const dateStr = toDateStr(viewYear, viewMonth, day);
    setSelectedDate(dateStr);
    setIsEditing(false);
  };

  const startNewLog = () => {
    setContent(selectedLog?.content || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    const parsed = parseLogContent(content, projects);

    if (selectedLog) {
      updateLog(selectedLog.id, {
        content,
        parsedItems: parsed.items,
        priorityNotes: parsed.priorityNotes,
      });
    } else {
      addLog({
        date: selectedDate,
        content,
        parsedItems: parsed.items,
        priorityNotes: parsed.priorityNotes,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (selectedLog) {
      deleteLog(selectedLog.id);
      setConfirmDelete(false);
      setIsEditing(false);
    }
  };

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <PageHeader
        title="Daily Log"
        subtitle="Dump your daily work in one go — tag projects with @ProjectName for auto-assignment."
        action={
          !isEditing && (
            <Button
              variant="contained"
              startIcon={selectedLog ? <EditIcon /> : <Add />}
              size="small"
              onClick={startNewLog}
            >
              {selectedLog ? 'Edit Log' : 'Log Work'}
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Calendar */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardContent sx={{ p: 3 }}>
              <div className="mb-4 flex items-center justify-between">
                <IconButton size="small" onClick={prevMonth} sx={{ color: '#94A3B8' }}>
                  <ChevronLeft />
                </IconButton>
                <span className="text-sm font-semibold text-white">{monthName}</span>
                <IconButton size="small" onClick={nextMonth} sx={{ color: '#94A3B8' }}>
                  <ChevronRight />
                </IconButton>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1.5 mb-2">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-slate-500 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1.5">
                {monthDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} />;

                  const dateStr = toDateStr(viewYear, viewMonth, day);
                  const hasLog = logDates.has(day);
                  const isSelected = dateStr === selectedDate;
                  const isToday = dateStr === todayStr;

                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={`relative flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-[#6C63FF] text-white'
                          : isToday
                            ? 'border border-[#6C63FF50] text-[#918AFF]'
                            : 'text-slate-400 hover:bg-[#181B22]'
                      }`}
                    >
                      {day}
                      {hasLog && !isSelected && (
                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#34D399]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick stats */}
              <div className="mt-4 rounded-xl border border-[#2A2D35] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-2">
                  This Month
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="text-slate-500">Logs</span>
                  <span className="text-right text-slate-300">
                    {logs.filter((l) => {
                      const d = new Date(l.date);
                      return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
                    }).length}
                  </span>
                  <span className="text-slate-500">Days Logged</span>
                  <span className="text-right text-slate-300">{logDates.size}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Log Entry */}
        <motion.div variants={item} className="lg:col-span-3">
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              {/* Date header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C63FF15]">
                    <CalendarMonth sx={{ color: '#6C63FF', fontSize: 20 }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {formatDate(selectedDate)}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedDate === todayStr ? 'Today' : new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedLog && !isEditing && (
                    <>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={startNewLog} sx={{ color: '#94A3B8' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => setConfirmDelete(true)} sx={{ color: '#F87171' }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {/* Help text */}
                    <div className="mb-3 rounded-lg border border-[#2A2D35] bg-[#181B22] p-3">
                      <p className="text-xs text-slate-500 leading-relaxed">
                        <strong className="text-slate-400">Quick syntax:</strong>{' '}
                        <code className="rounded bg-[#0B0D11] px-1 text-[#918AFF]">@ProjectName:</code> to tag a project,{' '}
                        <code className="rounded bg-[#0B0D11] px-1 text-[#918AFF]">!</code> at start for priority notes,{' '}
                        <code className="rounded bg-[#0B0D11] px-1 text-[#918AFF]">2h</code> or{' '}
                        <code className="rounded bg-[#0B0D11] px-1 text-[#918AFF]">30m</code> for time,{' '}
                        <code className="rounded bg-[#0B0D11] px-1 text-[#918AFF]">#tag</code> for labels.
                      </p>
                    </div>

                    <TextField
                      multiline
                      rows={8}
                      fullWidth
                      placeholder={`Example:\n@E-Commerce: Built cart page 3h\n@API Migration: Code review 1h\n- Team standup\n!Follow up on deployment tomorrow`}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      autoFocus
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          lineHeight: 1.7,
                        },
                      }}
                    />

                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Button
                        startIcon={<Close />}
                        onClick={() => setIsEditing(false)}
                        sx={{ color: '#94A3B8' }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        disabled={!content.trim()}
                      >
                        Save Log
                      </Button>
                    </div>
                  </motion.div>
                ) : selectedLog ? (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {/* Parsed items */}
                    <div className="space-y-2">
                      {parsedItems.items.map((logItem, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-lg border border-[#2A2D35] p-3"
                        >
                          <Circle sx={{ fontSize: 6, mt: '8px', color: logItem.projectId ? '#6C63FF' : '#475569' }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-200">{logItem.text}</p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-2">
                              {logItem.projectName && (
                                <Chip
                                  label={logItem.projectName}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#6C63FF15',
                                    color: '#918AFF',
                                    fontSize: '0.65rem',
                                    height: 20,
                                  }}
                                />
                              )}
                              {logItem.hoursSpent && (
                                <Chip
                                  label={`${logItem.hoursSpent}h`}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#60A5FA15',
                                    color: '#60A5FA',
                                    fontSize: '0.65rem',
                                    height: 20,
                                  }}
                                />
                              )}
                              {logItem.tags.map((tag) => (
                                <Chip
                                  key={tag}
                                  label={`#${tag}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#34D39915',
                                    color: '#34D399',
                                    fontSize: '0.65rem',
                                    height: 20,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Priority notes */}
                    {parsedItems.priorityNotes && (
                      <div className="mt-4 rounded-xl border border-[#FBBF2430] bg-[#FBBF2408] p-3">
                        <div className="flex items-start gap-2">
                          <PriorityHigh sx={{ fontSize: 16, color: '#FBBF24', mt: '2px' }} />
                          <div>
                            <p className="text-xs font-semibold text-[#FBBF24] mb-1">Priority Notes</p>
                            <p className="text-xs text-[#FBBF24CC] whitespace-pre-line">
                              {parsedItems.priorityNotes}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Summary bar */}
                    <div className="mt-4 flex items-center gap-4 rounded-xl border border-[#2A2D35] p-3">
                      <div className="text-xs text-slate-500">
                        <span className="text-slate-300 font-medium">{parsedItems.items.length}</span> items
                      </div>
                      {totalHours > 0 && (
                        <div className="text-xs text-slate-500">
                          <span className="text-slate-300 font-medium">{totalHours}h</span> logged
                        </div>
                      )}
                      <div className="text-xs text-slate-500">
                        <span className="text-slate-300 font-medium">
                          {parsedItems.items.filter((i) => i.projectId).length}
                        </span> linked to projects
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <CalendarMonth sx={{ fontSize: 48, color: '#2A2D35', mb: 2 }} />
                    <p className="text-sm text-slate-500 mb-1">No log for this day</p>
                    <p className="text-xs text-slate-600 mb-4">
                      Record what you worked on — quick and easy.
                    </p>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Add />}
                      onClick={startNewLog}
                    >
                      Log Work
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Log"
        message={`Delete the log for ${formatDate(selectedDate)}? This cannot be undone.`}
      />
    </motion.div>
  );
}
