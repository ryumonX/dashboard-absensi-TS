'use client';
import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, CircularProgress
} from '@mui/material';
import API from '@/lib/axio-client';

interface SubjectData {
  id: string;
  name: string;
}

interface SubjectAddModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SubjectData) => Promise<void>;
}

export const SubjectAddModal: React.FC<SubjectAddModalProps> = ({
  open, onClose, onSave
}) => {
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Nama mata pelajaran tidak boleh kosong');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await API.post('/subjects', { name });
      await onSave(res.data);
      onClose();
      setName('');
    } catch {
      setError('Gagal menambahkan mata pelajaran');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      setName('');
      setError('');
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Tambah Mata Pelajaran</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth
          label="Nama Mata Pelajaran"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!error}
          helperText={error}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Batal</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Simpan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
