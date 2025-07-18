import * as React from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableHead, TablePagination,
  TableRow, Chip, Typography
} from '@mui/material';
import dayjs from 'dayjs';

interface Attendance {
  id: number;
  date: string;
  time: string;
  method: string;
  status: string;
}

interface Props {
  rows: Attendance[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

// Move getStatusColor to outer scope
const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'info' | 'default' => {
  switch (status.toLowerCase()) {
    case 'present': {
      return 'success';
    }
    case 'absent': {
      return 'error';
    }
    case 'late': {
      return 'warning';
    }
    case 'excused': {
      return 'info';
    }
    default: {
      return 'default';
    }
  }
};

export function AttendanceHistoryTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: Props): React.JSX.Element {
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{dayjs(row.date).format('DD MMM YYYY')}</TableCell>
                  <TableCell>{dayjs(row.time).format('HH:mm')}</TableCell>
                  <TableCell>{row.method}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={getStatusColor(row.status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No attendance records available.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(Number.parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
