'use client';

import * as React from 'react';
import {
  Box, Card, Checkbox, Divider, Table, TableBody, TableCell, TableHead,
  TablePagination, TableRow, Typography, IconButton, Stack, Button
} from '@mui/material';
import { PenIcon, TrashIcon, UsersThree } from '@phosphor-icons/react';
import { useSelection } from '@/hooks/use-selection';

export interface Subject {
  id: number;
  name: string;
  teachers: {
    id: number;
    user: { id: number; name: string };
  }[];
}

interface SubjectsTableProps {
  count?: number;
  page?: number;
  rows?: Subject[];
  rowsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onAssign?: (subject: Subject) => void;
}

export function SubjectsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 5,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
  onEdit,
  onDelete,
  onAssign,
}: SubjectsTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => rows.map((s) => s.id.toString()), [rows]);
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
                  onChange={(e) =>
                    e.target.checked ? selectAll() : deselectAll()
                  }
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Subject Name</TableCell>
              <TableCell>Total Teachers</TableCell>
              <TableCell align="center">Actions</TableCell>
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
                    <Typography variant="subtitle2">{row.name}</Typography>
                  </TableCell>
                  <TableCell>{row.teachers?.length ?? 0}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        color="primary"
                        onClick={() => onEdit?.(row.id)}
                        title="Edit Subject"
                      >
                        <PenIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => onDelete?.(row.id)}
                        title="Delete Subject"
                      >
                        <TrashIcon />
                      </IconButton>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<UsersThree size={16} />}
                        onClick={() => onAssign?.(row)}
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
                        Teachers
                      </Button>
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
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(+e.target.value)}
      />
    </Card>
  );
}
