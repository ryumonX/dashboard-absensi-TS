'use client';
import * as React from 'react';
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
    user: { id: number; name: string };
  };
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
  open,
  onClose,
  student,
  onAdd,
  onEdit,
  onDelete
}) => {
  const [grades, setGrades] = React.useState<Grade[]>([]);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0);
  const [limit, setLimit] = React.useState<number>(5);


  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedGrade, setSelectedGrade] = React.useState<Grade | null>(null);

  const fetchGrades = async () => {
    try {
      const params: any = { page: page + 1 };
      if (limit > 0) {
        params.limit = limit;
      }

      const res = await API.get(`/grades/user/${student.id}`, { params });

      setGrades(res.data.data);
      console.log(res.data.total);
      setTotalCount(res.data.meta?.total);
    } catch (err) {
      console.error('Gagal fetch grades:', err);

    }
  };


  React.useEffect(() => {
    if (open) fetchGrades();
  }, [open, page, limit]);

  const handleDelete = async (id: number) => {
    await onDelete(id);
    fetchGrades();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            bgcolor: 'primary.main',
            color: 'white',
            py: 2,
            px: 3,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          Student Grade Details
        </DialogTitle>

        <DialogContent>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            p={2.5}
            sx={{
              backgroundColor: 'white',
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              mb: 3,
            }}
          >
            <Avatar
              alt={student.name}
              src={undefined}
              sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontWeight: 600, fontSize: '1.2rem' }}
            >
              {student.name[0]}
            </Avatar>

            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                Student Information
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                {student.name}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {student.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box display="flex" justifyContent="flex-end" mb={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setAddOpen(true)}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
              }}
            >
              Tambah Nilai
            </Button>
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: '1000px' }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nama</TableCell>
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
                {grades.length > 0 ? (
                  grades.map((row, index) => (
                    <TableRow
                      hover
                      key={row.id}
                      sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#fafafa' }}
                    >
                      <TableCell>{row.id}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle2">{row.user.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{row.user.email}</TableCell>
                      <TableCell>{row.subject.name}</TableCell>
                      <TableCell>{row.teacher?.user?.name || '-'}</TableCell>
                      <TableCell>{row.semester}</TableCell>
                      <TableCell>{row.score.toFixed(2)}</TableCell>
                      <TableCell>{row.remarks || '-'}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedGrade(row);
                            setEditOpen(true);
                          }}
                        >
                          <PenIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(row.id)}
                        >
                          <TrashIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      <Typography variant="body1" fontWeight={500}>
                        There is no grade here yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>

          <Box mt={2}>
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              rowsPerPage={limit}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setLimit(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
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
          if (selectedGrade) {
            await onEdit(selectedGrade.id, data);
            setEditOpen(false);
            setSelectedGrade(null);
            fetchGrades();
          }
        }}
      />
    </>
  );
};
