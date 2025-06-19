import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { AttendancesFilters } from '@/components/dashboard/attendances/attendance-filters';
import { AttendancesTable } from '@/components/dashboard/attendances/attendance-table';
import type { Attendance } from '@/components/dashboard/attendances/attendance-table';

export const metadata = { title: `attendance | Dashboard | ${config.site.name}` } satisfies Metadata;

const attendances = [
  {
    id: 1,
    name: 'Alcides Antonio',
    avatar: '/assets/avatar-10.png',
    email: 'alcides.antonio@devias.io',
    className: 'Kelas A',
    date: dayjs().toDate(),
    time: dayjs().toDate(),
    method: 'Offline',
    status: 'Hadir',
  },
  {
    id: 2,
    name: 'Marcus Finn',
    avatar: '/assets/avatar-9.png',
    email: 'marcus.finn@devias.io',
    className: 'Kelas B',
    date: dayjs().toDate(),
    time: dayjs().add(1, 'hour').toDate(),
    method: 'Online',
    status: 'Izin',
  },
  {
    id: 3,
    name: 'Jie Yan',
    avatar: '/assets/avatar-8.png',
    email: 'jie.yan.song@devias.io',
    className: 'Kelas C',
    date: dayjs().toDate(),
    time: dayjs().add(2, 'hour').toDate(),
    method: 'Offline',
    status: 'Sakit',
  },
  {
    id: 4,
    name: 'Nasimiyu Danai',
    avatar: '/assets/avatar-7.png',
    email: 'nasimiyu.danai@devias.io',
    className: 'Kelas A',
    date: dayjs().toDate(),
    time: dayjs().add(3, 'hour').toDate(),
    method: 'Online',
    status: 'Hadir',
  },
] satisfies Attendance[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedattendances = applyPagination(attendances, page, rowsPerPage);

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
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            SCAN QR
          </Button>
        </Stack>

      </Stack>
      <AttendancesFilters />
      <AttendancesTable
        count={paginatedattendances.length}
        page={page}
        rows={paginatedattendances}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Attendance[], page: number, rowsPerPage: number): Attendance[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
