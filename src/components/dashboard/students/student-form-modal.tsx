'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack
} from '@mui/material';
import API from '@/lib/axioClient';
import { Student } from '@/app/dashboard/students/page';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Student | null;
}

export default function StudentFormModal({ open, onClose, onSuccess, initialData }: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    destinationCountry: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '',
        phoneNumber: initialData.phoneNumber || '',
        destinationCountry: initialData.destinationCountry || '',
        dateOfBirth: initialData.dateOfBirth || '',
      });
    } else {
      setForm({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        destinationCountry: '',
        dateOfBirth: '',
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
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : undefined,
        role: 'student',
      };

      if (initialData) {
        await API.put(`/user/${initialData.id}`, payload);
      } else {
        await API.post('/user', payload);
      }

      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{initialData ? 'Edit Student' : 'Add Student'}</DialogTitle>
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
