'use client';

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, IconButton, Tooltip, useTheme, TextField
} from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import API from '@/lib/axio-client';
import {
  CheckCircle, XCircle, User, Envelope,
  FloppyDiskBack, X
} from '@phosphor-icons/react';
import styles from './styles/AttendanceAddModal.module.css';

interface AttendanceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    userId: number;
    class: string;
    method: 'manual';
    status: 'present' | 'absent';
    date: string;
    time: string;
  }) => void;
}

interface Student {
  id: number;
  name: string;
  email: string;
}

interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface ApiResponse {
  data?: ApiUser[];
}

type AttendanceStatus = 'present' | 'absent' | null;

export function AttendanceAddModal({ open, onClose, onSave }: AttendanceModalProps) {
  const theme = useTheme();
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, AttendanceStatus>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!open) return;
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const res = await API.get('/user');
        const data = Array.isArray(res.data) ? res.data : (res.data as ApiResponse).data || [];
        const filtered = data.filter((user: ApiUser) => user.role === 'student');
        setStudentList(filtered);

        const initialMap: Record<number, AttendanceStatus> = {};
        for (const student of filtered) {
          initialMap[student.id] = null;
        }
        setAttendanceMap(initialMap);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [open]);

  const toggleAttendance = (id: number, status: 'present' | 'absent') => {
    setAttendanceMap(prev => ({
      ...prev,
      [id]: prev[id] === status ? null : status,
    }));
  };

  const hasMarked = useMemo(() => Object.values(attendanceMap).some(v => v !== null), [attendanceMap]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return studentList;
    const lower = searchTerm.toLowerCase();
    return studentList.filter(student =>
      student.name.toLowerCase().includes(lower) ||
      student.email.toLowerCase().includes(lower)
    );
  }, [searchTerm, studentList]);

  const handleSubmit = () => {
    const now = dayjs().toISOString();
    for (const student of studentList) {
      const attendanceStatus = attendanceMap[student.id];
      if (!attendanceStatus) continue;
      onSave({
        userId: student.id,
        class: 'English',
        method: 'manual',
        status: attendanceStatus,
        date: now,
        time: now,
      });
    }
    onClose();
  };

  const StudentRow = ({ student }: { student: Student }) => {
    const status = attendanceMap[student.id];
    const isPresent = status === 'present';
    const isAbsent = status === 'absent';

    return (
      <Box className={`${styles.studentRow} ${isPresent ? styles.present : isAbsent ? styles.absent : ''}`}>
        <Box className={styles.studentInfo}>
          <Box className={styles.avatar}>
            <User size={20} weight="fill" />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>{student.name}</Typography>
            <Box className={styles.email}>
              <Envelope size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="text.secondary">{student.email}</Typography>
            </Box>
          </Box>
        </Box>

        <Box className={styles.actionButtons}>
          <Tooltip title="Hadir" arrow>
            <IconButton
              onClick={() => toggleAttendance(student.id, 'present')}
              className={isPresent ? styles.btnPresentActive : styles.btnInactive}
            >
              <CheckCircle size={24} weight={isPresent ? 'fill' : 'regular'} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Tidak Hadir" arrow>
            <IconButton
              onClick={() => toggleAttendance(student.id, 'absent')}
              className={isAbsent ? styles.btnAbsentActive : styles.btnInactive}
            >
              <XCircle size={24} weight={isAbsent ? 'fill' : 'regular'} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <Typography variant="h6" component="div" fontWeight={600}>Tambah Kehadiran Siswa - English</Typography>
        <IconButton onClick={onClose} className={styles.closeBtn}>
          <X size={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent className={styles.dialogContent}>
        <Box className={styles.descriptionBox}>
          <Typography variant="body2" color="text.secondary">
            Pilih status kehadiran untuk setiap siswa. Centang ikon untuk Hadir atau Tidak Hadir.
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Cari siswa berdasarkan nama atau email"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        {isLoading ? (
          <Box className={styles.centerBox}>
            <Typography variant="body1" color="text.secondary">Memuat data siswa...</Typography>
          </Box>
        ) : filteredStudents.length === 0 ? (
          <Box className={styles.centerBox}>
            <Typography variant="body1" color="text.secondary">Tidak ada siswa ditemukan</Typography>
          </Box>
        ) : (
          <Box className={styles.studentList}>
            {filteredStudents.map((student: Student) => (
              <StudentRow key={student.id} student={student} />
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions className={styles.dialogActions}>
        <Button onClick={onClose} variant="outlined" startIcon={<X size={20} />} className={styles.cancelBtn}>
          Batal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<FloppyDiskBack size={20} weight="fill" />}
          disabled={!hasMarked}
          className={styles.saveBtn}
        >
          Simpan Kehadiran
        </Button>
      </DialogActions>
    </Dialog>
  );
}
