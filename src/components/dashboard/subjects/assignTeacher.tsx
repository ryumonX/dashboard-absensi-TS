'use client';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  CircularProgress,
  Avatar,
  Divider,
  Stack,
  Typography,
  Box
} from '@mui/material';
import API from '@/lib/axioClient';

interface Teacher {
  id: number;
  userId: number;
  user: { id: number; name: string };
}

interface AssignTeacherModalProps {
  open: boolean;
  subjectId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignTeacherModal: React.FC<AssignTeacherModalProps> = ({
  open,
  subjectId,
  onClose,
  onSuccess
}) => {
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [assignedIds, setAssignedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teacherRes, subjectRes] = await Promise.all([
        API.get('/teachers'),
        API.get(`/subjects/${subjectId}`)
      ]);

      setAllTeachers(teacherRes.data);
      setAssignedIds(subjectRes.data.teachers.map((t: Teacher) => t.id));
    } catch (err) {
      console.error('Failed to load assign teacher data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && subjectId) {
      fetchData();
    }
  }, [open, subjectId]);

  const handleToggle = async (teacherId: number) => {
    try {
      if (assignedIds.includes(teacherId)) {
        await API.post(`/subjects/${subjectId}/unassign-teacher`, { teacherId });
        setAssignedIds((prev) => prev.filter((id) => id !== teacherId));
      } else {
        await API.post(`/subjects/${subjectId}/assign-teacher`, { teacherId });
        setAssignedIds((prev) => [...prev, teacherId]);
      }
    } catch (err) {
      console.error('Failed to update assignment:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={600} fontSize="1.25rem">
        Pilih Guru untuk Mata Pelajaran
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <Stack alignItems="center">
              <CircularProgress />
              <Typography mt={2}>Memuat data guru...</Typography>
            </Stack>
          </Box>
        ) : (
          <List disablePadding>
            {allTeachers.map((teacher, idx) => (
              <React.Fragment key={teacher.id}>
                <ListItem
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      checked={assignedIds.includes(teacher.id)}
                      onChange={() => handleToggle(teacher.id)}
                      color="primary"
                    />
                  }
                  sx={{
                    py: 1,
                    px: 2,
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    borderRadius: 1,
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <Avatar sx={{ mr: 2 }}>
                    {teacher.user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={500}>
                        {teacher.user.name}
                      </Typography>
                    }
                  />
                </ListItem>
                {idx !== allTeachers.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Tutup
        </Button>
        <Button onClick={onSuccess} variant="contained" color="primary">
          Selesai
        </Button>
      </DialogActions>
    </Dialog>
  );
};
