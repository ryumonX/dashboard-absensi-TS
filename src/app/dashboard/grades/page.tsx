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
import { GradesFilters } from '@/components/dashboard/grades/grades-filters';
import { GradesTable } from '@/components/dashboard/grades/grades-table';
import type { Grade } from '@/components/dashboard/grades/grades-table';

export const metadata = { title: `grades | Dashboard | ${config.site.name}` } satisfies Metadata;

const grades = [
   {
    id: 1,
    user: {
      id: 101,
      name: 'Andi Saputra',
      email: 'andi@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    subject: {
      id: 201,
      name: 'Matematika',
    },
    teacher: {
      id: 301,
      name: 'Bu Rina',
    },
    semester: 'Ganjil 2024',
    score: 88.5,
    remarks: 'Sangat baik',
  },
  {
    id: 2,
    user: {
      id: 102,
      name: 'Siti Nurhaliza',
      email: 'siti@example.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    subject: {
      id: 202,
      name: 'Bahasa Indonesia',
    },
    teacher: {
      id: 302,
      name: 'Pak Budi',
    },
    semester: 'Ganjil 2024',
    score: 91.0,
    remarks: null,
  },
  {
    id: 3,
    user: {
      id: 103,
      name: 'Doni Pratama',
      email: 'doni@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    subject: {
      id: 203,
      name: 'Fisika',
    },
    teacher: {
      id: 303,
      name: 'Bu Sari',
    },
    semester: 'Ganjil 2024',
    score: 75.25,
    remarks: 'Perlu peningkatan',
  },
] satisfies Grade[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedgrades = applyPagination(grades, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">STUDENT GRADE</Typography>
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
        </Stack>

      </Stack>
      <GradesFilters />
      <GradesTable
        count={paginatedgrades.length}
        page={page}
        rows={paginatedgrades}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Grade[], page: number, rowsPerPage: number): Grade[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
