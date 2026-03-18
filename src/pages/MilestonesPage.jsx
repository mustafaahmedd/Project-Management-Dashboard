import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Flag, Add, Edit, Delete, MoreVert } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import FormDialog from '../components/common/FormDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useMilestones } from '../context/MilestoneContext';
import { useProjects } from '../context/ProjectContext';
import { useTasks } from '../context/TaskContext';
import { STATUS_DISPLAY, formatDate, relativeDate } from '../utils/format';

const EMPTY_FORM = {
  title: '',
  projectId: '',
  targetDate: '',
  status: 'on_track',
};

export default function MilestonesPage() {
  const { milestones, addMilestone, updateMilestone, deleteMilestone } = useMilestones();
  const { projects } = useProjects();
  const { tasks } = useTasks();

  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuMsId, setMenuMsId] = useState(null);

  const enriched = useMemo(() => {
    return milestones
      .map((ms) => {
        const project = projects.find((p) => p.id === ms.projectId);
        const msTasks = (ms.taskIds || []).map((id) => tasks.find((t) => t.id === id)).filter(Boolean);
        const done = msTasks.filter((t) => t.status === 'done').length;
        const total = msTasks.length;
        const progress = total ? Math.round((done / total) * 100) : 0;
        const statusInfo = STATUS_DISPLAY[ms.status] || STATUS_DISPLAY.on_track;
        return { ...ms, project, done, total, progress, statusInfo };
      })
      .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
  }, [milestones, projects, tasks]);

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (ms) => {
    setEditId(ms.id);
    setForm({
      title: ms.title,
      projectId: ms.projectId || '',
      targetDate: ms.targetDate || '',
      status: ms.status,
    });
    setFormOpen(true);
    closeMenu();
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    if (editId) {
      updateMilestone(editId, form);
    } else {
      addMilestone({ ...form, taskIds: [] });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    deleteMilestone(deleteId);
    setDeleteId(null);
  };

  const openMenu = (e, id) => { e.stopPropagation(); setMenuAnchor(e.currentTarget); setMenuMsId(id); };
  const closeMenu = () => { setMenuAnchor(null); setMenuMsId(null); };
  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div>
      <PageHeader
        title="Milestones"
        subtitle="Track key delivery checkpoints across all your projects."
        action={
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
            New Milestone
          </Button>
        }
      />

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-[#2A2D35]" />

        <div className="space-y-5">
          {enriched.map((ms, i) => (
            <motion.div
              key={ms.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative pl-14"
            >
              {/* Timeline dot */}
              <div
                className="absolute left-[18px] top-5 h-3.5 w-3.5 rounded-full border-2 border-[#0B0D11]"
                style={{ backgroundColor: ms.statusInfo.color }}
              />

              <Card>
                <CardContent sx={{ p: 3 }}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Flag sx={{ fontSize: 16, color: ms.statusInfo.color }} />
                        <h4 className="text-sm font-semibold text-white">
                          {ms.title}
                        </h4>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {ms.project?.name || 'No project'} &middot; Due {formatDate(ms.targetDate)} ({relativeDate(ms.targetDate)})
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Chip
                        label={ms.statusInfo.label}
                        size="small"
                        sx={{
                          backgroundColor: ms.statusInfo.color + '15',
                          color: ms.statusInfo.color,
                          fontSize: '0.65rem',
                          height: 22,
                        }}
                      />
                      <IconButton size="small" onClick={(e) => openMenu(e, ms.id)} sx={{ color: '#475569' }}>
                        <MoreVert sx={{ fontSize: 16 }} />
                      </IconButton>
                    </div>
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
                          backgroundColor: ms.statusInfo.color,
                        },
                      }}
                    />
                    <div className="mt-1.5 flex justify-between text-xs text-slate-500">
                      <span>{ms.done}/{ms.total} tasks complete</span>
                      <span>{ms.progress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {enriched.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-slate-500">No milestones yet</p>
            <Button variant="contained" startIcon={<Add />} sx={{ mt: 2 }} onClick={openCreate}>
              Create your first milestone
            </Button>
          </div>
        )}
      </div>

      {/* Context menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        PaperProps={{ sx: { bgcolor: '#181B22', border: '1px solid #2A2D35', minWidth: 160 } }}
      >
        <MenuItem onClick={() => { const ms = milestones.find((m) => m.id === menuMsId); if (ms) openEdit(ms); }}>
          <ListItemIcon><Edit sx={{ fontSize: 16, color: '#94A3B8' }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setDeleteId(menuMsId); closeMenu(); }}>
          <ListItemIcon><Delete sx={{ fontSize: 16, color: '#F87171' }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.85rem', color: '#F87171' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create / Edit dialog */}
      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'Edit Milestone' : 'New Milestone'}
        submitLabel={editId ? 'Update' : 'Create'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4 pt-1">
          <TextField label="Milestone Title" fullWidth value={form.title} onChange={set('title')} autoFocus />
          <TextField select label="Project" fullWidth value={form.projectId} onChange={set('projectId')}>
            <MenuItem value="">No Project</MenuItem>
            {projects.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}
                </div>
              </MenuItem>
            ))}
          </TextField>
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Target Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.targetDate} onChange={set('targetDate')} />
            <TextField select label="Status" fullWidth value={form.status} onChange={set('status')}>
              <MenuItem value="on_track">On Track</MenuItem>
              <MenuItem value="at_risk">At Risk</MenuItem>
              <MenuItem value="behind">Behind</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          </div>
        </div>
      </FormDialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Milestone"
        message="This will permanently delete the milestone."
      />
    </div>
  );
}
