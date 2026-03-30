import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chip,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  ArrowForward,
  ArrowBack,
  AccessTime,
  Search,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import FormDialog from '../components/common/FormDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useTasks } from '../context/TaskContext';
import { useProjects } from '../context/ProjectContext';
import { useUser } from '../context/UserContext';
import { PRIORITY_COLOR, relativeDate } from '../utils/format';

const COLUMNS = [
  { key: 'todo', title: 'To Do', color: '#94A3B8' },
  { key: 'in_progress', title: 'In Progress', color: '#6C63FF' },
  { key: 'in_review', title: 'In Review', color: '#FBBF24' },
  { key: 'done', title: 'Done', color: '#34D399' },
];

const STATUS_ORDER = COLUMNS.map((c) => c.key);

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const EMPTY_FORM = {
  title: '',
  projectId: '',
  priority: 'medium',
  status: 'todo',
  deadline: '',
  estimatedHours: '',
  description: '',
};

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useTasks();
  const { projects } = useProjects();
  const { roles } = useUser();

  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuTaskId, setMenuTaskId] = useState(null);
  const [filterProject, setFilterProject] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Group projects by company for the dropdown
  const projectsByCompany = useMemo(() => {
    const roleMap = {};
    roles.forEach((r) => { roleMap[r.id] = r; });
    const groups = {};
    projects.forEach((p) => {
      const role = p.roleId ? roleMap[p.roleId] : null;
      const company = role ? role.company : 'Unassigned';
      if (!groups[company]) groups[company] = [];
      groups[company].push(p);
    });
    return Object.entries(groups).sort(([a], [b]) => {
      if (a === 'Unassigned') return 1;
      if (b === 'Unassigned') return -1;
      return a.localeCompare(b);
    });
  }, [projects, roles]);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (filterProject !== 'all') {
      result = result.filter((t) => t.projectId === filterProject);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => {
        const project = projects.find((p) => p.id === t.projectId);
        return (
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q))) ||
          (project && project.name.toLowerCase().includes(q))
        );
      });
    }
    return result;
  }, [tasks, filterProject, searchQuery, projects]);

  const grouped = useMemo(() => {
    const map = {};
    COLUMNS.forEach((c) => { map[c.key] = []; });
    filteredTasks.forEach((t) => {
      if (map[t.status]) map[t.status].push(t);
    });
    return map;
  }, [filteredTasks]);

  const openCreate = (status = 'todo') => {
    setEditId(null);
    setForm({ ...EMPTY_FORM, status });
    setFormOpen(true);
  };

  const openEdit = (task) => {
    setEditId(task.id);
    setForm({
      title: task.title,
      projectId: task.projectId || '',
      priority: task.priority,
      status: task.status,
      deadline: task.deadline || '',
      estimatedHours: task.estimatedHours || '',
      description: task.description || '',
    });
    setFormOpen(true);
    closeMenu();
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const data = {
      ...form,
      estimatedHours: form.estimatedHours ? Number(form.estimatedHours) : 0,
    };
    if (editId) {
      updateTask(editId, data);
    } else {
      addTask(data);
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    deleteTask(deleteId);
    setDeleteId(null);
  };

  const moveForward = (task) => {
    const idx = STATUS_ORDER.indexOf(task.status);
    if (idx < STATUS_ORDER.length - 1) moveTask(task.id, STATUS_ORDER[idx + 1]);
    closeMenu();
  };

  const moveBackward = (task) => {
    const idx = STATUS_ORDER.indexOf(task.status);
    if (idx > 0) moveTask(task.id, STATUS_ORDER[idx - 1]);
    closeMenu();
  };

  const openMenu = (e, id) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuTaskId(id);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuTaskId(null);
  };

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const currentMenuTask = tasks.find((t) => t.id === menuTaskId);
  const canMoveForward = currentMenuTask && STATUS_ORDER.indexOf(currentMenuTask.status) < STATUS_ORDER.length - 1;
  const canMoveBack = currentMenuTask && STATUS_ORDER.indexOf(currentMenuTask.status) > 0;

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Kanban board view of all your tasks across projects."
        action={
          <div className="flex gap-2">
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              size="small"
              sx={{ borderColor: '#2A2D35', color: '#94A3B8' }}
              onClick={() => setShowFilter(!showFilter)}
            >
              Filter
            </Button>
            <Button variant="contained" startIcon={<Add />} size="small" onClick={() => openCreate()}>
              Add Task
            </Button>
          </div>
        }
      />

      {/* Search bar */}
      <div className="mb-5">
        <TextField
          placeholder="Search tasks by title, description, tag, or project..."
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

      {/* Filter row */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 overflow-hidden"
          >
            <TextField
              select
              size="small"
              label="Project"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">All Projects</MenuItem>
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </div>
                </MenuItem>
              ))}
            </TextField>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban columns */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
      >
        {COLUMNS.map((col) => (
          <motion.div key={col.key} variants={item}>
            <div className="rounded-2xl border border-[#2A2D35] bg-[#12141A] p-4">
              <div className="mb-4 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <h4 className="text-sm font-semibold text-white">{col.title}</h4>
                <span className="ml-auto text-xs text-slate-500">
                  {grouped[col.key].length}
                </span>
                <Tooltip title={`Add task to ${col.title}`}>
                  <IconButton
                    size="small"
                    onClick={() => openCreate(col.key)}
                    sx={{ color: '#475569', p: 0.3 }}
                  >
                    <Add sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {grouped[col.key].map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    const pColor = PRIORITY_COLOR[task.priority] || '#94A3B8';
                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                        className="rounded-xl border border-[#2A2D35] bg-[#181B22] p-3"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <p className="text-sm font-medium text-slate-200 pr-2">
                            {task.title}
                          </p>
                          <IconButton
                            size="small"
                            sx={{ color: '#475569', p: 0.5 }}
                            onClick={(e) => openMenu(e, task.id)}
                          >
                            <MoreVert sx={{ fontSize: 16 }} />
                          </IconButton>
                        </div>
                        {task.description && (
                          <p className="mb-2 text-xs text-slate-500 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        {project && (
                          <div className="mb-2 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.color }} />
                            <span className="text-xs text-slate-500">{project.name}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <Chip
                            label={task.priority}
                            size="small"
                            sx={{
                              backgroundColor: pColor + '15',
                              color: pColor,
                              fontSize: '0.6rem',
                              height: 20,
                              textTransform: 'capitalize',
                            }}
                          />
                          <div className="flex items-center gap-1.5">
                            {task.estimatedHours > 0 && (
                              <span className="flex items-center gap-0.5 text-[11px] text-slate-500">
                                <AccessTime sx={{ fontSize: 11 }} />
                                {task.loggedHours || 0}/{task.estimatedHours}h
                              </span>
                            )}
                            {task.deadline && (
                              <span className="text-[11px] text-slate-500">
                                {relativeDate(task.deadline)}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Context menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        PaperProps={{ sx: { bgcolor: '#181B22', border: '1px solid #2A2D35', minWidth: 180 } }}
      >
        <MenuItem onClick={() => { if (currentMenuTask) openEdit(currentMenuTask); }}>
          <ListItemIcon><Edit sx={{ fontSize: 16, color: '#94A3B8' }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Edit</ListItemText>
        </MenuItem>
        {canMoveForward && (
          <MenuItem onClick={() => moveForward(currentMenuTask)}>
            <ListItemIcon><ArrowForward sx={{ fontSize: 16, color: '#34D399' }} /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Move Forward</ListItemText>
          </MenuItem>
        )}
        {canMoveBack && (
          <MenuItem onClick={() => moveBackward(currentMenuTask)}>
            <ListItemIcon><ArrowBack sx={{ fontSize: 16, color: '#60A5FA' }} /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Move Back</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => { setDeleteId(menuTaskId); closeMenu(); }}>
          <ListItemIcon><Delete sx={{ fontSize: 16, color: '#F87171' }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.85rem', color: '#F87171' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create / Edit dialog */}
      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'Edit Task' : 'New Task'}
        submitLabel={editId ? 'Update' : 'Create'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4 pt-1">
          <TextField
            label="Task Title"
            fullWidth
            value={form.title}
            onChange={set('title')}
            autoFocus
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={set('description')}
            placeholder="Optional — add details, notes, or context..."
          />
          <TextField
            select
            label="Project"
            fullWidth
            value={form.projectId}
            onChange={set('projectId')}
          >
            <MenuItem value="">No Project</MenuItem>
            {projectsByCompany.map(([company, companyProjects]) => [
              <MenuItem key={`header-${company}`} disabled sx={{ opacity: 0.6, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', mt: 1 }}>
                {company}
              </MenuItem>,
              ...companyProjects.map((p) => (
                <MenuItem key={p.id} value={p.id} sx={{ pl: 3 }}>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </div>
                </MenuItem>
              )),
            ])}
          </TextField>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              select
              label="Priority"
              fullWidth
              value={form.priority}
              onChange={set('priority')}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              fullWidth
              value={form.status}
              onChange={set('status')}
            >
              {COLUMNS.map((c) => (
                <MenuItem key={c.key} value={c.key}>{c.title}</MenuItem>
              ))}
            </TextField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Deadline"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.deadline}
              onChange={set('deadline')}
            />
            <TextField
              label="Estimated Hours"
              type="number"
              fullWidth
              value={form.estimatedHours}
              onChange={set('estimatedHours')}
              inputProps={{ min: 0, step: 0.5 }}
            />
          </div>
        </div>
      </FormDialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="This will permanently delete the task and cannot be undone."
      />
    </div>
  );
}
