'use client'
import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';
import QRScannerHtml5 from '@/components/dashboard/attendances/QRscanner';
import { config } from '@/config';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AttendancesFilters } from '@/components/dashboard/attendances/attendance-filters';
import { AttendancesTable } from '@/components/dashboard/attendances/attendance-table';
import type { Attendance } from '@/components/dashboard/attendances/attendance-table';

const attendances: Attendance[] = [
  
];

export default function Page(): React.JSX.Element {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const page = 0;
  const rowsPerPage = 5;

  const paginatedAttendances = applyPagination(attendances, page, rowsPerPage);

  const handleQRScan = (data: string) => {
    setScanResult(data);
    setScannerOpen(false);
    setResultModalOpen(true);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">STUDENT ATTENDANCE</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
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
        rows={paginatedAttendances}
        rowsPerPage={rowsPerPage}
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
    </Stack>
  );
}

function applyPagination(rows: Attendance[], page: number, rowsPerPage: number): Attendance[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
