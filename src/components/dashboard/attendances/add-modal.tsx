'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import API from '@/lib/axioClient';

interface AddAttendanceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    userId: number;
    class: string;
    method: string;
    status: string;
    date: string; // ISO 8601 datetime
    time: string; // ISO 8601 datetime
  }) => void;
}

const statusOptions = ['present', 'late', 'sick', 'permission', 'absent'];
const methodOptions = ['manual', 'scan'];

interface UserOption {
  id: number;
  name: string;
  email: string;
}

export function AttendanceAddModal({
  open,
  onClose,
  onSave,
}: AddAttendanceModalProps) {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [form, setForm] = useState({
    userId: '',
    class: '',
    date: '',
    time: '',
    method: 'manual',
    status: 'present',
  });

  useEffect(() => {
  if (open) {
    API.get('/user')
      .then((res) => {
        const rawData = Array.isArray(res.data) ? res.data : res.data.data || [];
        const studentList = rawData.filter((user: any) => user.role === 'student');
        setUsers(studentList);
      })
      .catch((err) => console.error('Gagal ambil users:', err));
  }
}, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.userId || !form.date || !form.time) return;

    // Gabungkan date + time ke ISO string
    const isoDatetime = new Date(`${form.date}T${form.time}`).toISOString();

    onSave({
      userId: parseInt(form.userId),
      class: form.class,
      method: form.method,
      status: form.status,
      date: isoDatetime,
      time: isoDatetime,
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tambah Kehadiran</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="Siswa"
            name="userId"
            fullWidth
            onChange={handleChange}
            value={form.userId}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} ({user.email})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Kelas"
            name="class"
            fullWidth
            onChange={handleChange}
            value={form.class}
          />
          <TextField
            type="date"
            label="Tanggal"
            name="date"
            fullWidth
            onChange={handleChange}
            value={form.date}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="time"
            label="Waktu"
            name="time"
            fullWidth
            onChange={handleChange}
            value={form.time}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Metode"
            name="method"
            fullWidth
            onChange={handleChange}
            value={form.method}
          >
            {methodOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Status"
            name="status"
            fullWidth
            onChange={handleChange}
            value={form.status}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button onClick={handleSubmit} variant="contained">
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
}
