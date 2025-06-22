'use client';
import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';

export interface Subject {
  id: number;
  name: string;
  teachers: {
    id: number;
    user: {
      id: number;
      name: string;
    };
  }[];
}

interface SubjectEditModalProps {
  open: boolean;
  onClose: () => void;
  data: Subject | null;
  onSave: (data: Partial<Subject>) => void;
}

export const SubjectEditModal: React.FC<SubjectEditModalProps> = ({
  open,
  onClose,
  data,
  onSave
}) => {
  const [name, setName] = React.useState('');

  React.useEffect(() => {
    if (data) {
      setName(data.name);
    }
  }, [data]);

  const handleSubmit = () => {
    onSave({ name });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Mata Pelajaran</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Nama Mata Pelajaran"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Simpan Perubahan
        </Button>
      </DialogActions>
    </Dialog>
  );
};
