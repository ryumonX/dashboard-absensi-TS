'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack
} from '@mui/material';
import { WarningCircle } from '@phosphor-icons/react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="delete-dialog-title" maxWidth="xs" fullWidth>
      <DialogTitle id="delete-dialog-title">
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <WarningCircle size={32} color="#DC2626" weight="fill" />
          <Typography variant="h6" component="div">
            Hapus Data?
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="textSecondary">
          Aksi ini tidak bisa dibatalkan. Data akan dihapus secara permanen.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Batal
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color="error"
        >
          {loading ? 'Menghapus...' : 'Hapus'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
