'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import API from '@/lib/axio-client';
import { Stack, Typography } from '@mui/material';
import { GradesFilters } from '@/components/dashboard/grades/grades-filters';
import { GradesTable } from '@/components/dashboard/grades/grades-table';
import { GradeModal } from '@/components/dashboard/grades/grade-modal';

import type { Grade } from '@/components/dashboard/grades/grades-table';

interface GradeFormData {
  subjectId: number;
  teacherId: number;
  semester: string;
  score: number;
  remarks?: string;
}

// Moved async functions to outer scope
const handleAdd = async (data: GradeFormData): Promise<void> => {
  await API.post('/grades', [data]);
};

const handleEdit = async (id: number, data: GradeFormData): Promise<void> => {
  await API.put(`/grades/${id}`, data);
};

const handleDelete = async (id: number): Promise<void> => {
  await API.delete(`/grades/${id}`);
};

export default function Page(): React.JSX.Element {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const [selectedStudent, setSelectedStudent] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const fetchGrades = async (pageNumber = 1, limit = 5): Promise<void> => {
    try {
      const res = await API.get('/user', {
        params: { page: pageNumber, limit },
      });

      setGrades(res.data.data);
      setTotalRows(res.data.meta.total);
    } catch (error) {
      console.error('Gagal fetch grades:', error);
    }
  };

  useEffect(() => {
    fetchGrades(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">STUDENT GRADES</Typography>
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
