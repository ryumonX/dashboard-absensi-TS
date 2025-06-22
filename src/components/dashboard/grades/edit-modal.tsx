'use client';
import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';

export interface Grade {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  subject: {
    id: number;
    name: string;
  };
   teacher: {
    id: number;
    user: { id: number; name: string };
  };
  semester: string;
  score: number;
  remarks?: string | null;
  createdAt?: string;
}


interface GradeEditModalProps {
  open: boolean;
  onClose: () => void;
  data: Grade | null;
  onSave: (data: Partial<Grade>) => void;
}

export const GradeEditModal: React.FC<GradeEditModalProps> = ({ open, onClose, data, onSave }) => {
  const [form, setForm] = React.useState({
    score: '',
    remarks: ''
  });

  React.useEffect(() => {
    if (data) {
      setForm({
        score: String(data.score),
        remarks: data.remarks || ''
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({
      score: Number(form.score),
      remarks: form.remarks || null
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Grade</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth
          margin="normal"
          name="score"
          label="Score"
          type="number"
          value={form.score}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="remarks"
          label="Remarks"
          value={form.remarks}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
