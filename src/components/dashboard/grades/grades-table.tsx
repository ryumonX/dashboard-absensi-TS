'use client';

import * as React from 'react';
import {
  Box,
  Card,
  Checkbox,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton,
  Stack,
  Avatar,
  Button,
} from '@mui/material';
import { PenIcon, TrashIcon } from '@phosphor-icons/react';
import { useSelection } from '@/hooks/use-selection';

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
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onViewStudent?: (student: { id: number; name: string; email: string }) => void;
}

export function GradesTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 5,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
  onEdit,
  onDelete,
  onViewStudent
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
              <TableCell>ID</TableCell>
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
                      onChange={(e) =>
                        e.target.checked
                          ? selectOne(row.id.toString())
                          : deselectOne(row.id.toString())
                      }
                    />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
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
                  <TableCell>{row.score.toFixed(2)}</TableCell>
                  <TableCell>
                    {row.remarks ? (
                      <Typography noWrap title={row.remarks}>
                        {row.remarks}
                      </Typography>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        onClick={() =>
                          onViewStudent?.({
                            id: row.user.id,
                            name: row.user.name,
                            email: row.user.email,
                          })
                        }
                      >
                        Lihat Nilai
                      </Button>
                      <IconButton color="primary" onClick={() => onEdit?.(row.id)} title="Edit Nilai">
                        <PenIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => onDelete?.(row.id)} title="Hapus Nilai">
                        <TrashIcon />
                      </IconButton>
                    </Stack>
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
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={(event, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
      />
    </Card>
  );
}
