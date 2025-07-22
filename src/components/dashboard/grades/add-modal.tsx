'use client';
import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, CircularProgress, Box,
  Paper, Typography, Divider
} from '@mui/material';
import API from '@/lib/axio-client';

interface GradeData {
  userId: number;
  subjectId: number;
  teacherId: number;
  semester: string;
  score: number;
  remarks?: string
}

interface GradeAddModalProps {
  open: boolean;
  onClose: () => void;
  studentId: number;
  onSave: (data: GradeData[]) => void;
}

type Teacher = {
  id: number;
  userId: number;
  user: { name: string };
};

export const GradeAddModal: React.FC<GradeAddModalProps> = ({
  open, onClose, onSave, studentId
}) => {
  const [form, setForm] = React.useState({
    teacher: null as Teacher | null,
    semester: '',
    remarks: {} as Record<number, string>,
    scores: {} as Record<number, string>
  });

  const [subjects, setSubjects] = React.useState<{ id: number; name: string }[]>([]);
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subjectRes, teacherRes] = await Promise.all([
        API.get('/subjects'),
        API.get('/teachers')
      ]);

      console.log('Fetched teachers:', teacherRes.data);
      setSubjects(subjectRes.data?.data || []);
      setTeachers(teacherRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) fetchData();
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleScoreChange = (subjectId: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      scores: { ...prev.scores, [subjectId]: value }
    }));
  };

  const handleRemarksChange = (subjectId: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      remarks: { ...prev.remarks, [subjectId]: value }
    }));
  };

  const handleSubmit = () => {
    const gradeData: GradeData[] = subjects
      .filter(subject => form.scores[subject.id])
      .map(subject => ({
        userId: studentId,
        subjectId: subject.id,
        teacherId: form.teacher?.id ?? 0,
        semester: form.semester,
        score: Number(form.scores[subject.id]),
        remarks: form.remarks[subject.id],
      }));

    if (gradeData.length === 0) {
      alert("Please enter at least one score before submitting.");
      return;
    }

    onSave(gradeData); // This must be an array
    onClose();
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Bulk Grades</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TextField
              select
              fullWidth
              margin="normal"
              label="Teacher"
              value={form.teacher ? form.teacher.id : ''}
              onChange={(e) => {
                const selected = teachers.find(t => t.id === Number(e.target.value));
                setForm((prev) => ({ ...prev, teacher: selected ?? null }));
              }}
            >
              {teachers.length === 0 ? (
                <MenuItem disabled>No teachers found</MenuItem>
              ) : (
                teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.user?.name || 'Unknown'}
                  </MenuItem>
                ))
              )}
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              name="semester"
              label="Semester"
              value={form.semester}
              onChange={handleChange}
            />

            <Typography variant="h6" mt={3} mb={1}>
              Input Scores by Subject
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, maxHeight: 400, overflowY: 'auto' }}>
              {subjects.map((subject, idx) => (
                <Box key={subject.id} mb={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight="bold">{subject.name}</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        type="number"
                        label="Score"
                        fullWidth
                        value={form.scores[subject.id] || ''}
                        onChange={(e) => handleScoreChange(subject.id, e.target.value)}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        label="Remarks"
                        fullWidth
                        value={form.remarks[subject.id] || ''}
                        onChange={(e) => handleRemarksChange(subject.id, e.target.value)}
                      />
                    </Box>
                  </Box>
                  {idx !== subjects.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </Paper>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          Save All
        </Button>
      </DialogActions>
    </Dialog>
  );
};
