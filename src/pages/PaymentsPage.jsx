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
  Search,
  AttachMoney,
  TrendingUp,
  AccountBalanceWallet,
  Receipt,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import FormDialog from '../components/common/FormDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import StatCard from '../components/common/StatCard';
import { usePayments } from '../context/PaymentContext';
import { useProjects } from '../context/ProjectContext';
import { formatDate } from '../utils/format';

const EMPTY = {
  projectId: '',
  clientName: '',
  description: '',
  amount: '',
  currency: 'USD',
  status: 'pending',
  type: 'freelance',
  date: new Date().toISOString().split('T')[0],
  dueDate: '',
};

const TYPES = ['freelance', 'salary', 'bonus', 'refund', 'other'];
const STATUSES = ['pending', 'received', 'overdue', 'cancelled'];
const CURRENCIES = ['USD', 'PKR', 'EUR', 'GBP'];

const STATUS_COLOR = {
  pending: '#FBBF24',
  received: '#34D399',
  overdue: '#F87171',
  cancelled: '#94A3B8',
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export default function PaymentsPage() {
  const { payments, addPayment, updatePayment, deletePayment, getTotalReceived, getTotalPending } =
    usePayments();
  const { projects } = useProjects();
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const filtered = useMemo(() => {
    let result = payments;
    if (filterStatus !== 'all') result = result.filter((p) => p.status === filterStatus);
    if (filterType !== 'all') result = result.filter((p) => p.type === filterType);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.clientName.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [payments, filterStatus, filterType, search]);

  const totalReceived = getTotalReceived();
  const totalPending = getTotalPending();
  const totalAll = payments.reduce((s, p) => s + p.amount, 0);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY);
    setFormOpen(true);
  };

  const openEdit = (payment) => {
    setEditId(payment.id);
    setForm({
      projectId: payment.projectId || '',
      clientName: payment.clientName,
      description: payment.description || '',
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      type: payment.type,
      date: payment.date,
      dueDate: payment.dueDate || '',
    });
    setFormOpen(true);
    setMenuAnchor(null);
  };

  const handleSubmit = () => {
    if (!form.clientName.trim() || !form.amount) return;
    const data = { ...form, amount: Number(form.amount) };
    if (editId) updatePayment(editId, data);
    else addPayment(data);
    setFormOpen(false);
  };

  const handleDelete = () => {
    deletePayment(deleteId);
    setDeleteId(null);
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const fmtMoney = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Track freelance payments, salary, and all income"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={openAdd}>
            Add Payment
          </Button>
        }
      />

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={AccountBalanceWallet}
          title="Total Income"
          value={fmtMoney(totalAll)}
          subtitle="All time"
          color="#6C63FF"
        />
        <StatCard
          icon={TrendingUp}
          title="Received"
          value={fmtMoney(totalReceived)}
          subtitle={`${payments.filter((p) => p.status === 'received').length} payments`}
          color="#34D399"
        />
        <StatCard
          icon={AttachMoney}
          title="Pending"
          value={fmtMoney(totalPending)}
          subtitle={`${payments.filter((p) => p.status === 'pending').length} payments`}
          color="#FBBF24"
        />
        <StatCard
          icon={Receipt}
          title="This Month"
          value={fmtMoney(
            payments
              .filter((p) => {
                const d = new Date(p.date);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              })
              .reduce((s, p) => s + p.amount, 0),
          )}
          subtitle="Current month total"
          color="#60A5FA"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <TextField
          size="small"
          placeholder="Search payments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <Search sx={{ fontSize: 18, mr: 1, color: '#94A3B8' }} /> }}
          sx={{ width: 260 }}
        />
        <TextField select size="small" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} sx={{ width: 140 }}>
          <MenuItem value="all">All Status</MenuItem>
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>
          ))}
        </TextField>
        <TextField select size="small" value={filterType} onChange={(e) => setFilterType(e.target.value)} sx={{ width: 140 }}>
          <MenuItem value="all">All Types</MenuItem>
          {TYPES.map((t) => (
            <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>{t}</MenuItem>
          ))}
        </TextField>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-2xl border border-[#2A2D35] bg-[#12141A]">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_120px_120px_100px_100px_48px] gap-4 border-b border-[#2A2D35] px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          <span>Client / Description</span>
          <span>Project</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Type</span>
          <span>Status</span>
          <span />
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div variants={container} initial="hidden" animate="show">
            {filtered.map((payment) => {
              const project = projects.find((p) => p.id === payment.projectId);
              return (
                <motion.div
                  key={payment.id}
                  variants={item}
                  exit={item.exit}
                  layout
                  className="group grid grid-cols-[1fr_1fr_120px_120px_100px_100px_48px] items-center gap-4 border-b border-[#2A2D35]/50 px-5 py-3.5 transition-colors hover:bg-[#181B22]"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-200">{payment.clientName}</p>
                    <p className="text-[12px] text-slate-500 truncate">{payment.description}</p>
                  </div>
                  <p className="text-[13px] text-slate-400 truncate">
                    {project ? project.name : '—'}
                  </p>
                  <p className="text-sm font-semibold text-slate-200">
                    {fmtMoney(payment.amount, payment.currency)}
                  </p>
                  <p className="text-[13px] text-slate-400">{formatDate(payment.date)}</p>
                  <Chip
                    label={payment.type}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: '0.65rem',
                      height: 22,
                      textTransform: 'capitalize',
                      borderColor: '#2A2D35',
                      color: '#94A3B8',
                    }}
                  />
                  <Chip
                    label={payment.status}
                    size="small"
                    sx={{
                      bgcolor: `${STATUS_COLOR[payment.status]}15`,
                      color: STATUS_COLOR[payment.status],
                      fontSize: '0.65rem',
                      height: 22,
                      textTransform: 'capitalize',
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setMenuAnchor(e.currentTarget);
                      setMenuId(payment.id);
                    }}
                    sx={{ color: '#94A3B8', opacity: 0, '.group:hover &': { opacity: 1 } }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <AttachMoney sx={{ fontSize: 40, color: '#2A2D35' }} />
            <p className="mt-2 text-sm text-slate-500">No payments found</p>
          </div>
        )}
      </div>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{ sx: { bgcolor: '#12141A', border: '1px solid #2A2D35' } }}
      >
        <MenuOption onClick={() => openEdit(payments.find((p) => p.id === menuId))}>
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
        title={editId ? 'Edit Payment' : 'Add Payment'}
        submitLabel={editId ? 'Update' : 'Save'}
        onSubmit={handleSubmit}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <TextField fullWidth label="Client Name" value={form.clientName} onChange={set('clientName')} autoFocus />
          <TextField fullWidth label="Description" value={form.description} onChange={set('description')} multiline rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <TextField fullWidth label="Amount" type="number" value={form.amount} onChange={set('amount')} />
            <TextField select fullWidth label="Currency" value={form.currency} onChange={set('currency')}>
              {CURRENCIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField fullWidth label="Date" type="date" value={form.date} onChange={set('date')} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="Due Date" type="date" value={form.dueDate} onChange={set('dueDate')} InputLabelProps={{ shrink: true }} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <TextField select fullWidth label="Type" value={form.type} onChange={set('type')}>
              {TYPES.map((t) => (
                <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>{t}</MenuItem>
              ))}
            </TextField>
            <TextField select fullWidth label="Status" value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => (
                <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>
              ))}
            </TextField>
            <TextField select fullWidth label="Project" value={form.projectId} onChange={set('projectId')}>
              <MenuItem value="">None</MenuItem>
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>
          </div>
        </div>
      </FormDialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Payment"
        message="Are you sure you want to delete this payment record?"
      />
    </div>
  );
}
