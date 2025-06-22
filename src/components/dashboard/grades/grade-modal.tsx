'use client';
import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, IconButton, Button,
  Table, TableHead, TableRow, TableCell, TableBody,
  Avatar, Stack, Divider, TablePagination,
} from '@mui/material';
import { PenIcon, TrashIcon } from '@phosphor-icons/react';
import API from '@/lib/axioClient';
import { GradeAddModal } from './add-modal';
import { GradeEditModal } from './edit-modal';

interface Grade {
  id: number;
  user: { id: number; name: string; email: string; avatar?: string };
  subject: { id: number; name: string };
  teacher: { id: number; user: { id: number; name: string } };
  semester: string;
  score: number;
  remarks?: string | null;
}

interface GradeModalProps {
  open: boolean;
  onClose: () => void;
  student: { id: number; name: string; email: string };
  onAdd: (data: any) => Promise<void>;
  onEdit: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const GradeModal: React.FC<GradeModalProps> = ({
  open, onClose, student, onAdd, onEdit, onDelete,
}) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const fetchGrades = async () => {
    try {
      const res = await API.get(`/grades/user/${student.id}`, {
        params: { page: page + 1, limit }
      });
      setGrades(res.data.data);
      setTotalCount(res.data.meta?.total || 0);
    } catch (error) {
      console.error('Failed to fetch grades:', error);
    }
  };

  useEffect(() => {
    if (open) fetchGrades();
  }, [open, page, limit]);

  const handleEdit = (grade: Grade) => {
    setSelectedGrade(grade);
    setEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    await onDelete(id);
    fetchGrades();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600, fontSize: '1.4rem' }}>
          Student Grade Details
        </DialogTitle>

        <DialogContent>
          <Box display="flex" alignItems="center" gap={2} p={2.5} mb={2} sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: 1 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
              {student.name[0]}
            </Avatar>
            <Box>
              <Typography fontWeight={600}>{student.name}</Typography>
              <Typography variant="body2" color="text.secondary">{student.email}</Typography>
            </Box>
          </Box>

          <Box mb={2} textAlign="right">
            <Button variant="contained" onClick={() => setAddOpen(true)}>Tambah Nilai</Button>
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {['ID', 'Nama', 'Email', 'Mapel', 'Guru', 'Semester', 'Nilai', 'Catatan', 'Aksi'].map((head) => (
                    <TableCell key={head}>{head}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.length ? grades.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>{g.id}</TableCell>
                    <TableCell>{g.user.name}</TableCell>
                    <TableCell>{g.user.email}</TableCell>
                    <TableCell>{g.subject.name}</TableCell>
                    <TableCell>{g.teacher.user.name}</TableCell>
                    <TableCell>{g.semester}</TableCell>
                    <TableCell>{g.score.toFixed(2)}</TableCell>
                    <TableCell>{g.remarks || '-'}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleEdit(g)}><PenIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(g.id)}><TrashIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography color="text.secondary">Belum ada data nilai.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>

          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            rowsPerPage={limit}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Tutup</Button>
        </DialogActions>
      </Dialog>

      <GradeAddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={async (data) => {
          await onAdd(data);
          setAddOpen(false);
          fetchGrades();
        }}
        studentId={student.id}
      />

      <GradeEditModal
        open={editOpen}
        data={selectedGrade}
        onClose={() => {
          setEditOpen(false);
          setSelectedGrade(null);
        }}
        onSave={async (data) => {
          if (!selectedGrade) return;
          await onEdit(selectedGrade.id, data);
          setEditOpen(false);
          setSelectedGrade(null);
          fetchGrades();
        }}
      />
    </>
  );
};
