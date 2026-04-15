import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  TextField,
  MenuItem,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import {
  Add,
  Delete,
  Print,
  Visibility,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import { useUser } from '../context/UserContext';
import { formatDate } from '../utils/format';

const EMPTY_SERVICE = { description: '', details: '', amount: 0, type: 'service' };

const SERVICE_TYPES = [
  { value: 'service', label: 'Service' },
  { value: 'addon', label: 'Add-on' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'license', label: 'License / Subscription' },
  { value: 'other', label: 'Other' },
];

export default function InvoicePage() {
  const { profile } = useUser();

  const [invoice, setInvoice] = useState({
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    projectName: '',
    invoiceNumber: `INV-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: 'USD',
    notes: '',
    type: 'invoice',
    taxPercent: 0,
    discount: 0,
  });

  const [services, setServices] = useState([{ ...EMPTY_SERVICE }]);
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef();

  const set = (field) => (e) => setInvoice((f) => ({ ...f, [field]: e.target.value }));

  const setService = (index, field, value) => {
    setServices((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addService = (type = 'service') =>
    setServices((prev) => [...prev, { ...EMPTY_SERVICE, type }]);

  const removeService = (index) => setServices((prev) => prev.filter((_, i) => i !== index));

  const subtotal = services.reduce((sum, s) => sum + Number(s.amount), 0);
  const taxAmount = subtotal * (Number(invoice.taxPercent) / 100);
  const discountAmount = Number(invoice.discount);
  const total = subtotal + taxAmount - discountAmount;

  const fmtMoney = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);

  const handlePrint = () => {
    const content = printRef.current;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>${invoice.type === 'quotation' ? 'Quotation' : 'Invoice'} — ${invoice.invoiceNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', -apple-system, sans-serif; color: #1a1a2e; padding: 48px; background: #fff; }
            @media print { body { padding: 24px; } }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  const docType = invoice.type === 'quotation' ? 'Quotation' : 'Invoice';
  const mainServices = services.filter((s) => s.type === 'service' || s.type === 'consultation' || s.type === 'license');
  const addOns = services.filter((s) => s.type === 'addon' || s.type === 'maintenance' || s.type === 'other');

  // ── Shared inline styles for print preview ──
  const thStyle = {
    textAlign: 'left',
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#6C63FF',
    padding: '10px 16px',
    borderBottom: '2px solid #6C63FF',
  };
  const tdStyle = {
    padding: '14px 16px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: 14,
    color: '#333',
    verticalAlign: 'top',
  };
  const sectionLabel = {
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#6C63FF',
    marginBottom: 10,
  };

  return (
    <div>
      <PageHeader
        title="Invoice Generator"
        subtitle="Create professional invoices and quotations for your services"
        action={
          <div className="flex gap-2">
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => setShowPreview(!showPreview)}
              sx={{ borderColor: '#2A2D35', color: '#94A3B8' }}
            >
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button variant="contained" startIcon={<Print />} onClick={handlePrint}>
              Print / Download
            </Button>
          </div>
        }
      />

      {!showPreview ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Document Details */}
          <div className="rounded-2xl border border-[#2A2D35] bg-[#12141A] p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-300">Document Details</h3>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <TextField select fullWidth label="Type" value={invoice.type} onChange={set('type')}>
                <MenuItem value="invoice">Invoice</MenuItem>
                <MenuItem value="quotation">Quotation / Estimate</MenuItem>
              </TextField>
              <TextField fullWidth label="Invoice #" value={invoice.invoiceNumber} onChange={set('invoiceNumber')} />
              <TextField fullWidth label="Issue Date" type="date" value={invoice.issueDate} onChange={set('issueDate')} InputLabelProps={{ shrink: true }} />
              <TextField fullWidth label="Due Date" type="date" value={invoice.dueDate} onChange={set('dueDate')} InputLabelProps={{ shrink: true }} />
            </div>
          </div>

          {/* Client & Project */}
          <div className="rounded-2xl border border-[#2A2D35] bg-[#12141A] p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-300">Client & Project</h3>
            <div className="grid grid-cols-2 gap-4">
              <TextField fullWidth label="Client Name" value={invoice.clientName} onChange={set('clientName')} />
              <TextField fullWidth label="Client Email" value={invoice.clientEmail} onChange={set('clientEmail')} />
            </div>
            <div className="mt-4">
              <TextField fullWidth label="Client Address" value={invoice.clientAddress} onChange={set('clientAddress')} multiline rows={2} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Project / Scope Name"
                placeholder="e.g. E-Commerce Platform Development"
                value={invoice.projectName}
                onChange={set('projectName')}
                helperText="Type any project name — not linked to your projects"
              />
              <TextField select fullWidth label="Currency" value={invoice.currency} onChange={set('currency')}>
                {['USD', 'PKR', 'EUR', 'GBP', 'AED', 'CAD'].map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </div>
          </div>

          {/* Services */}
          <div className="rounded-2xl border border-[#2A2D35] bg-[#12141A] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300">Services & Items</h3>
              <div className="flex gap-2">
                <Button size="small" startIcon={<Add />} onClick={() => addService('service')}>
                  Add Service
                </Button>
                <Button size="small" startIcon={<Add />} onClick={() => addService('addon')} sx={{ color: '#00D4AA' }}>
                  Add-on
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#2A2D35] bg-[#181B22] p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Chip
                        label={SERVICE_TYPES.find((t) => t.value === service.type)?.label || service.type}
                        size="small"
                        sx={{
                          bgcolor: service.type === 'addon' || service.type === 'maintenance' || service.type === 'other'
                            ? '#00D4AA15'
                            : '#6C63FF15',
                          color: service.type === 'addon' || service.type === 'maintenance' || service.type === 'other'
                            ? '#00D4AA'
                            : '#918AFF',
                          fontSize: '0.7rem',
                          height: 22,
                        }}
                      />
                      <span className="text-[11px] text-slate-600">#{i + 1}</span>
                    </div>
                    <IconButton
                      size="small"
                      onClick={() => removeService(i)}
                      disabled={services.length === 1}
                      sx={{ color: '#F87171' }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </div>

                  <div className="grid grid-cols-[1fr_140px] gap-3">
                    <div className="space-y-3">
                      <TextField
                        size="small"
                        fullWidth
                        label="Service Name"
                        placeholder="e.g. Full-Stack Web Application Development"
                        value={service.description}
                        onChange={(e) => setService(i, 'description', e.target.value)}
                      />
                      <TextField
                        size="small"
                        fullWidth
                        label="Details (optional)"
                        placeholder="Scope details, deliverables, tech stack..."
                        value={service.details}
                        onChange={(e) => setService(i, 'details', e.target.value)}
                        multiline
                        rows={2}
                      />
                    </div>
                    <div className="space-y-3">
                      <TextField
                        size="small"
                        fullWidth
                        label="Amount"
                        type="number"
                        value={service.amount}
                        onChange={(e) => setService(i, 'amount', Number(e.target.value))}
                        inputProps={{ min: 0, style: { textAlign: 'right' } }}
                      />
                      <TextField
                        select
                        size="small"
                        fullWidth
                        label="Type"
                        value={service.type}
                        onChange={(e) => setService(i, 'type', e.target.value)}
                      >
                        {SERVICE_TYPES.map((t) => (
                          <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Divider sx={{ my: 3, borderColor: '#2A2D35' }} />

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-[320px] space-y-3">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal</span>
                  <span>{fmtMoney(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-400">Tax (%)</span>
                  <TextField
                    size="small"
                    type="number"
                    value={invoice.taxPercent}
                    onChange={set('taxPercent')}
                    inputProps={{ min: 0, max: 100, style: { textAlign: 'right' } }}
                    sx={{ width: 80 }}
                  />
                  <span className="w-[100px] text-right text-sm text-slate-400">{fmtMoney(taxAmount)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-400">Discount</span>
                  <TextField
                    size="small"
                    type="number"
                    value={invoice.discount}
                    onChange={set('discount')}
                    inputProps={{ min: 0, style: { textAlign: 'right' } }}
                    sx={{ width: 80 }}
                  />
                  <span className="w-[100px] text-right text-sm text-slate-400">-{fmtMoney(discountAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-[#2A2D35] pt-3 text-lg font-bold text-white">
                  <span>Total</span>
                  <span>{fmtMoney(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-2xl border border-[#2A2D35] bg-[#12141A] p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-300">Payment Terms & Notes</h3>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Payment terms, bank details, additional notes..."
              value={invoice.notes}
              onChange={set('notes')}
            />
          </div>
        </motion.div>
      ) : (
        /* ─── Print Preview ─── */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto max-w-[850px] rounded-2xl border border-[#2A2D35] bg-white p-10"
        >
          <div ref={printRef}>
            <div style={{ maxWidth: 800, margin: '0 auto', fontFamily: "'Inter', -apple-system, sans-serif" }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#6C63FF', letterSpacing: '-0.02em' }}>ProjectPulse</div>
                  <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>Software Development Services</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.01em' }}>{docType}</div>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 6, lineHeight: 1.7 }}>
                    <span style={{ color: '#999' }}>No.</span> {invoice.invoiceNumber}<br />
                    <span style={{ color: '#999' }}>Issued</span> {formatDate(invoice.issueDate)}
                    {invoice.dueDate && <><br /><span style={{ color: '#999' }}>Due</span> {formatDate(invoice.dueDate)}</>}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 3, background: 'linear-gradient(90deg, #6C63FF, #918AFF)', borderRadius: 2, marginBottom: 32 }} />

              {/* Parties */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
                <div style={{ width: '45%' }}>
                  <div style={sectionLabel}>From</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>{profile?.name || 'Your Name'}</div>
                  <div style={{ fontSize: 13, color: '#666', lineHeight: 1.8, marginTop: 4 }}>
                    {profile?.email || 'email@example.com'}
                  </div>
                </div>
                <div style={{ width: '45%' }}>
                  <div style={sectionLabel}>Bill To</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>{invoice.clientName || 'Client Name'}</div>
                  <div style={{ fontSize: 13, color: '#666', lineHeight: 1.8, marginTop: 4 }}>
                    {invoice.clientEmail && <>{invoice.clientEmail}<br /></>}
                    {invoice.clientAddress}
                  </div>
                </div>
              </div>

              {/* Project Scope */}
              {invoice.projectName && (
                <div style={{ marginBottom: 28, padding: '14px 20px', background: '#f8f9fc', borderRadius: 10, borderLeft: '4px solid #6C63FF' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6C63FF', marginBottom: 4 }}>Project / Scope</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>{invoice.projectName}</div>
                </div>
              )}

              {/* Services Table */}
              {mainServices.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ ...sectionLabel, marginBottom: 12 }}>Services</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Description</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 140 }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mainServices.map((s, i) => (
                        <tr key={i}>
                          <td style={tdStyle}>
                            <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: s.details ? 4 : 0 }}>{s.description || '—'}</div>
                            {s.details && <div style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>{s.details}</div>}
                          </td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#1a1a2e', whiteSpace: 'nowrap' }}>
                            {fmtMoney(s.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add-ons Table */}
              {addOns.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ ...sectionLabel, color: '#00D4AA', marginBottom: 12 }}>Add-ons & Extras</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ ...thStyle, color: '#00D4AA', borderBottomColor: '#00D4AA' }}>Description</th>
                        <th style={{ ...thStyle, color: '#00D4AA', borderBottomColor: '#00D4AA', textAlign: 'right', width: 140 }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addOns.map((s, i) => (
                        <tr key={i}>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{s.description || '—'}</span>
                              <span style={{ fontSize: 10, fontWeight: 600, color: '#00D4AA', background: '#00D4AA12', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                                {SERVICE_TYPES.find((t) => t.value === s.type)?.label || 'Add-on'}
                              </span>
                            </div>
                            {s.details && <div style={{ fontSize: 12, color: '#888', lineHeight: 1.6, marginTop: 4 }}>{s.details}</div>}
                          </td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#1a1a2e', whiteSpace: 'nowrap' }}>
                            {fmtMoney(s.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <div style={{ width: 300 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14, color: '#666' }}>
                    <span>Subtotal</span>
                    <span>{fmtMoney(subtotal)}</span>
                  </div>
                  {Number(invoice.taxPercent) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14, color: '#666' }}>
                      <span>Tax ({invoice.taxPercent}%)</span>
                      <span>{fmtMoney(taxAmount)}</span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14, color: '#34D399' }}>
                      <span>Discount</span>
                      <span>-{fmtMoney(discountAmount)}</span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '3px solid #6C63FF',
                    paddingTop: 14,
                    marginTop: 8,
                    fontSize: 22,
                    fontWeight: 800,
                    color: '#1a1a2e',
                  }}>
                    <span>Total</span>
                    <span>{fmtMoney(total)}</span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 11, color: '#999', marginTop: 4 }}>
                    {invoice.currency}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div style={{ marginTop: 40, padding: '20px 24px', background: '#f8f9fc', borderRadius: 10 }}>
                  <div style={{ ...sectionLabel, marginBottom: 8 }}>Payment Terms & Notes</div>
                  <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{invoice.notes}</div>
                </div>
              )}

              {/* Footer */}
              <div style={{ textAlign: 'center', marginTop: 48, paddingTop: 20, borderTop: '1px solid #eee', fontSize: 11, color: '#bbb' }}>
                Generated by ProjectPulse &bull; {formatDate(new Date().toISOString())}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
