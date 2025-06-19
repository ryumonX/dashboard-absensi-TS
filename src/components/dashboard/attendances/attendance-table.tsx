'use client';

import * as React from 'react';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton,
  Chip
} from '@mui/material';
import { PenIcon, TrashIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { useSelection } from '@/hooks/use-selection';

export interface Attendance {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  className: string;
  date: Date | string;
  time: Date | string;
  method: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
}

interface AttendancesTableProps {
  count?: number;
  page?: number;
  rows?: Attendance[];
  rowsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function AttendancesTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete
}: AttendancesTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => rows.map((attendance) => attendance.id), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = selected.size > 0 && selected.size < rows.length;
  const selectedAll = rows.length > 0 && selected.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(e) => (e.target.checked ? selectAll() : deselectAll())}
                />
              </TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Kelas</TableCell>
              <TableCell>Tanggal</TableCell>
              <TableCell>Waktu</TableCell>
              <TableCell>Metode</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                selected={selected.has(row.id)}
                onClick={() =>
                  selected.has(row.id) ? deselectOne(row.id) : selectOne(row.id)
                }
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.has(row.id)} />
                </TableCell>
                <TableCell>{row.user.name}</TableCell>
                <TableCell>{row.user.email}</TableCell>
                <TableCell>{row.className}</TableCell>
                <TableCell>{dayjs(row.date).format('DD MMM YYYY')}</TableCell>
                <TableCell>{dayjs(row.time).format('HH:mm')}</TableCell>
                <TableCell>{row.method}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    color={
                      row.status === 'present'
                        ? 'success'
                        : row.status === 'Izin'
                          ? 'info'
                          : row.status === 'Sakit'
                            ? 'warning'
                            : 'error'
                    }
                  />
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 100 }}>
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(row.id);
                    }}
                  >
                    <PenIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(row.id);
                    }}
                  >
                    <TrashIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => onPageChange?.(newPage)}
        onRowsPerPageChange={(event) =>
          onRowsPerPageChange?.(parseInt(event.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
