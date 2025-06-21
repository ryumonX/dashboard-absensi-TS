'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import API from '@/lib/axioClient';
import * as XLSX from 'xlsx';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { GradesFilters } from '@/components/dashboard/grades/grades-filters';
import { GradesTable } from '@/components/dashboard/grades/grades-table';
import { GradeAddModal } from '@/components/dashboard/grades/add-modal';
import { GradeEditModal } from '@/components/dashboard/grades/edit-modal';
import { GradeModal } from '@/components/dashboard/grades/grade-modal';
// import { GradeModal } from '@/components/dashboard/grades/detail-modal';

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
  createdAt?: string;
}

export default function Page(): React.JSX.Element {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const [studentGrades, setStudentGrades] = useState<Grade[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<{ id: number; name: string; email: string } | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

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

  const fetchGradesStudent = async (studentId: number, page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await API.get(`/grades/user/${studentId}`, {
        params: { page, limit },
      });
      setStudentGrades(res.data.data);
      setTotalRows(res.data.meta.total);
      setDetailModalOpen(true);
    } catch (err) {
      console.error('Gagal fetch grades student:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleEdit = async (id: number, updatedData: Partial<Grade>) => {
    try {
      await API.put(`/grade/${id}`, updatedData);
      fetchGrades(page + 1, rowsPerPage);
    } catch (err) {
      console.error('Gagal edit:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/grades/${id}`);
      fetchGrades(page + 1, rowsPerPage);
    } catch (err) {
      console.error('Gagal hapus:', err);
    }
  };

  const openEditModal = (id: number) => {
    const found = grades.find((g) => g.id === id);
    if (found) {
      setSelectedGrade(found);
      setEditModalOpen(true);
    }
  };

  const handleExport = () => {
    const data = grades.map((g) => ({
      'Student Name': g.user.name,
      'Subject': g.subject.name,
      'Teacher': g.teacher.name,
      'Semester': g.semester,
      'Score': g.score,
      'Remarks': g.remarks || '',
      'Created At': g.createdAt ? new Date(g.createdAt).toLocaleString() : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Grades');
    XLSX.writeFile(workbook, 'grades_export.xlsx');
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">STUDENT GRADES</Typography>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<DownloadIcon />} onClick={handleExport}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon />}
            variant="contained"
            onClick={() => setAddModalOpen(true)}
          >
            Add
          </Button>
        </div>
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
        onEdit={openEditModal}
        onDelete={handleDelete}
        onViewStudent={(student) => {
          setSelectedStudent(student);
          fetchGradesStudent(student.id);
        }}
      />

      <GradeAddModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={async (data) => {
          try {
            await API.post('/grades', data);
            fetchGrades(page + 1, rowsPerPage);
          } catch (err) {
            console.error('Gagal tambah data:', err);
          }
        }}
      />

      <GradeEditModal
        open={editModalOpen}
        data={selectedGrade}
        onClose={() => setEditModalOpen(false)}
        onSave={async (updatedData) => {
          if (selectedGrade) {
            await handleEdit(selectedGrade.id, updatedData);
            setEditModalOpen(false);
          }
        }}
      />

      {selectedStudent && (
        <GradeModal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          student={selectedStudent}
          grades={studentGrades}
          onAdd={() => fetchGradesStudent(selectedStudent.id)} // or open modal
          onEdit={(id) => openEditModal(id)}
          onDelete={async (id) => {
            await handleDelete(id);
            fetchGradesStudent(selectedStudent.id);
          }}
        />
      )}
    </Stack>
  );
}
