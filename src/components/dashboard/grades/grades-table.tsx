'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { PenIcon, TrashIcon } from '@phosphor-icons/react';
import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

// Tipe data baru sesuai skema Grade
export interface Grade {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  subject: {
    id: number;
    name: string;
  };
  teacher: {
    id: number;
    name: string;
  };
  semester: string;
  score: number;
  remarks?: string | null;
}

interface GradesTableProps {
  count?: number;
  page?: number;
  rows?: Grade[];
  rowsPerPage?: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function GradesTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onEdit,
  onDelete,
}: GradesTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => rows.map((g) => g.id.toString()), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = selected.size > 0 && selected.size < rows.length;
  const selectedAll = rows.length > 0 && selected.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '1000px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(e) => (e.target.checked ? selectAll() : deselectAll())}
                />
              </TableCell>
              <TableCell>Nama Siswa</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mata Pelajaran</TableCell>
              <TableCell>Guru</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Nilai</TableCell>
              <TableCell>Catatan</TableCell>
              <TableCell align="center">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected.has(row.id.toString());
              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => (e.target.checked ? selectOne(row.id.toString()) : deselectOne(row.id.toString()))}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={row.user.avatar || undefined} />
                      <Typography variant="subtitle2">{row.user.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.user.email}</TableCell>
                  <TableCell>{row.subject.name}</TableCell>
                  <TableCell>{row.teacher.name}</TableCell>
                  <TableCell>{row.semester}</TableCell>
                  <TableCell>{row.score}</TableCell>
                  <TableCell>{row.remarks || '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => onEdit?.(row.id)}>
                      <PenIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete?.(row.id)}>
                      <TrashIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
