'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Button, Stack, CircularProgress
} from '@mui/material';
import API from '@/lib/axio-client';

interface GradeFormData {
  userId: number;
  subjectId: number;
  teacherId: number;
  semester: string;
  score: number;
  remarks?: string;
}

interface Subject {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  user: {
    id: number;
    name: string;
  };
  subjects: Subject[];
}

interface GradeAddModalProps {
  open: boolean;
  onClose: () => void;
  studentId: number;
  onSave: (data: GradeFormData) => Promise<void>;
}

export const GradeAddModal: React.FC<GradeAddModalProps> = ({
  open,
  onClose,
  studentId,
  onSave,
}) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<GradeFormData>({
    userId: studentId,
    subjectId: 0,
    teacherId: 0,
    semester: '',
    score: 0,
    remarks: '',
  });

  useEffect(() => {
    if (open) {
      setForm({
        userId: studentId,
        subjectId: 0,
        teacherId: 0,
        semester: '',
        score: 0,
        remarks: '',
      });

      setLoadingData(true);
      Promise.all([
        API.get('/subjects'),
        API.get('/teachers'),
      ])
        .then(([subjectRes, teacherRes]) => {
          console.log('Subjects:', subjectRes.data);
          console.log('Teachers:', teacherRes.data);

          // Cek apakah API sudah mengembalikan array langsung
          setSubjects(Array.isArray(subjectRes.data.data) ? subjectRes.data.data : subjectRes.data);
          setTeachers(Array.isArray(teacherRes.data.data) ? teacherRes.data.data : teacherRes.data);
        })
        .finally(() => setLoadingData(false));
    }
  }, [open, studentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'score' ? Number.parseFloat(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const { subjectId, teacherId, semester, score } = form;
    if (!subjectId || !teacherId || !semester || Number.isNaN(score)) {
      alert('Semua field wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      await onSave(form);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan nilai.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Tambah Nilai Siswa</DialogTitle>

      <DialogContent dividers>
        {loadingData ? (
          <Stack alignItems="center" py={3}>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack spacing={2} mt={1}>
            <TextField
              select
              fullWidth
              label="Mata Pelajaran"
              name="subjectId"
              value={form.subjectId}
              onChange={handleChange}
            >
              {subjects.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Guru"
              name="teacherId"
              value={form.teacherId}
              onChange={handleChange}
            >
              {teachers.length === 0 && (
                <MenuItem disabled value={0}>Tidak ada guru tersedia</MenuItem>
              )}
              {teachers.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.user?.name ?? 'Tanpa Nama'} - [
                  {(t.subjects ?? []).map((s) => s.name).join(', ')}]
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Semester"
              name="semester"
              value={form.semester}
              onChange={handleChange}
              placeholder="Contoh: Genap 2024"
            />

            <TextField
              fullWidth
              label="Nilai"
              name="score"
              type="number"
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              value={form.score}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Catatan (opsional)"
              name="remarks"
              multiline
              rows={2}
              value={form.remarks}
              onChange={handleChange}
            />
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Batal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || loadingData}
          startIcon={submitting ? <CircularProgress size={20} /> : null}
        >
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};
