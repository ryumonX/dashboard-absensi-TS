'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import API from '@/lib/axio-client';
import { SubjectsFilters } from '@/components/dashboard/subjects/subject-filters';
import { SubjectsTable } from '@/components/dashboard/subjects/subject-table';
import { SubjectAddModal } from '@/components/dashboard/subjects/add-modal';
import { SubjectEditModal } from '@/components/dashboard/subjects/edit-modal';
import { AssignTeacherModal } from '@/components/dashboard/subjects/assign-teacher';

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

interface SubjectData {
  name: string;
  description?: string;
  code?: string;
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

  const selectedSubject = selectedSubjectId === null
    ? null
    : subjects.find((s) => s.id === selectedSubjectId) || null;

  const fetchSubjects = React.useCallback(async (): Promise<void> => {
    try {
      const res = await API.get('/subjects', {
        params: { page: page + 1, limit: rowsPerPage },
      });
      setSubjects(res.data.data);
      setTotal(res.data.meta?.total || 0);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    }
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    void fetchSubjects();
  }, [fetchSubjects]);

  const handleAdd = async (data: SubjectData): Promise<void> => {
    try {
      await API.post('/subjects', data);
      await fetchSubjects();
    } catch (error) {
      console.error('Add failed:', error);
    }
  };

  const handleEdit = async (id: number, data: SubjectData): Promise<void> => {
    try {
      await API.put(`/subjects/${id}`, data);
      await fetchSubjects();
    } catch (error) {
      console.error('Edit failed:', error);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await API.delete(`/subjects/${id}`);
      await fetchSubjects();
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
          if (!selectedSubject || !data.name) return;
          void handleEdit(selectedSubject.id, data as SubjectData);
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
          void fetchSubjects();
          setAssignOpen(false);
          setSelectedSubjectId(null);
        }}
      />
    </Stack>
  );
}
