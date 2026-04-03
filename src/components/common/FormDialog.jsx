import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

export default function FormDialog({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'Save',
  maxWidth = 'sm',
  danger,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          fontSize: '1.1rem',
        }}
      >
        {title}
        <IconButton size="small" onClick={onClose} sx={{ color: '#94A3B8' }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: '20px !important', pb: 1, overflowY: 'auto' }}>{children}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: '#94A3B8' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          color={danger ? 'error' : 'primary'}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
