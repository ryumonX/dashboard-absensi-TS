'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import API from '@/lib/axio-client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import * as XLSX from 'xlsx';

import QRScannerHtml5 from '@/components/dashboard/attendances/qr-scanner';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AttendancesFilters } from '@/components/dashboard/attendances/attendance-filters';
import { AttendancesTable } from '@/components/dashboard/attendances/attendance-table';
import { AttendanceAddModal } from '@/components/dashboard/attendances/add-modal';
import { AttendanceEditModal } from '@/components/dashboard/attendances/edit-modal';

export interface Attendance {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  class: string;
  date: string | Date;
  time: string;
  method: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
}

interface ExportedAttendance {
  Name: string;
  Email: string;
  Class: string;
  Date: string;
  Time: string;
  Method: string;
  Status: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const exportToSpreadsheet = (data: ExportedAttendance[], fileName: string): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendances');
  XLSX.writeFile(workbook, fileName);
};

const formatAttendance = (a: Attendance): ExportedAttendance => ({
  Name: a.user?.name || a.name,
  Email: a.user?.email || a.email,
  Class: a.class,
  Date: new Date(a.date).toLocaleDateString(),
  Time: new Date(a.time).toLocaleTimeString(),
  Method: a.method,
  Status: a.status,
});

export default function Page(): React.JSX.Element {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

  const fetchAttendances = async (page: number = 1, limit: number = 5): Promise<void> => {
    try {
      const res = await API.get('/attendances', {
        params: { page, limit },
      });

      setAttendances(res.data.data);
      setTotal(res.data.meta.total);
    } catch (error) {
      console.error('Failed to fetch attendances:', error);
    }
  };

  useEffect(() => {
    fetchAttendances(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleQRScan = async (data: string): Promise<void> => {
    try {
      const res = await API.post('/attendances/scan', { qrcode: data });
      setScanResult(`✅ Berhasil: ${res.data.message || 'Data ditambahkan.'}`);
      fetchAttendances();
    } catch (error) {
      const apiError = error as ApiError;
      console.error(error);
      setScanResult(`❌ Gagal: ${apiError.response?.data?.message || 'Terjadi kesalahan.'}`);
    } finally {
      setScannerOpen(false);
      setResultModalOpen(true);
    }
  };

  const handleEdit = async (id: number, updatedData: Partial<Attendance>): Promise<void> => {
    try {
      await API.put(`/attendances/${id}`, updatedData);
      fetchAttendances();
    } catch (error) {
      console.error('Gagal edit:', error);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await API.delete(`/attendances/${id}`);
      fetchAttendances();
    } catch (error) {
      console.error('Gagal hapus:', error);
    }
  };

  const openEditModal = (id: number): void => {
    const found = attendances.find((a) => a.id === id);
    if (found) {
      setSelectedAttendance(found);
      setEditModalOpen(true);
    }
  };

  const handleExportAll = async (): Promise<void> => {
    try {
      const res = await API.get('/attendances', {
        params: {
          page: 1,
          limit: 100_000,
        },
      });

      const allData = res.data.data;
      const formatted = allData.map((a: Attendance) => formatAttendance(a));
      exportToSpreadsheet(formatted, 'all_attendance.xlsx');
    } catch (error) {
      console.error('Gagal export semua:', error);
    }
  };

  const handleExportToday = (): void => {
    const today = new Date().toISOString().split('T')[0];
    const data = attendances
      .filter((a) => a.date.toString().startsWith(today))
      .map((a) => formatAttendance(a));
    exportToSpreadsheet(data, `attendance_today_${today}.xlsx`);
  };

  const handleExportByStatus = (status: string): void => {
    const data = attendances
      .filter((a) => a.status === status)
      .map((a) => formatAttendance(a));
    exportToSpreadsheet(data, `attendance_${status}.xlsx`);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">STUDENT ATTENDANCE</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button onClick={handleExportAll} color="inherit" startIcon={<DownloadIcon />}>
              Export All
            </Button>
            <Button onClick={handleExportToday} color="inherit" startIcon={<DownloadIcon />}>
              Export Today
            </Button>
            <Button onClick={() => handleExportByStatus('present')} color="inherit" startIcon={<DownloadIcon />}>
              Export Present
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => setAddModalOpen(true)}
          >
            Add
          </Button>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => setScannerOpen(true)}
          >
            SCAN QR
          </Button>
        </Stack>
      </Stack>

      <AttendancesFilters />

      <AttendancesTable
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        rows={attendances}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        onEdit={(id) => openEditModal(id)}
        onDelete={(id) => handleDelete(id)}
      />

      <QRScannerHtml5
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={handleQRScan}
      />

      <Dialog open={resultModalOpen} onClose={() => setResultModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Hasil Scan QR</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{scanResult}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResultModalOpen(false)} variant="contained" autoFocus>
            Tutup
          </Button>
        </DialogActions>
      </Dialog>

      <AttendanceAddModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={async (data) => {
          try {
            await API.post('/attendances', data);
            fetchAttendances();
          } catch (error) {
            console.error('Gagal tambah data:', error);
          }
        }}
      />

      <AttendanceEditModal
        open={editModalOpen}
        data={selectedAttendance}
        onClose={() => setEditModalOpen(false)}
        onSave={async (updatedData) => {
          if (selectedAttendance) {
            await handleEdit(selectedAttendance.id, updatedData as Partial<Attendance>);
            setEditModalOpen(false);
          }
        }}
      />
    </Stack>
  );
}
