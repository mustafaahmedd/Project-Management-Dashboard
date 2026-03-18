import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Add, FolderCopy, Edit, Delete, MoreVert } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import FormDialog from '../components/common/FormDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useProjects } from '../context/ProjectContext';
import { useTasks } from '../context/TaskContext';
import { computeProjectProgress, STATUS_DISPLAY, formatDate } from '../utils/format';

const PROJECT_COLORS = ['#6C63FF', '#34D399', '#FBBF24', '#F87171', '#60A5FA', '#C084FC', '#F472B6', '#FB923C'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const EMPTY_FORM = {
  name: '',
  description: '',
  color: '#6C63FF',
  status: 'on_track',
  startDate: '',
  deadline: '',
};

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { tasks } = useTasks();

  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuProjectId, setMenuProjectId] = useState(null);
  const [filter, setFilter] = useState('all');

  const enrichedProjects = useMemo(() => {
    return projects.map((p) => {
      const projectTasks = tasks.filter((t) => t.projectId === p.id);
      const progress = computeProjectProgress(projectTasks);
      const completed = projectTasks.filter((t) => t.status === 'done').length;
      return { ...p, progress, taskCount: projectTasks.length, completedCount: completed };
    });
  }, [projects, tasks]);

  const filtered = useMemo(() => {
    if (filter === 'all') return enrichedProjects;
    return enrichedProjects.filter((p) => p.status === filter);
  }, [enrichedProjects, filter]);

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (project) => {
    setEditId(project.id);
    setForm({
      name: project.name,
      description: project.description || '',
      color: project.color,
      status: project.status,
      startDate: project.startDate || '',
      deadline: project.deadline || '',
    });
    setFormOpen(true);
    closeMenu();
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (editId) {
      updateProject(editId, form);
    } else {
      addProject(form);
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    deleteProject(deleteId);
    setDeleteId(null);
  };

  const openMenu = (e, id) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuProjectId(id);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuProjectId(null);
  };

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Manage and monitor all your active projects."
        action={
          <div className="flex items-center gap-2">
            <TextField
              select
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { borderColor: '#2A2D35' } }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="on_track">On Track</MenuItem>
              <MenuItem value="at_risk">At Risk</MenuItem>
              <MenuItem value="behind">Behind</MenuItem>
            </TextField>
            <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
              New Project
            </Button>
          </div>
        }
      />

      <AnimatePresence mode="popLayout">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3"
        >
          {filtered.map((project) => {
            const statusInfo = STATUS_DISPLAY[project.status] || STATUS_DISPLAY.on_track;
            return (
              <motion.div
                key={project.id}
                variants={item}
                layout
                whileHover={{ y: -4 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { borderColor: project.color + '40' } }}>
                  <CardContent sx={{ p: 3 }}>
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: project.color + '15' }}
                        >
                          <FolderCopy sx={{ fontSize: 16, color: project.color }} />
                        </div>
                        <h4 className="text-sm font-semibold text-white truncate">
                          {project.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <Chip
                          label={statusInfo.label}
                          size="small"
                          sx={{
                            backgroundColor: statusInfo.color + '15',
                            color: statusInfo.color,
                            fontSize: '0.65rem',
                            height: 22,
                          }}
                        />
                        <IconButton size="small" onClick={(e) => openMenu(e, project.id)} sx={{ color: '#475569' }}>
                          <MoreVert sx={{ fontSize: 16 }} />
                        </IconButton>
                      </div>
                    </div>

                    <p className="mb-4 text-xs leading-relaxed text-slate-400 line-clamp-2">
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
                        {project.completedCount}/{project.taskCount} tasks
                      </span>
                      <span>{project.deadline ? `Due ${formatDate(project.deadline)}` : 'No deadline'}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-slate-500">No projects found</p>
          <Button variant="contained" startIcon={<Add />} sx={{ mt: 2 }} onClick={openCreate}>
            Create your first project
          </Button>
        </div>
      )}

      {/* Context menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        PaperProps={{ sx: { bgcolor: '#181B22', border: '1px solid #2A2D35', minWidth: 160 } }}
      >
        <MenuItem onClick={() => { const p = projects.find((x) => x.id === menuProjectId); if (p) openEdit(p); }}>
          <ListItemIcon><Edit sx={{ fontSize: 16, color: '#94A3B8' }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setDeleteId(menuProjectId); closeMenu(); }}>
          <ListItemIcon><Delete sx={{ fontSize: 16, color: '#F87171' }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.85rem', color: '#F87171' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create / Edit dialog */}
      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'Edit Project' : 'New Project'}
        submitLabel={editId ? 'Update' : 'Create'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4 pt-1">
          <TextField
            label="Project Name"
            fullWidth
            value={form.name}
            onChange={set('name')}
            autoFocus
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={set('description')}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.startDate}
              onChange={set('startDate')}
            />
            <TextField
              label="Deadline"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.deadline}
              onChange={set('deadline')}
            />
          </div>
          <TextField
            select
            label="Status"
            fullWidth
            value={form.status}
            onChange={set('status')}
          >
            <MenuItem value="on_track">On Track</MenuItem>
            <MenuItem value="at_risk">At Risk</MenuItem>
            <MenuItem value="behind">Behind</MenuItem>
          </TextField>
          <div>
            <p className="mb-2 text-xs text-slate-400">Color</p>
            <div className="flex gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                  className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: form.color === c ? '#fff' : 'transparent',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </FormDialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="This will permanently delete the project and cannot be undone. Tasks associated with this project will not be deleted."
      />
    </div>
  );
}
