'use client';

import * as React from 'react';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
Tooltip,
} from '@mui/material';
import {
  Pen,
  Trash,
  Eye,
  Calendar,
  BookOpen,
} from '@phosphor-icons/react';
import { useSelection } from '@/hooks/use-selection';
import Link from 'next/link';
import dayjs from 'dayjs';

export interface student {
  id: number;
  avatar?: string;
  name: string;
  email: string;
  phoneNumber?: string;
  destinationCountry?: string;
  dateOfBirth?: string;
  createdAt?: Date;
}

interface Props {
  rows: student[];
  count: number;
  page: number;
  rowsPerPage: number;
  onEdit?: (student: student) => void;
  onDelete?: (id: number) => void;
  onViewDetail?: (id: number) => void;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newLimit: number) => void;
}

export function StudentsTable({
  rows,
  count,
  page,
  rowsPerPage,
  onEdit,
  onDelete,
  onViewDetail,
  onPageChange,
  onRowsPerPageChange,
}: Props) {
  const rowIds = React.useMemo(() => rows.map((s) => s.id), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
  const selectedAll = selected.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selected.size > 0 && !selectedAll}
                  onChange={(e) => (e.target.checked ? selectAll() : deselectAll())}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Signed Up</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected.has(row.id);

              return (
                <TableRow key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => (e.target.checked ? selectOne(row.id) : deselectOne(row.id))}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={row.avatar} />
                      <Typography>{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phoneNumber || '-'}</TableCell>
                  <TableCell>
                    {row.createdAt ? dayjs(row.createdAt).format('MMM D, YYYY') : '-'}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => onEdit?.(row)}>
                          <Pen />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Hapus">
                        <IconButton color="error" onClick={() => onDelete?.(row.id)}>
                          <Trash />
                        </IconButton>
                      </Tooltip>


                      <Tooltip title="Detail Siswa">
                        <IconButton color="info" onClick={() => onViewDetail?.(row.id)}>
                          <Eye />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Lihat Absensi">
                        <Link href={`/dashboard/attendances/${row.id}`} passHref>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Calendar size={16} />}
                            sx={{
                              bgcolor: '#7B1FA2',
                              color: '#fff',
                              fontWeight: 600,
                              px: 2,
                              borderRadius: 2,
                              textTransform: 'none',
                              '&:hover': {
                                bgcolor: '#6A1B9A',
                                boxShadow: '0 0 0 2px rgba(123,31,162,0.3)',
                              },
                            }}
                          >
                            Attendance
                          </Button>
                        </Link>
                      </Tooltip>

                      <Tooltip title="Lihat Raport">
                        <Link href={`/dashboard/grades/${row.id}`} passHref>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<BookOpen size={16} />}
                            sx={{
                              bgcolor: '#0288D1',
                              color: '#fff',
                              fontWeight: 600,
                              px: 2,
                              borderRadius: 2,
                              textTransform: 'none',
                              '&:hover': {
                                bgcolor: '#0277BD',
                                boxShadow: '0 0 0 2px rgba(2,136,209,0.3)',
                              },
                            }}
                          >
                            Raport
                          </Button>
                        </Link>
                      </Tooltip>
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
        onPageChange={(_, newPage) => onPageChange?.(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange?.(Number.parseInt(e.target.value))}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
