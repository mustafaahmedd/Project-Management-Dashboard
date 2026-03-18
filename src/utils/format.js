export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

export function formatTimer(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function relativeDate(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  return formatDate(dateStr);
}

export function computeProjectProgress(tasks) {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
}

export function computeProjectStatus(progress, deadline) {
  const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (progress >= 100) return 'completed';
  if (daysLeft < 0) return 'behind';
  if (progress < 30 && daysLeft < 14) return 'behind';
  if (progress < 50 && daysLeft < 7) return 'at_risk';
  if (progress < 70 && daysLeft < 14) return 'at_risk';
  return 'on_track';
}

export const STATUS_DISPLAY = {
  on_track: { label: 'On Track', color: '#34D399' },
  at_risk: { label: 'At Risk', color: '#FBBF24' },
  behind: { label: 'Behind', color: '#F87171' },
  completed: { label: 'Completed', color: '#34D399' },
  active: { label: 'Active', color: '#60A5FA' },
  planning: { label: 'Planning', color: '#94A3B8' },
  paused: { label: 'Paused', color: '#94A3B8' },
  archived: { label: 'Archived', color: '#475569' },
};

export const PRIORITY_COLOR = {
  critical: '#EF4444',
  high: '#F87171',
  medium: '#FBBF24',
  low: '#34D399',
};
