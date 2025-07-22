'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from '@mui/material';
import { PenIcon, TrashIcon } from '@phosphor-icons/react';
import API from '@/lib/axio-client';
import { GradeAddModal } from '@/components/dashboard/grades/add-modal';
import { GradeEditModal } from '@/components/dashboard/grades/edit-modal';

interface Grade {
  id: number;
  user: { id: number; name: string; email: string; avatar?: string };
  subject: { id: number; name: string };
  teacher: { id: number; user: { id: number; name: string } };
  semester: string;
  score: number;
  remarks?: string | null;
}

interface GradeFormData {
  userId: number;
  subjectId: number;
  teacherId: number;
  semester: string;
  score: number;
  remarks?: string;
}

interface GradeModalProps {
  open: boolean;
  onClose: () => void;
  student: { id: number; name: string; email: string };
  onAdd: (data: GradeFormData) => Promise<void>;
  onEdit: (id: number, data: GradeFormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const GradeModal: React.FC<GradeModalProps> = ({
  open,
  onClose,
  student,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const fetchGrades = useCallback(async () => {
    try {
      const res = await API.get(`/grades/user/${student.id}`, {
        params: { page: page + 1, limit },
      });
      setGrades(res.data.data);
      setTotalCount(res.data.meta?.total ?? 0);
    } catch (error) {
      console.error('Fetch grades failed', error);
    }
  }, [student.id, page, limit]);

  useEffect(() => {
    if (open) {
      fetchGrades();
    }
  }, [open, fetchGrades]);



  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>Student Grade Details</DialogTitle>
        <DialogContent>
          <Box textAlign="right" mb={2}>
            <Button variant="contained" onClick={() => setAddOpen(true)}>
              Tambah Nilai
            </Button>
          </Box>

          <Box overflow="auto">
            <Table>
              <TableHead>
                <TableRow>
                  {['Nama', 'Email', 'Mapel', 'Guru', 'Semester', 'Nilai', 'Catatan', 'Aksi'].map(
                    (header) => (
                      <TableCell key={header}>{header}</TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.length > 0 ? (
                  grades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell>{grade.user.name}</TableCell>
                      <TableCell>{grade.user.email}</TableCell>
                      <TableCell>{grade.subject.name}</TableCell>
                      <TableCell>{grade.teacher.user.name}</TableCell>
                      <TableCell>{grade.semester}</TableCell>
                      <TableCell>{grade.score.toFixed(2)}</TableCell>
                      <TableCell>{grade.remarks || '-'}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setSelectedGrade(grade);
                            setEditOpen(true);
                          }}
                        >
                          <PenIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={async () => {
                            await onDelete(grade.id);
                            fetchGrades();
                          }}
                        >
                          <TrashIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Belum ada data nilai.
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
              setLimit(Number.parseInt(e.target.value, 10));
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
        studentId={student.id}
        onSave={async (data) => {
          await onAdd(data);
          setAddOpen(false);
          fetchGrades();
        }}
      />

      {selectedGrade && (
        <GradeEditModal
          open={editOpen}
          data={selectedGrade}
          onClose={() => {
            setEditOpen(false);
            setSelectedGrade(null);
          }}
          onSave={async (data) => {
            await onEdit(selectedGrade.id, data);
            setEditOpen(false);
            setSelectedGrade(null);
            fetchGrades();
          }}
        />
      )}
    </>
  );
};
