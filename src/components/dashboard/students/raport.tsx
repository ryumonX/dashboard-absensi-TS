'use client';
import React, { useEffect, useState } from 'react';
import API from '@/lib/axio-client';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Typography, CircularProgress, Paper, TablePagination,
  Box, Divider, Button, Stack
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { DownloadSimple, ArrowLeft } from 'phosphor-react';

// Define interface for grade data
interface Grade {
  id: number;
  subject: {
    name: string;
  };
  teacher?: {
    user?: {
      name: string;
    };
  };
  semester: string;
  score: number;
  remarks: string;
}

// Move handlePrint to outer scope
const handlePrint = () => {
  globalThis.print();
};

export default function RaportPage({ userId }: { userId: number }) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    API.get(`/grades/user/${userId}?page=${page + 1}&limit=${limit}`)
      .then((res) => {
        setGrades(res.data.data);
        setTotal(res.data.meta.total);
      })
      .finally(() => setLoading(false));
  }, [userId, page, limit]);

  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        maxWidth: 1100,
        mx: 'auto',
        mt: 6,
        borderRadius: 4,
        backgroundColor: '#ffffff',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        '@media print': {
          boxShadow: 'none',
          border: 'none',
          maxWidth: '100%',
          p: 2,
        },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={3}
        gap={2}
        sx={{
          '@media print': {
            display: 'none',
          },
        }}
      >
        <Typography variant="h5" fontWeight={700} color="primary.dark">
          📘 Student Report Card
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.push('/dashboard/students')}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadSimple size={18} />}
            onClick={handlePrint}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Print / PDF
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Print-only Title Section */}
      <Box
        textAlign="center"
        sx={{
          display: 'none',
          '@media print': {
            display: 'block',
            mb: 3,
          },
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          STUDENT REPORT CARD
        </Typography>
        <Typography variant="body2">DELTA ABADI INTERNASIONAL</Typography>
        <Divider sx={{ mt: 1, mb: 3 }} />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f0f4f8' }}>
                  {['Subject', 'Teacher', 'Semester', 'Score', 'Remarks'].map((text, idx) => (
                    <TableCell key={idx} sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {text}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.length > 0 ? (
                  grades.map((g: Grade, index: number) => (
                    <TableRow
                      key={g.id}
                      hover
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff',
                        transition: 'background-color 0.3s',
                        '&:hover': {
                          backgroundColor: '#e3f2fd',
                        },
                        '@media print': {
                          backgroundColor: 'transparent !important',
                        },
                      }}
                    >
                      <TableCell>{g.subject.name}</TableCell>
                      <TableCell>{g.teacher?.user?.name || '-'}</TableCell>
                      <TableCell>{g.semester}</TableCell>
                      <TableCell>{g.score}</TableCell>
                      <TableCell>{g.remarks}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No grades available.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>

          <Box
            display="flex"
            justifyContent="flex-end"
            mt={2}
            sx={{ '@media print': { display: 'none' } }}
          >
            <TablePagination
              component="div"
              count={total}
              page={page}
              rowsPerPage={limit}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setLimit(Number.parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 20]}
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
    </Paper>
  );
}
