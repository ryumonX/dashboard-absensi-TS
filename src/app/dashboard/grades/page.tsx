'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import API from '@/lib/axioClient';
import * as XLSX from 'xlsx';

import { Stack, Button, Typography } from '@mui/material';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { GradesFilters } from '@/components/dashboard/grades/grades-filters';
import { GradesTable } from '@/components/dashboard/grades/grades-table';
import { GradeModal } from '@/components/dashboard/grades/grade-modal';

import type { Grade } from '@/components/dashboard/grades/grades-table';

export default function Page(): React.JSX.Element {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const [selectedStudent, setSelectedStudent] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const fetchGrades = async (page = 1, limit = 5) => {
    setLoading(true);
    try {
      const res = await API.get('/grades', {
        params: { page, limit },
      });
      setGrades(res.data.data);
      setTotalRows(res.data.meta.total);
    } catch (err) {
      console.error('Gagal fetch grades:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleExport = () => {
    const data = grades.map((g) => ({
      'Student Name': g.user.name,
      Subject: g.subject.name,
      Teacher: g.teacher.name,
      Semester: g.semester,
      Score: g.score,
      Remarks: g.remarks || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Grades');
    XLSX.writeFile(workbook, 'grades_export.xlsx');
  };

  const handleAdd = async (data: any[]) => {
    await API.post('/grades', data);
  };

  const handleEdit = async (id: number, data: any) => {
    await API.put(`/grade/${id}`, data);
  };

  const handleDelete = async (id: number) => {
    await API.delete(`/grades/${id}`);
  };

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">STUDENT GRADES</Typography>
            <Button
              color="inherit"
              startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}
              onClick={handleExport}
            >
              Export
            </Button>
          </Stack>
        </Stack>

        <GradesFilters />

        <GradesTable
          count={totalRows}
          page={page}
          rows={grades}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newLimit) => {
            setRowsPerPage(newLimit);
            setPage(0);
          }}
          onViewStudent={(student) => {
            setSelectedStudent(student);
            setModalOpen(true);
          }}
        />
      </Stack>

      {selectedStudent && (
        <GradeModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
