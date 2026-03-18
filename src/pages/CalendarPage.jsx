import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, Chip, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import { useTasks } from '../context/TaskContext';
import { useProjects } from '../context/ProjectContext';
import { useMilestones } from '../context/MilestoneContext';
import { PRIORITY_COLOR } from '../utils/format';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { milestones } = useMilestones();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const navigate = (dir) => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + dir);
      return d;
    });
    setSelectedDate(null);
  };

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Padding for previous month
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    return days;
  }, [year, month]);

  // Map date strings → items
  const dateMap = useMemo(() => {
    const map = {};
    const pad = (n) => String(n).padStart(2, '0');

    tasks.forEach((t) => {
      if (!t.deadline) return;
      const key = t.deadline;
      if (!map[key]) map[key] = { tasks: [], milestones: [] };
      map[key].tasks.push(t);
    });

    milestones.forEach((ms) => {
      if (!ms.targetDate) return;
      const key = ms.targetDate;
      if (!map[key]) map[key] = { tasks: [], milestones: [] };
      map[key].milestones.push(ms);
    });

    return map;
  }, [tasks, milestones]);

  const getDateKey = (day) => {
    if (!day) return '';
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const today = new Date();
  const isToday = (day) =>
    day && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const selectedItems = selectedDate ? dateMap[getDateKey(selectedDate)] : null;

  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="Visualize deadlines, milestones, and scheduled tasks on a timeline."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Calendar grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2"
        >
          <Card>
            <CardContent sx={{ p: 3 }}>
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <IconButton onClick={() => navigate(-1)} sx={{ color: '#94A3B8' }}>
                  <ChevronLeft />
                </IconButton>
                <h3 className="text-lg font-bold text-white">
                  {MONTHS[month]} {year}
                </h3>
                <IconButton onClick={() => navigate(1)} sx={{ color: '#94A3B8' }}>
                  <ChevronRight />
                </IconButton>
              </div>

              {/* Weekday headers */}
              <div className="mb-2 grid grid-cols-7 gap-1">
                {WEEKDAYS.map((wd) => (
                  <div key={wd} className="py-2 text-center text-xs font-medium text-slate-500">
                    {wd}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  const key = getDateKey(day);
                  const items = dateMap[key];
                  const hasItems = items && (items.tasks.length > 0 || items.milestones.length > 0);
                  const selected = selectedDate === day && day !== null;

                  return (
                    <div
                      key={i}
                      onClick={() => day && setSelectedDate(day)}
                      className={`relative flex min-h-[72px] flex-col rounded-lg border p-1.5 cursor-pointer transition-colors ${
                        !day
                          ? 'border-transparent'
                          : selected
                          ? 'border-[#6C63FF] bg-[#6C63FF10]'
                          : isToday(day)
                          ? 'border-[#6C63FF40] bg-[#6C63FF08]'
                          : 'border-[#2A2D35] hover:border-[#3A3D45]'
                      }`}
                    >
                      {day && (
                        <>
                          <span
                            className={`text-xs font-medium ${
                              isToday(day)
                                ? 'text-[#6C63FF]'
                                : 'text-slate-400'
                            }`}
                          >
                            {day}
                          </span>
                          {hasItems && (
                            <div className="mt-0.5 flex flex-wrap gap-0.5">
                              {items.milestones.map((ms) => (
                                <div
                                  key={ms.id}
                                  className="h-1.5 w-1.5 rounded-full"
                                  style={{ backgroundColor: '#FBBF24' }}
                                  title={ms.title}
                                />
                              ))}
                              {items.tasks.slice(0, 3).map((t) => {
                                const proj = projects.find((p) => p.id === t.projectId);
                                return (
                                  <div
                                    key={t.id}
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ backgroundColor: proj?.color || '#6C63FF' }}
                                    title={t.title}
                                  />
                                );
                              })}
                              {items.tasks.length > 3 && (
                                <span className="text-[9px] text-slate-500">+{items.tasks.length - 3}</span>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selected day detail */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <h3 className="mb-4 text-base font-semibold text-white">
                {selectedDate
                  ? `${MONTHS[month]} ${selectedDate}, ${year}`
                  : 'Select a date'}
              </h3>

              {selectedDate && selectedItems ? (
                <div className="space-y-4">
                  {selectedItems.milestones.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#FBBF24]">
                        Milestones
                      </p>
                      {selectedItems.milestones.map((ms) => {
                        const proj = projects.find((p) => p.id === ms.projectId);
                        return (
                          <div key={ms.id} className="mb-2 rounded-lg border border-[#FBBF2430] bg-[#FBBF2408] p-3">
                            <p className="text-sm font-medium text-slate-200">{ms.title}</p>
                            {proj && <p className="text-xs text-slate-500">{proj.name}</p>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {selectedItems.tasks.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                        Task Deadlines ({selectedItems.tasks.length})
                      </p>
                      {selectedItems.tasks.map((t) => {
                        const proj = projects.find((p) => p.id === t.projectId);
                        const pColor = PRIORITY_COLOR[t.priority] || '#94A3B8';
                        return (
                          <div key={t.id} className="mb-2 rounded-lg border border-[#2A2D35] p-3">
                            <p className="text-sm font-medium text-slate-200">{t.title}</p>
                            <div className="mt-1 flex items-center gap-2">
                              {proj && (
                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: proj.color }} />
                                  {proj.name}
                                </span>
                              )}
                              <Chip
                                label={t.priority}
                                size="small"
                                sx={{
                                  backgroundColor: pColor + '15',
                                  color: pColor,
                                  fontSize: '0.6rem',
                                  height: 18,
                                  textTransform: 'capitalize',
                                }}
                              />
                              <Chip
                                label={t.status.replace('_', ' ')}
                                size="small"
                                sx={{
                                  backgroundColor: '#94A3B815',
                                  color: '#94A3B8',
                                  fontSize: '0.6rem',
                                  height: 18,
                                  textTransform: 'capitalize',
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : selectedDate ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Nothing scheduled for this date
                </p>
              ) : (
                <p className="py-8 text-center text-sm text-slate-500">
                  Click on a date to see tasks and milestones
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
