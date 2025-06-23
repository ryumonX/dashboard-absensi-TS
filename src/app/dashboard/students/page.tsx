'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import API from '@/lib/axioClient';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { StudentsTable } from '@/components/dashboard/students/students-table';
import StudentFormModal from '@/components/dashboard/students/student-form-modal';
import StudentDetailModal from '@/components/dashboard/students/detailuser';

export interface Student {
  id: number;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  phoneNumber?: string;
  destinationCountry?: string;
  dateOfBirth?: string;
  createdAt?: Date;
}

export default function Page(): React.JSX.Element {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Ambil data dari API
  const fetchStudents = async () => {
  setLoading(true);
  try {
    const res = await API.get('/user');
    const allUsers = res.data.data;

    const onlyStudents = allUsers.filter((user: any) => user.role === 'student');

    setStudents(onlyStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchStudents();
  }, []);

  // Hapus siswa
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/api/users/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // Edit siswa
  const handleEdit = (student: Student) => {
    setEditStudent(student);
    setOpenModal(true);
  };

  const handleViewDetail = (id: number) => {
    setSelectedUserId(id);
    setOpenDetailModal(true);
  };


  // Pagination
  const paginatedStudents = students.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Students</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon />}>Import</Button>
            <Button color="inherit" startIcon={<DownloadIcon />}>Export</Button>
          </Stack>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon />}
            variant="contained"
            onClick={() => {
              setEditStudent(null); // mode add
              setOpenModal(true);
            }}
          >
            Add
          </Button>
        </div>
      </Stack>

      {/* Table siswa */}
      <StudentsTable
        rows={paginatedStudents}
        count={students.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newLimit) => {
          setRowsPerPage(newLimit);
          setPage(0);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetail={handleViewDetail}
      />

      {/* Modal tambah/edit siswa */}
      <StudentFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          fetchStudents();
        }}
        initialData={editStudent}
      />

      <StudentDetailModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        userId={selectedUserId}
      />

    </Stack>
  );
}
