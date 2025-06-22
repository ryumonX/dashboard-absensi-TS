'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import API from '@/lib/axioClient';
import { SubjectsFilters } from '@/components/dashboard/subjects/subject-filters';
import { SubjectsTable } from '@/components/dashboard/subjects/subject-table';
import { SubjectAddModal } from '@/components/dashboard/subjects/add-modal';
import { SubjectEditModal } from '@/components/dashboard/subjects/edit-modal';
import { AssignTeacherModal } from '@/components/dashboard/subjects/assignTeacher';

export interface Subject {
  id: number;
  name: string;
  teachers: {
    id: number;
    user: {
      id: number;
      name: string;
    };
  }[];
}

export default function Page(): React.JSX.Element {
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [total, setTotal] = React.useState(0);

  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<number | null>(null);

  const selectedSubject = selectedSubjectId !== null
    ? subjects.find((s) => s.id === selectedSubjectId) || null
    : null;

  const fetchSubjects = async () => {
    try {
      const res = await API.get('/subjects', {
        params: { page: page + 1, limit: rowsPerPage },
      });
      setSubjects(res.data.data);
      setTotal(res.data.meta?.total || 0);
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
    }
  };

  React.useEffect(() => {
    fetchSubjects();
  }, [page, rowsPerPage]); // <-- Tambahkan dependency agar refresh saat paginasi berubah

  const handleAdd = async (data: any) => {
    try {
      await API.post('/subjects', data);
      fetchSubjects();
    } catch (error) {
      console.error('Add failed:', error);
    }
  };

  const handleEdit = async (id: number, data: any) => {
    try {
      await API.put(`/subjects/${id}`, data);
      fetchSubjects();
    } catch (error) {
      console.error('Edit failed:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Mata Pelajaran</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => setAddOpen(true)}
          >
            Tambah
          </Button>
        </div>
      </Stack>

      <SubjectsFilters />

      <SubjectsTable
        count={total}
        page={page}
        rows={subjects}
        rowsPerPage={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newLimit) => {
          setRowsPerPage(newLimit);
          setPage(0); // reset ke halaman pertama
        }}
        onEdit={(id) => {
          setSelectedSubjectId(id);
          setEditOpen(true);
        }}
        onDelete={handleDelete}
        onAssign={(subject) => {
          setSelectedSubjectId(subject.id);
          setAssignOpen(true);
        }}
      />

      <SubjectAddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAdd}
      />

      <SubjectEditModal
        open={editOpen}
        data={selectedSubject}
        onClose={() => {
          setEditOpen(false);
          setSelectedSubjectId(null);
        }}
        onSave={(data) => {
          if (!selectedSubject) return;
          handleEdit(selectedSubject.id, data);
          setEditOpen(false);
          setSelectedSubjectId(null);
        }}
      />

      <AssignTeacherModal
        open={assignOpen}
        subjectId={selectedSubjectId || 0}
        onClose={() => {
          setAssignOpen(false);
          setSelectedSubjectId(null);
        }}
        onSuccess={() => {
          fetchSubjects();
          setAssignOpen(false);
          setSelectedSubjectId(null);
        }}
      />
    </Stack>
  );
}
