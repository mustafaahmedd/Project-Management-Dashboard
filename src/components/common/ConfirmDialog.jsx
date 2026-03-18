import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#12141A',
          border: '1px solid #2A2D35',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          fontSize: '1.05rem',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <p className="text-sm text-slate-400">{message}</p>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: '#94A3B8' }}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
