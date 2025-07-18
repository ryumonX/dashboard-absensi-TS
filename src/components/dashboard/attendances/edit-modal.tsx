'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem
} from '@mui/material';
import dayjs from 'dayjs';
import { Attendance } from './attendance-table';

interface AttendanceEditModalProps {
  open: boolean;
  data: Attendance | null;
  onClose: () => void;
  onSave: (updatedData: Partial<Attendance>) => void;
}

const statusOptions = ['present', 'Izin', 'Sakit', 'Alfa'];

export function AttendanceEditModal({
  open,
  data,
  onClose,
  onSave
}: AttendanceEditModalProps) {
  const [form, setForm] = React.useState<Partial<Attendance>>({});

  React.useEffect(() => {
    if (data) {
      setForm({
        ...data,
        date: dayjs(data.date).format('YYYY-MM-DD'),
        time: dayjs(data.time).format('HH:mm'),
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
     const isoTime = form.date && form.time
    ? new Date(`${form.date}T${form.time}`).toISOString()
    : undefined;

  onSave({
    ...form,
    date: isoTime,
    time: isoTime,
  });
    onClose();
  };

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Kehadiran</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          margin="normal"
          fullWidth
          label="Nama"
          name="name"
          value={data.user.name}
          disabled
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          name="email"
          value={data.user.email}
          disabled
        />
        <TextField
          margin="normal"
          fullWidth
          label="Kelas"
          name="className"
          value={form.class || ''}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Tanggal"
          type="date"
          name="date"
          value={form.date as string}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Waktu"
          type="time"
          name="time"
          value={form.time as string}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Metode"
          name="method"
          value={form.method || ''}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          select
          label="Status"
          name="status"
          value={form.status || ''}
          onChange={handleChange}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Batal</Button>
        <Button onClick={handleSubmit} variant="contained">Simpan</Button>
      </DialogActions>
    </Dialog>
  );
}
