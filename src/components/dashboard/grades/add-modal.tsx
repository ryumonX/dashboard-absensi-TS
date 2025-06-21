'use client';
import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, CircularProgress, Box, Paper, Typography, Divider, Grid
} from '@mui/material';
import API from '@/lib/axioClient';

interface GradeAddModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any[]) => void;
}

export const GradeAddModal: React.FC<GradeAddModalProps> = ({ open, onClose, onSave }) => {
  const [form, setForm] = React.useState({
    userId: '',
    teacherId: '',
    semester: '',
    remarks: {} as Record<number, string>,
    scores: {} as Record<number, string>
  });

  const [subjects, setSubjects] = React.useState<{ id: number; name: string }[]>([]);
  const [students, setStudents] = React.useState<{ id: number; name: string }[]>([]);
  const [teachers, setTeachers] = React.useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subjectRes, userRes] = await Promise.all([
        API.get('/subjects'),
        API.get('/user')
      ]);
      const subjectData = subjectRes.data;
      const userData = userRes.data;

      setSubjects(subjectData);
      setStudents(userData.filter((u: any) => u.role === 'student'));
      setTeachers(userData.filter((u: any) => u.role === 'teacher'));
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
    const gradeData = subjects
      .filter(subject => form.scores[subject.id])
      .map(subject => ({
        userId: Number(form.userId),
        subjectId: subject.id,
        teacherId: Number(form.teacherId),
        semester: form.semester,
        score: Number(form.scores[subject.id]),
        remarks: form.remarks[subject.id] || null
      }));

    onSave(gradeData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Bulk Grades</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              select
              fullWidth
              margin="normal"
              name="userId"
              label="Student"
              value={form.userId}
              onChange={handleChange}
            >
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              margin="normal"
              name="teacherId"
              label="Teacher"
              value={form.teacherId}
              onChange={handleChange}
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </MenuItem>
              ))}
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
