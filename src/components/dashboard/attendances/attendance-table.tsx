'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Chip } from '@mui/material';
import dayjs from 'dayjs';
import { PenIcon, TrashIcon } from '@phosphor-icons/react';

import { useSelection } from '@/hooks/use-selection';

export interface Attendance {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  className: string;
  date: Date;
  time: Date;
  method: string;
  status: string;
}

interface AttendancesTableProps {
  count?: number;
  page?: number;
  rows?: Attendance[];
  rowsPerPage?: number;
}

export function AttendancesTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 10,
}: AttendancesTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((attendance) => attendance.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const [currentPage, setCurrentPage] = React.useState(page);
  const [currentRowsPerPage, setCurrentRowsPerPage] = React.useState(rowsPerPage);

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
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={row.avatar || ''} alt={row.name} />
                    <Typography variant="subtitle2">{row.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.className}</TableCell>
                <TableCell>{dayjs(row.date).format('DD MMM YYYY')}</TableCell>
                <TableCell>{dayjs(row.time).format('HH:mm')}</TableCell>
                <TableCell>{row.method}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    color={
                      row.status === 'Hadir'
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
                      console.log('Edit', row.id);
                    }}
                  >
                    <PenIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Delete', row.id);
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
        page={currentPage}
        rowsPerPage={currentRowsPerPage}
        onPageChange={(event, newPage) => setCurrentPage(newPage)}
        onRowsPerPageChange={(event) => {
          setCurrentRowsPerPage(parseInt(event.target.value, 10));
          setCurrentPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
