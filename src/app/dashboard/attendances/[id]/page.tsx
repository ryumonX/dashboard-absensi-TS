'use client';

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Stack,
  Box,
  CircularProgress,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import API from '@/lib/axioClient';
import dayjs from 'dayjs';
import { FunnelSimple, ArrowLeft } from '@phosphor-icons/react';
import { AttendanceHistoryTable } from '@/components/dashboard/students/attendancehistory';

interface Attendance {
  id: number;
  date: string;
  time: string;
  method: string;
  status: string;
}

export default function AttendanceHistoryPage() {
  const params = useParams();
  const userId = parseInt(params.id as string);
  const router = useRouter();

  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    API.get(`/attendances/history/${userId}`)
      .then((res) => {
        setAttendances(res.data.attendance);
        setUser(res.data.user);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const filterAttendances = () => {
    return attendances.filter((a) => {
      const date = dayjs(a.date);
      const matchDate = selectedDate ? dayjs(selectedDate).isSame(date, 'day') : true;
      const matchDay = selectedDay ? date.format('dddd').toLowerCase() === selectedDay.toLowerCase() : true;
      return matchDate && matchDay;
    });
  };

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h5" fontWeight={600}>
          Attendance History
        </Typography>
        {user && (
          <Typography variant="subtitle1" color="text.secondary">
            {user.name} • {user.email}
          </Typography>
        )}
      </Box>

      {/* Filter + Back */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        {/* Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flex={1}>
          <TextField
            label="Filter by Date"
            type="date"
            variant="outlined"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FunnelSimple size={18} />
                </InputAdornment>
              ),
            }}
            fullWidth
            sx={{
              borderRadius: 2,
              backgroundColor: 'white',
            }}
          />
          <TextField
            label="Filter by Day"
            select
            variant="outlined"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FunnelSimple size={18} />
                </InputAdornment>
              ),
            }}
            fullWidth
            sx={{
              borderRadius: 2,
              backgroundColor: 'white',
            }}
          >
            <MenuItem value="">All Days</MenuItem>
            {daysOfWeek.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {/* Back Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/dashboard/students')}
          startIcon={<ArrowLeft />}
          sx={{
            height: 40,
            minWidth: 100,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            mt: { xs: 2, sm: 0 },
          }}
        >
          Back
        </Button>
      </Stack>

      {/* Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <AttendanceHistoryTable
          rows={filterAttendances().slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )}
          count={filterAttendances().length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      )}
    </Stack>
  );
}
