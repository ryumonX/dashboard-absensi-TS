'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import API from '@/lib/axioClient';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import * as XLSX from 'xlsx';

import QRScannerHtml5 from '@/components/dashboard/attendances/QRscanner';
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
  className: string;
  date: string | Date;
  time: string;
  method: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
}

export default function Page(): React.JSX.Element {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [totalRows, setTotalRows] = useState(0); // Tambahkan ini


  const fetchAttendances = async (page: number = 1, limit: number = 5) => {
  setLoading(true);
  try {
    const res = await API.get('/attendances', {
      params: {
        page,
        limit,
      },
    });

    setAttendances(res.data.data);
    setTotalRows(res.data.meta.total); // ambil total dari backend
  } catch (err) {
    console.error('Failed to fetch attendances:', err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  fetchAttendances(page + 1, rowsPerPage);
}, [page, rowsPerPage]);


  const handleQRScan = async (data: string) => {
    try {
      const res = await API.post('/attendances/scan', { qrcode: data });
      setScanResult(`✅ Berhasil: ${res.data.message || 'Data ditambahkan.'}`);
      fetchAttendances();
    } catch (err: any) {
      console.error(err);
      setScanResult(`❌ Gagal: ${err.response?.data?.message || 'Terjadi kesalahan.'}`);
    } finally {
      setScannerOpen(false);
      setResultModalOpen(true);
    }
  };

  const handleEdit = async (id: number, updatedData: Partial<Attendance>) => {
    try {
      await API.put(`/attendances/${id}`, updatedData);
      fetchAttendances();
    } catch (err) {
      console.error('Gagal edit:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/attendances/${id}`);
      fetchAttendances();
    } catch (err) {
      console.error('Gagal hapus:', err);
    }
  };

  const openEditModal = (id: number) => {
    const found = attendances.find((a) => a.id === id);
    if (found) {
      setSelectedAttendance(found);
      setEditModalOpen(true);
    }
  };

  const handleExportAll = () => {
    const data = attendances.map(formatAttendance);
    exportToSpreadsheet(data, 'all_attendance.xlsx');
  };

  const handleExportToday = () => {
    const today = new Date().toISOString().split('T')[0];
    const data = attendances
      .filter((a) => a.date.toString().startsWith(today))
      .map(formatAttendance);
    exportToSpreadsheet(data, `attendance_today_${today}.xlsx`);
  };

  const handleExportByStatus = (status: string) => {
    const data = attendances
      .filter((a) => a.status === status)
      .map(formatAttendance);
    exportToSpreadsheet(data, `attendance_${status}.xlsx`);
  };

  const formatAttendance = (a: Attendance) => ({
    Name: a.user?.name || a.name,
    Email: a.user?.email || a.email,
    Class: a.className,
    Date: new Date(a.date).toLocaleDateString(),
    Time: new Date(a.time).toLocaleTimeString(),
    Method: a.method,
    Status: a.status,
  });

  const exportToSpreadsheet = (data: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendances');
    XLSX.writeFile(workbook, fileName);
  };

  const paginatedAttendances = applyPagination(attendances, page, rowsPerPage);

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
        count={attendances.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rows={paginatedAttendances}
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
          } catch (err) {
            console.error('Gagal tambah data:', err);
          }
        }}
      />

      <AttendanceEditModal
        open={editModalOpen}
        data={selectedAttendance}
        onClose={() => setEditModalOpen(false)}
        onSave={async (updatedData) => {
          if (selectedAttendance) {
            await handleEdit(selectedAttendance.id, updatedData as any);
            setEditModalOpen(false);
          }
        }}
      />
    </Stack>
  );
}

function applyPagination(rows: Attendance[], page: number, rowsPerPage: number): Attendance[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
