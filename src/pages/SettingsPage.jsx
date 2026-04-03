import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Button,
  Alert,
} from '@mui/material';
import {
  FileDownload,
  FileUpload,
  DeleteForever,
  Warning,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useProjects } from '../context/ProjectContext';
import { useTasks } from '../context/TaskContext';
import { useTime } from '../context/TimeContext';
import { useUser } from '../context/UserContext';
import { useLogs } from '../context/LogContext';
import { loadState, saveState, clearAll } from '../utils/storage';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { entries } = useTime();
  const { profile, roles } = useUser();
  const { logs } = useLogs();

  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null); // { type: 'success'|'error', message }
  const [confirmImport, setConfirmImport] = useState(null); // holds parsed data
  const [confirmClear, setConfirmClear] = useState(false);

  const handleExport = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        profile: loadState('profile', profile),
        roles: loadState('roles', roles),
        projects: loadState('projects', projects),
        tasks: loadState('tasks', tasks),
        timeEntries: loadState('timeEntries', entries),
        milestones: loadState('milestones', []),
        logs: loadState('logs', logs),
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `projectpulse-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setImportStatus({ type: 'success', message: 'Data exported successfully!' });
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);

        // Validate structure
        if (!parsed.version || !parsed.data) {
          setImportStatus({ type: 'error', message: 'Invalid backup file — missing version or data fields.' });
          return;
        }

        const { data } = parsed;
        if (!data.projects || !data.tasks) {
          setImportStatus({ type: 'error', message: 'Invalid backup file — missing projects or tasks data.' });
          return;
        }

        // Ask for confirmation
        setConfirmImport(parsed);
      } catch {
        setImportStatus({ type: 'error', message: 'Failed to parse file — not valid JSON.' });
      }
    };
    reader.readAsText(file);

    // Reset file input so the same file can be selected again
    e.target.value = '';
  };

  const executeImport = () => {
    if (!confirmImport) return;
    const { data } = confirmImport;

    try {
      if (data.profile) saveState('profile', data.profile);
      if (data.roles) saveState('roles', data.roles);
      if (data.projects) saveState('projects', data.projects);
      if (data.tasks) saveState('tasks', data.tasks);
      if (data.timeEntries) saveState('timeEntries', data.timeEntries);
      if (data.milestones) saveState('milestones', data.milestones);
      if (data.logs) saveState('logs', data.logs);

      setConfirmImport(null);
      setImportStatus({ type: 'success', message: 'Data imported successfully! Reloading...' });

      // Reload to pick up new data from localStorage
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      setImportStatus({ type: 'error', message: 'Failed to import data.' });
      setConfirmImport(null);
    }
  };

  const handleClearAll = () => {
    clearAll();
    setConfirmClear(false);
    setImportStatus({ type: 'success', message: 'All data cleared! Reloading with defaults...' });
    setTimeout(() => window.location.reload(), 1500);
  };

  const dataStats = {
    projects: projects.length,
    tasks: tasks.length,
    timeEntries: entries.length,
    roles: roles.length,
    logs: logs.length,
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <PageHeader
        title="Settings"
        subtitle="Configure your dashboard preferences and manage your data."
      />

      {/* Status alert */}
      {importStatus && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Alert severity={importStatus.type} sx={{ bgcolor: importStatus.type === 'success' ? '#34D39915' : '#F8717115', color: importStatus.type === 'success' ? '#34D399' : '#F87171', border: '1px solid', borderColor: importStatus.type === 'success' ? '#34D39930' : '#F8717130' }}>
            {importStatus.message}
          </Alert>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Export */}
        <motion.div variants={item}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#34D39915]">
                  <FileDownload sx={{ color: '#34D399' }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Export Data</h3>
                  <p className="text-xs text-slate-500">Download all your data as a JSON backup file</p>
                </div>
              </div>

              <div className="mb-4 space-y-2 rounded-xl border border-[#2A2D35] p-3">
                <p className="text-xs font-medium text-slate-400">Data Summary</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="text-slate-500">Projects</span>
                  <span className="text-right text-slate-300">{dataStats.projects}</span>
                  <span className="text-slate-500">Tasks</span>
                  <span className="text-right text-slate-300">{dataStats.tasks}</span>
                  <span className="text-slate-500">Time Entries</span>
                  <span className="text-right text-slate-300">{dataStats.timeEntries}</span>
                  <span className="text-slate-500">Roles</span>
                  <span className="text-right text-slate-300">{dataStats.roles}</span>
                  <span className="text-slate-500">Daily Logs</span>
                  <span className="text-right text-slate-300">{dataStats.logs}</span>
                </div>
              </div>

              <Button
                variant="contained"
                fullWidth
                startIcon={<FileDownload />}
                onClick={handleExport}
                sx={{ bgcolor: '#34D399', '&:hover': { bgcolor: '#2BB585' } }}
              >
                Export Backup
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Import */}
        <motion.div variants={item}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#60A5FA15]">
                  <FileUpload sx={{ color: '#60A5FA' }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Import Data</h3>
                  <p className="text-xs text-slate-500">Restore from a previously exported backup file</p>
                </div>
              </div>

              <div className="mb-4 rounded-xl border border-[#FBBF2430] bg-[#FBBF2408] p-3">
                <div className="flex items-start gap-2">
                  <Warning sx={{ fontSize: 16, color: '#FBBF24', mt: '2px' }} />
                  <p className="text-xs text-[#FBBF24]">
                    Importing will <strong>replace</strong> all existing data. Make sure to export a backup first if you want to keep your current data.
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                variant="contained"
                fullWidth
                startIcon={<FileUpload />}
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Backup File
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card sx={{ borderColor: '#F8717130' }}>
            <CardContent sx={{ p: 4 }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8717115]">
                    <DeleteForever sx={{ color: '#F87171' }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Clear All Data</h3>
                    <p className="text-xs text-slate-500">Reset everything to defaults — this cannot be undone</p>
                  </div>
                </div>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteForever />}
                  onClick={() => setConfirmClear(true)}
                >
                  Clear Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sync Info */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardContent sx={{ p: 4 }}>
              <h3 className="mb-2 text-base font-semibold text-white">Cross-Device Sync</h3>
              <p className="text-sm text-slate-400">
                Currently, all data is stored locally in your browser. To use ProjectPulse across multiple machines:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6C63FF]" />
                  <span><strong className="text-slate-300">File-based:</strong> Export your backup and store it on iCloud Drive, Dropbox, or Google Drive. Import it on your other machine.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#34D399]" />
                  <span><strong className="text-slate-300">Git-based:</strong> Auto-commit your export to a private GitHub repo — gives you version history for free.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FBBF24]" />
                  <span><strong className="text-slate-300">Real-time (planned):</strong> Supabase or PouchDB sync — coming in a future update.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Import confirmation */}
      <ConfirmDialog
        open={Boolean(confirmImport)}
        onClose={() => setConfirmImport(null)}
        onConfirm={executeImport}
        title="Import Data"
        message={`This will replace ALL existing data with the backup from ${confirmImport?.exportedAt ? new Date(confirmImport.exportedAt).toLocaleString() : 'unknown date'}. This action cannot be undone. Continue?`}
      />

      {/* Clear confirmation */}
      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={handleClearAll}
        title="Clear All Data"
        message="This will permanently delete all projects, tasks, time entries, milestones, roles, and profile data. The app will reload with default seed data. This CANNOT be undone."
      />
    </motion.div>
  );
}
