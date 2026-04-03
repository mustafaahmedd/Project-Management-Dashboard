import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  InputAdornment,
} from '@mui/material';
import { Add, FolderCopy, Edit, Delete, MoreVert, Search, Visibility } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import FormDialog from '../components/common/FormDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useProjects } from '../context/ProjectContext';
import { useTasks } from '../context/TaskContext';
import { useUser } from '../context/UserContext';
import { computeProjectProgress, STATUS_DISPLAY, PRIORITY_COLOR, formatDate } from '../utils/format';

const PROJECT_COLORS = [
  '#6C63FF', '#34D399', '#FBBF24', '#F87171', '#60A5FA', '#C084FC', '#F472B6', '#FB923C',
  '#14B8A6', '#A78BFA', '#E879F9', '#F59E0B', '#EF4444', '#22D3EE', '#84CC16', '#EC4899',
];

const PROJECT_STATUSES = [
  { value: 'on_track', label: 'On Track' },
  { value: 'at_risk', label: 'At Risk' },
  { value: 'behind', label: 'Behind' },
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

const PROJECT_PRIORITIES = [
  { value: 'critical', label: 'Critical', color: '#EF4444' },
  { value: 'high', label: 'High', color: '#F87171' },
  { value: 'medium', label: 'Medium', color: '#FBBF24' },
  { value: 'low', label: 'Low', color: '#34D399' },
];

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
  priority: 'medium',
  startDate: '',
  deadline: '',
  roleId: '',
};

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { tasks } = useTasks();
  const { roles } = useUser();
  const navigate = useNavigate();

  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuProjectId, setMenuProjectId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const enrichedProjects = useMemo(() => {
    return projects.map((p) => {
      const projectTasks = tasks.filter((t) => t.projectId === p.id);
      const progress = computeProjectProgress(projectTasks);
      const completed = projectTasks.filter((t) => t.status === 'done').length;
      const role = p.roleId ? roles.find((r) => r.id === p.roleId) : null;
      return { ...p, progress, taskCount: projectTasks.length, completedCount: completed, role };
    });
  }, [projects, tasks, roles]);

  const filtered = useMemo(() => {
    let result = enrichedProjects;
    if (filterStatus !== 'all') {
      result = result.filter((p) => p.status === filterStatus);
    }
    if (filterRole !== 'all') {
      result = result.filter((p) => p.roleId === filterRole);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.role && p.role.company.toLowerCase().includes(q)) ||
        (p.role && p.role.title.toLowerCase().includes(q))
      );
    }
    return result;
  }, [enrichedProjects, filterStatus, filterRole, searchQuery]);

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
      priority: project.priority || 'medium',
      startDate: project.startDate || '',
      deadline: project.deadline || '',
      roleId: project.roleId || '',
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { borderColor: '#2A2D35' } }}
            >
              <MenuItem value="all">All Status</MenuItem>
              {PROJECT_STATUSES.map((s) => (
                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderColor: '#2A2D35' } }}
            >
              <MenuItem value="all">All Roles</MenuItem>
              {roles.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.title} @ {r.company}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
              New Project
            </Button>
          </div>
        }
      />

      {/* Search bar */}
      <div className="mb-5">
        <TextField
          placeholder="Search projects by name, description, or company..."
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18, color: '#475569' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#12141A',
              borderRadius: '12px',
              '& fieldset': { borderColor: '#2A2D35' },
              '&:hover fieldset': { borderColor: '#3A3D45' },
              '&.Mui-focused fieldset': { borderColor: '#6C63FF' },
            },
          }}
        />
      </div>

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
                <Card
                  sx={{ height: '100%', cursor: 'pointer', '&:hover': { borderColor: project.color + '40' } }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: project.color + '15' }}
                        >
                          <FolderCopy sx={{ fontSize: 16, color: project.color }} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate">
                            {project.name}
                          </h4>
                          {project.role && (
                            <p className="text-[10px] text-slate-500 truncate">
                              {project.role.company}
                            </p>
                          )}
                        </div>
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

                    <p className="mb-3 text-xs leading-relaxed text-slate-400 line-clamp-2">
                      {project.description}
                    </p>

                    {project.priority && (
                      <div className="mb-3">
                        <Chip
                          label={project.priority}
                          size="small"
                          sx={{
                            backgroundColor: (PRIORITY_COLOR[project.priority] || '#94A3B8') + '15',
                            color: PRIORITY_COLOR[project.priority] || '#94A3B8',
                            fontSize: '0.6rem',
                            height: 20,
                            textTransform: 'capitalize',
                          }}
                        />
                      </div>
                    )}

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
        <MenuItem onClick={() => { navigate(`/projects/${menuProjectId}`); closeMenu(); }}>
          <ListItemIcon><Visibility sx={{ fontSize: 16, color: '#94A3B8' }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>View</ListItemText>
        </MenuItem>
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
          <TextField
            select
            label="Role / Company"
            fullWidth
            value={form.roleId}
            onChange={set('roleId')}
          >
            <MenuItem value="">No Role</MenuItem>
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{r.type}</span>
                  <span>{r.title} @ {r.company}</span>
                </div>
              </MenuItem>
            ))}
          </TextField>
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
          <div className="grid grid-cols-2 gap-4">
            <TextField
              select
              label="Status"
              fullWidth
              value={form.status}
              onChange={set('status')}
            >
              {PROJECT_STATUSES.map((s) => (
                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Priority"
              fullWidth
              value={form.priority}
              onChange={set('priority')}
            >
              {PROJECT_PRIORITIES.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.label}
                  </div>
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div>
            <p className="mb-2 text-xs text-slate-400">Color</p>
            <div className="flex flex-wrap gap-2">
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
