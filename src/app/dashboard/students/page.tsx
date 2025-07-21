'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import API from '@/lib/axio-client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { StudentsTable } from '@/components/dashboard/students/students-table';
import StudentFormModal from '@/components/dashboard/students/student-form-modal';
import StudentDetailModal from '@/components/dashboard/students/detailuser';
import DeleteModal from '@/components/dashboard/layout/delete-modal';

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
  jobName?: string;
  progressNumber?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password?: string;
  avatar?: string;
  phoneNumber?: string;
  destinationCountry?: string;
  dateOfBirth?: string;
  createdAt?: Date;
  jobName?: string;
  progressNumber?: number;
}

export default function Page(): React.JSX.Element {
  const [students, setStudents] = useState<Student[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Ambil data dari API
  const fetchStudents = async (): Promise<void> => {
    try {
      const res = await API.get('/user');
      const allUsers = res.data.data as User[];

      const onlyStudents = allUsers.filter((user: User) => user.role === 'student');

      setStudents(onlyStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Hapus siswa
  const handleDelete = async (id: number): Promise<void> => {
    try {
      setIsDeleting(true);
      await API.delete(`/user/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  // Edit siswa
  const handleEdit = (student: Student): void => {
    setEditStudent(student);
    setOpenModal(true);
  };

  const handleViewDetail = (id: number): void => {
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
        onDelete={(id) => {
          const student = students.find((s) => s.id === id);
          if (student) {
            setStudentToDelete(student);
            setDeleteModalOpen(true);
          }
        }}
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

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setStudentToDelete(null);
          }
        }}
        onConfirm={() => {
          if (studentToDelete) {
            handleDelete(studentToDelete.id);
          }
        }}
        loading={isDeleting}
      />

    </Stack>
  );
}
