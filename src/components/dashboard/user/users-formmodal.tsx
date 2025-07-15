'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, MenuItem
} from '@mui/material';
import API from '@/lib/axioClient';
import dayjs from 'dayjs';
import { User } from '@/app/dashboard/users/page';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: User | null;
}

export default function UserFormModal({ open, onClose, onSuccess, initialData }: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    destinationCountry: '',
    dateOfBirth: '',
    role: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '',
        phoneNumber: initialData.phoneNumber || '',
        destinationCountry: initialData.destinationCountry || '',
        dateOfBirth: initialData.dateOfBirth
          ? dayjs(initialData.dateOfBirth).format('YYYY-MM-DD')
          : '',
        role: initialData.role || '',
      });
    } else {
      setForm({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        destinationCountry: '',
        dateOfBirth: '',
        role: '',
      });
    }
  }, [initialData]);

  const handleSubmit = async () => {
  try {
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password || undefined,
      phoneNumber: form.phoneNumber || undefined,
      destinationCountry: form.destinationCountry || undefined,
      dateOfBirth: form.dateOfBirth
        ? new Date(form.dateOfBirth).toISOString()
        : undefined,
      role: form.role || 'user',
    };

    const id =
      typeof initialData?.id === 'string'
        ? parseInt(initialData.id, 10)
        : initialData?.id;

    if (initialData && id) {
      // PATCH (edit user)
      await API.patch(`/user/${id}`, payload);

      // Jika role berubah menjadi 'teacher' dan sebelumnya bukan
      if (form.role === 'teacher' && initialData.role !== 'teacher') {
        await API.post('/teacher', { userId: id });
      }
    } else {
      // POST (tambah user baru)
      const res = await API.post('/user', payload);
      const newUser = res.data;

      // Jika role = teacher, buat entri di tabel Teacher
      if (newUser.role === 'teacher') {
        await API.post('/teachers', { userId: newUser.id });
      }

      // Reset form setelah create
      setForm({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        destinationCountry: '',
        dateOfBirth: '',
        role: '',
      });
    }

    onSuccess();
  } catch (error) {
    console.error('Failed to submit form:', error);
  }
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{initialData ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            fullWidth
            helperText={initialData ? 'Leave blank if not changing' : ''}
          />
          <TextField
            label="Phone Number"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            fullWidth
          />
          <TextField
            label="Destination Country"
            value={form.destinationCountry}
            onChange={(e) => setForm({ ...form, destinationCountry: e.target.value })}
            fullWidth
          />
          <TextField
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Role"
            select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            fullWidth
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
