import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Menu,
  MenuItem as MenuOption,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Lightbulb,
  Search,
  EmojiObjects,
  Explore,
  Build,
  Star,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import FormDialog from '../components/common/FormDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useIdeas } from '../context/IdeaContext';

const EMPTY = { title: '', description: '', category: 'general', priority: 'medium', status: 'new' };

const CATEGORIES = [
  { value: 'feature', label: 'Feature', icon: Star },
  { value: 'integration', label: 'Integration', icon: Build },
  { value: 'improvement', label: 'Improvement', icon: Explore },
  { value: 'general', label: 'General', icon: Lightbulb },
];

const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const STATUSES = ['new', 'exploring', 'planned', 'building', 'done', 'parked'];

const STATUS_COLOR = {
  new: '#60A5FA',
  exploring: '#FBBF24',
  planned: '#918AFF',
  building: '#34D399',
  done: '#22C55E',
  parked: '#94A3B8',
};

const PRIORITY_COLOR = {
  low: '#34D399',
  medium: '#FBBF24',
  high: '#F87171',
  critical: '#EF4444',
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export default function IdeasPage() {
  const { ideas, addIdea, updateIdea, deleteIdea } = useIdeas();
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const filtered = useMemo(() => {
    let result = ideas;
    if (filterCat !== 'all') result = result.filter((i) => i.category === filterCat);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) => i.title.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [ideas, filterCat, search]);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY);
    setFormOpen(true);
  };

  const openEdit = (idea) => {
    setEditId(idea.id);
    setForm({
      title: idea.title,
      description: idea.description || '',
      category: idea.category,
      priority: idea.priority,
      status: idea.status,
    });
    setFormOpen(true);
    setMenuAnchor(null);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    if (editId) updateIdea(editId, form);
    else addIdea(form);
    setFormOpen(false);
  };

  const handleDelete = () => {
    deleteIdea(deleteId);
    setDeleteId(null);
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div>
      <PageHeader
        title="Ideas"
        subtitle="Capture instant ideas before they slip away"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={openAdd}>
            New Idea
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <TextField
          size="small"
          placeholder="Search ideas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <Search sx={{ fontSize: 18, mr: 1, color: '#94A3B8' }} /> }}
          sx={{ width: 260 }}
        />
        <TextField
          select
          size="small"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="all">All Categories</MenuItem>
          {CATEGORIES.map((c) => (
            <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
          ))}
        </TextField>
      </div>

      {/* Ideas Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((idea) => (
            <motion.div key={idea.id} variants={item} exit={item.exit} layout>
              <div className="group relative rounded-2xl border border-[#2A2D35] bg-[#12141A] p-5 transition-colors hover:border-[#3A3D45]">
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <EmojiObjects sx={{ fontSize: 20, color: STATUS_COLOR[idea.status] }} />
                    <Chip
                      label={idea.status}
                      size="small"
                      sx={{
                        bgcolor: `${STATUS_COLOR[idea.status]}15`,
                        color: STATUS_COLOR[idea.status],
                        fontSize: '0.7rem',
                        height: 22,
                        textTransform: 'capitalize',
                      }}
                    />
                  </div>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setMenuAnchor(e.currentTarget);
                      setMenuId(idea.id);
                    }}
                    sx={{ color: '#94A3B8', opacity: 0, '.group:hover &': { opacity: 1 } }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-[15px] font-semibold text-slate-200 leading-snug">
                  {idea.title}
                </h3>

                {/* Description */}
                {idea.description && (
                  <p className="mb-4 text-[13px] text-slate-500 line-clamp-3">
                    {idea.description}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center gap-2">
                  <Chip
                    label={idea.category}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.65rem', height: 20, textTransform: 'capitalize', borderColor: '#2A2D35', color: '#94A3B8' }}
                  />
                  <Chip
                    label={idea.priority}
                    size="small"
                    sx={{
                      bgcolor: `${PRIORITY_COLOR[idea.priority]}15`,
                      color: PRIORITY_COLOR[idea.priority],
                      fontSize: '0.65rem',
                      height: 20,
                      textTransform: 'capitalize',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="mt-16 text-center">
          <Lightbulb sx={{ fontSize: 48, color: '#2A2D35' }} />
          <p className="mt-3 text-sm text-slate-500">No ideas yet — capture your first one!</p>
        </div>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{ sx: { bgcolor: '#12141A', border: '1px solid #2A2D35' } }}
      >
        <MenuOption onClick={() => openEdit(ideas.find((i) => i.id === menuId))}>
          <Edit sx={{ fontSize: 16, mr: 1 }} /> Edit
        </MenuOption>
        <MenuOption
          onClick={() => {
            setDeleteId(menuId);
            setMenuAnchor(null);
          }}
          sx={{ color: '#F87171' }}
        >
          <Delete sx={{ fontSize: 16, mr: 1 }} /> Delete
        </MenuOption>
      </Menu>

      {/* Form Dialog */}
      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'Edit Idea' : 'New Idea'}
        submitLabel={editId ? 'Update' : 'Save'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <TextField
            fullWidth
            label="Title"
            value={form.title}
            onChange={set('title')}
            autoFocus
          />
          <TextField
            fullWidth
            label="Description"
            value={form.description}
            onChange={set('description')}
            multiline
            rows={3}
          />
          <div className="grid grid-cols-3 gap-3">
            <TextField select fullWidth label="Category" value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => (
                <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
              ))}
            </TextField>
            <TextField select fullWidth label="Priority" value={form.priority} onChange={set('priority')}>
              {PRIORITIES.map((p) => (
                <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>{p}</MenuItem>
              ))}
            </TextField>
            <TextField select fullWidth label="Status" value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => (
                <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>
              ))}
            </TextField>
          </div>
        </div>
      </FormDialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Idea"
        message="Are you sure you want to delete this idea? This cannot be undone."
      />
    </div>
  );
}
