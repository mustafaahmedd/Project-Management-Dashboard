import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Avatar,
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
import {
  Edit,
  Delete,
  Add,
  MoreVert,
  Star,
  StarBorder,
  Work,
  Business,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import FormDialog from '../components/common/FormDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useProjects } from '../context/ProjectContext';
import { useTasks } from '../context/TaskContext';
import { useTime } from '../context/TimeContext';
import { useUser } from '../context/UserContext';
import { formatDuration, PRIORITY_COLOR, formatDate } from '../utils/format';

const ROLE_TYPES = ['employee', 'freelancer', 'founder', 'contractor', 'other'];

const EMPTY_ROLE_FORM = {
  title: '',
  company: '',
  type: 'employee',
  startDate: '',
  endDate: '',
  isActive: true,
};

export default function ProfilePage() {
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { entries } = useTime();
  const { profile, roles, updateProfile, addRole, updateRole, deleteRole } = useUser();

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    bio: profile?.bio || '',
  });

  // Skill edit state
  const [newSkill, setNewSkill] = useState('');

  // Role CRUD state
  const [roleFormOpen, setRoleFormOpen] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);
  const [roleForm, setRoleForm] = useState(EMPTY_ROLE_FORM);
  const [deleteRoleId, setDeleteRoleId] = useState(null);
  const [roleMenuAnchor, setRoleMenuAnchor] = useState(null);
  const [roleMenuId, setRoleMenuId] = useState(null);

  const stats = useMemo(() => {
    const activeProjects = projects.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const totalTasks = tasks.length;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekMinutes = entries
      .filter((e) => new Date(e.startTime) >= weekStart)
      .reduce((sum, e) => sum + e.durationMinutes, 0);
    const totalMinutes = entries.reduce((sum, e) => sum + e.durationMinutes, 0);

    const byPriority = { critical: 0, high: 0, medium: 0, low: 0 };
    tasks.forEach((t) => { if (byPriority[t.priority] !== undefined) byPriority[t.priority]++; });

    return { activeProjects, completedTasks, totalTasks, weekMinutes, totalMinutes, byPriority };
  }, [projects, tasks, entries]);

  const topProjects = useMemo(() => {
    return projects
      .map((p) => ({
        ...p,
        taskCount: tasks.filter((t) => t.projectId === p.id).length,
        doneCount: tasks.filter((t) => t.projectId === p.id && t.status === 'done').length,
      }))
      .sort((a, b) => b.taskCount - a.taskCount)
      .slice(0, 4);
  }, [projects, tasks]);

  // Profile handlers
  const saveProfile = () => {
    updateProfile(profileForm);
    setEditingProfile(false);
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const skills = [...(profile?.skills || []), newSkill.trim()];
    updateProfile({ skills });
    setNewSkill('');
  };

  const removeSkill = (skill) => {
    const skills = (profile?.skills || []).filter((s) => s !== skill);
    updateProfile({ skills });
  };

  // Role handlers
  const openCreateRole = () => {
    setEditRoleId(null);
    setRoleForm(EMPTY_ROLE_FORM);
    setRoleFormOpen(true);
  };

  const openEditRole = (role) => {
    setEditRoleId(role.id);
    setRoleForm({
      title: role.title,
      company: role.company,
      type: role.type,
      startDate: role.startDate || '',
      endDate: role.endDate || '',
      isActive: role.isActive,
    });
    setRoleFormOpen(true);
    closeRoleMenu();
  };

  const handleRoleSubmit = () => {
    if (!roleForm.title.trim() || !roleForm.company.trim()) return;
    if (editRoleId) {
      updateRole(editRoleId, roleForm);
    } else {
      addRole(roleForm);
    }
    setRoleFormOpen(false);
  };

  const handleDeleteRole = () => {
    deleteRole(deleteRoleId);
    setDeleteRoleId(null);
  };

  const setPrimary = (roleId) => {
    updateProfile({ primaryRoleId: roleId });
    closeRoleMenu();
  };

  const openRoleMenu = (e, id) => {
    e.stopPropagation();
    setRoleMenuAnchor(e.currentTarget);
    setRoleMenuId(id);
  };

  const closeRoleMenu = () => {
    setRoleMenuAnchor(null);
    setRoleMenuId(null);
  };

  const setRoleField = (field) => (e) => setRoleForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setProfileField = (field) => (e) => setProfileForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Your account details, roles, and activity summary."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-1 space-y-6"
        >
          <Card>
            <CardContent sx={{ p: 4 }}>
              {!editingProfile ? (
                <>
                  <div className="flex flex-col items-center text-center">
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: '#6C63FF',
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        mb: 2,
                      }}
                    >
                      {profile?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
                    </Avatar>
                    <h3 className="text-xl font-bold text-white">{profile?.name}</h3>
                    <p className="text-sm text-slate-400">
                      {roles.find((r) => r.id === profile?.primaryRoleId)?.title || 'No primary role'}
                    </p>
                    {profile?.bio && (
                      <p className="mt-2 text-xs text-slate-500">{profile.bio}</p>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {(profile?.skills || []).map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        onDelete={() => removeSkill(skill)}
                        sx={{ bgcolor: '#6C63FF15', color: '#918AFF', fontSize: '0.7rem' }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <TextField
                      size="small"
                      placeholder="Add skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                      sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                    <IconButton size="small" onClick={addSkill} sx={{ color: '#6C63FF' }}>
                      <Add />
                    </IconButton>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-[#2A2D35] p-3">
                      <span className="text-sm text-slate-400">Email</span>
                      <span className="text-sm text-slate-200">{profile?.email}</span>
                    </div>
                  </div>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Edit />}
                    sx={{ mt: 3, borderColor: '#2A2D35', color: '#94A3B8' }}
                    onClick={() => {
                      setProfileForm({ name: profile?.name || '', email: profile?.email || '', bio: profile?.bio || '' });
                      setEditingProfile(true);
                    }}
                  >
                    Edit Profile
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-white">Edit Profile</h3>
                  <TextField label="Name" fullWidth value={profileForm.name} onChange={setProfileField('name')} />
                  <TextField label="Email" fullWidth value={profileForm.email} onChange={setProfileField('email')} />
                  <TextField label="Bio" fullWidth multiline rows={2} value={profileForm.bio} onChange={setProfileField('bio')} />
                  <div className="flex gap-2">
                    <Button variant="contained" onClick={saveProfile} fullWidth>Save</Button>
                    <Button variant="outlined" onClick={() => setEditingProfile(false)} fullWidth sx={{ borderColor: '#2A2D35', color: '#94A3B8' }}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Roles card */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">My Roles</h3>
                <IconButton size="small" onClick={openCreateRole} sx={{ color: '#6C63FF' }}>
                  <Add />
                </IconButton>
              </div>
              <div className="space-y-3">
                {roles.map((role) => {
                  const isPrimary = profile?.primaryRoleId === role.id;
                  const roleProjects = projects.filter((p) => p.roleId === role.id);
                  return (
                    <div
                      key={role.id}
                      className={`rounded-xl border p-3 transition-colors ${isPrimary ? 'border-[#6C63FF40] bg-[#6C63FF08]' : 'border-[#2A2D35]'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#181B22]">
                            {role.type === 'founder' ? <Star sx={{ fontSize: 14, color: '#FBBF24' }} />
                              : role.type === 'freelancer' ? <Work sx={{ fontSize: 14, color: '#34D399' }} />
                              : <Business sx={{ fontSize: 14, color: '#60A5FA' }} />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200">{role.title}</p>
                            <p className="text-xs text-slate-500">{role.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {isPrimary && (
                            <Chip label="Primary" size="small" sx={{ bgcolor: '#6C63FF15', color: '#918AFF', fontSize: '0.6rem', height: 18 }} />
                          )}
                          <IconButton size="small" onClick={(e) => openRoleMenu(e, role.id)} sx={{ color: '#475569' }}>
                            <MoreVert sx={{ fontSize: 14 }} />
                          </IconButton>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-600">
                        <span className="capitalize">{role.type}</span>
                        <span>{roleProjects.length} project{roleProjects.length !== 1 ? 's' : ''}</span>
                        {role.isActive ? (
                          <span className="text-[#34D399]">Active</span>
                        ) : (
                          <span className="text-slate-600">Inactive</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {roles.length === 0 && (
                  <p className="py-4 text-center text-sm text-slate-500">No roles added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats + Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="xl:col-span-2 space-y-6"
        >
          {/* Key stats */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <h3 className="mb-4 text-base font-semibold text-white">Performance Summary</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-[#2A2D35] p-4 text-center">
                  <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
                  <p className="text-xs text-slate-500">Active Projects</p>
                </div>
                <div className="rounded-xl border border-[#2A2D35] p-4 text-center">
                  <p className="text-2xl font-bold text-white">{stats.completedTasks}</p>
                  <p className="text-xs text-slate-500">Tasks Completed</p>
                </div>
                <div className="rounded-xl border border-[#2A2D35] p-4 text-center">
                  <p className="text-2xl font-bold text-white">{formatDuration(stats.weekMinutes)}</p>
                  <p className="text-xs text-slate-500">Hours This Week</p>
                </div>
                <div className="rounded-xl border border-[#2A2D35] p-4 text-center">
                  <p className="text-2xl font-bold text-white">{formatDuration(stats.totalMinutes)}</p>
                  <p className="text-xs text-slate-500">Total Logged</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priority breakdown */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <h3 className="mb-4 text-base font-semibold text-white">Task Priority Spread</h3>
              <div className="space-y-3">
                {Object.entries(stats.byPriority).map(([priority, count]) => {
                  const pct = stats.totalTasks ? Math.round((count / stats.totalTasks) * 100) : 0;
                  return (
                    <div key={priority}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm capitalize text-slate-300">{priority}</span>
                        <span className="text-sm text-slate-400">{count} ({pct}%)</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 5,
                          borderRadius: 3,
                          backgroundColor: '#1E2128',
                          '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: PRIORITY_COLOR[priority] },
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top projects */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <h3 className="mb-4 text-base font-semibold text-white">Top Projects</h3>
              <div className="space-y-3">
                {topProjects.map((p) => {
                  const pct = p.taskCount ? Math.round((p.doneCount / p.taskCount) * 100) : 0;
                  return (
                    <div key={p.id} className="rounded-lg border border-[#2A2D35] p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                          <span className="text-sm font-medium text-slate-200">{p.name}</span>
                        </div>
                        <span className="text-xs text-slate-500">{p.doneCount}/{p.taskCount} tasks</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 4,
                          borderRadius: 3,
                          backgroundColor: '#1E2128',
                          '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: p.color },
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Role context menu */}
      <Menu
        anchorEl={roleMenuAnchor}
        open={Boolean(roleMenuAnchor)}
        onClose={closeRoleMenu}
        PaperProps={{ sx: { bgcolor: '#181B22', border: '1px solid #2A2D35', minWidth: 160 } }}
      >
        {roleMenuId && profile?.primaryRoleId !== roleMenuId && (
          <MenuItem onClick={() => setPrimary(roleMenuId)}>
            <ListItemIcon><StarBorder sx={{ fontSize: 16, color: '#FBBF24' }} /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Set as Primary</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => { const r = roles.find((x) => x.id === roleMenuId); if (r) openEditRole(r); }}>
          <ListItemIcon><Edit sx={{ fontSize: 16, color: '#94A3B8' }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setDeleteRoleId(roleMenuId); closeRoleMenu(); }}>
          <ListItemIcon><Delete sx={{ fontSize: 16, color: '#F87171' }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.85rem', color: '#F87171' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Role create / edit dialog */}
      <FormDialog
        open={roleFormOpen}
        onClose={() => setRoleFormOpen(false)}
        title={editRoleId ? 'Edit Role' : 'Add New Role'}
        submitLabel={editRoleId ? 'Update' : 'Add Role'}
        onSubmit={handleRoleSubmit}
      >
        <div className="space-y-4 pt-1">
          <TextField
            label="Role Title"
            fullWidth
            value={roleForm.title}
            onChange={setRoleField('title')}
            autoFocus
            placeholder="e.g., Junior Developer, CEO, Freelancer"
          />
          <TextField
            label="Company / Organization"
            fullWidth
            value={roleForm.company}
            onChange={setRoleField('company')}
            placeholder="e.g., FHS Technologies, Self-employed"
          />
          <TextField
            select
            label="Type"
            fullWidth
            value={roleForm.type}
            onChange={setRoleField('type')}
          >
            {ROLE_TYPES.map((t) => (
              <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>{t}</MenuItem>
            ))}
          </TextField>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={roleForm.startDate}
              onChange={setRoleField('startDate')}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={roleForm.endDate}
              onChange={setRoleField('endDate')}
              helperText="Leave empty if current"
            />
          </div>
        </div>
      </FormDialog>

      {/* Role delete confirmation */}
      <ConfirmDialog
        open={Boolean(deleteRoleId)}
        onClose={() => setDeleteRoleId(null)}
        onConfirm={handleDeleteRole}
        title="Delete Role"
        message="This will remove the role. Projects associated with this role will become unassigned."
      />
    </div>
  );
}
