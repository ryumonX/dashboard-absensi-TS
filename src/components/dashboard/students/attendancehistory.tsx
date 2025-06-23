'use client';
import React, { useEffect, useState } from 'react';
import API from '@/lib/axioClient';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Typography, CircularProgress, Paper, Box, Button,
  Divider, Stack, Chip
} from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

interface Attendance {
  id: number;
  date: string;
  time: string;
  method: string;
  status: string;
}

export default function AttendanceHistoryPage({ userId }: { userId: number }) {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    API.get(`/attendances/history/${userId}`)
      .then((res) => {
        setAttendances(res.data.attendance);
        setUser(res.data.user);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      case 'excused':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: 1100,
        mx: 'auto',
        mt: 6,
        borderRadius: 3,
        backgroundColor: '#ffffff',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Attendance History
          </Typography>
          {user && (
            <Typography variant="subtitle1" color="text.secondary">
              {user.name} &bull; {user.email}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/dashboard/students')}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
        >
          Back
        </Button>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendances.length > 0 ? (
                attendances.map((a) => (
                  <TableRow key={a.id} hover sx={{ transition: 'all 0.2s', '&:hover': { backgroundColor: '#f0f4ff' } }}>
                    <TableCell>{dayjs(a.date).format('DD MMM YYYY')}</TableCell>
                    <TableCell>{dayjs(a.time).format('HH:mm')}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{a.method}</TableCell>
                    <TableCell>
                      <Chip
                        label={a.status}
                        color={getStatusColor(a.status)}
                        variant="filled"
                        size="small"
                        sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No attendance records available.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}
    </Paper>
  );
}
