'use client';
import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Typography, Box, IconButton,
  Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Divider, Avatar, Stack
} from '@mui/material';
import { PenIcon, TrashIcon } from '@phosphor-icons/react';


interface Grade {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  subject: {
    id: number;
    name: string;
  };
  teacher: {
    id: number;
    name: string;
  };
  semester: string;
  score: number;
  remarks?: string | null;
}

interface GradeModalProps {
  open: boolean;
  onClose: () => void;
  student: { name: string; email: string };
  grades: Grade[];
  onAdd: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const GradeModal: React.FC<GradeModalProps> = ({ open, onClose, student, grades, onAdd, onEdit, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Detail Nilai Siswa</DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <Typography variant="subtitle1"><strong>Nama:</strong> {student.name}</Typography>
          <Typography variant="subtitle1"><strong>Email:</strong> {student.email}</Typography>
        </Box>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" color="primary" onClick={onAdd}>Tambah Nilai</Button>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '1000px' }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nama Siswa</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mata Pelajaran</TableCell>
                <TableCell>Guru</TableCell>
                <TableCell>Semester</TableCell>
                <TableCell>Nilai</TableCell>
                <TableCell>Catatan</TableCell>
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={row.user.avatar || undefined} />
                      <Typography variant="subtitle2">{row.user.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.user.email}</TableCell>
                  <TableCell>{row.subject.name}</TableCell>
                  <TableCell>{row.teacher.name}</TableCell>
                  <TableCell>{row.semester}</TableCell>
                  <TableCell>{row.score.toFixed(2)}</TableCell>
                  <TableCell>
                    {row.remarks ? (
                      <Typography noWrap title={row.remarks}>{row.remarks}</Typography>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => onEdit(row.id)}>
                      <PenIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(row.id)}>
                      <TrashIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Tutup</Button>
      </DialogActions>
    </Dialog>
  );
};
