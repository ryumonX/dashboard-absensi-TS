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

import { UsersTable } from '@/components/dashboard/user/users-table';
import UserFormModal from '@/components/dashboard/user/users-formmodal';
import DeleteModal from '@/components/dashboard/layout/delete-modal';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  phoneNumber?: string;
  destinationCountry?: string;
  dateOfBirth?: string;
  createdAt?: Date | undefined;
  role: string;
}

export default function Page(): React.JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 🆕 DELETE MODAL STATE
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/user');
      const allUsers = res.data.data;
      const filtered = allUsers.filter((user: User) => user.role !== 'student');
      setUsers(filtered);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      await API.delete(`/user/${id}`);
      await fetchUsers();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setOpenModal(true);
  };

  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Users</Typography>
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
              setEditUser(null);
              setOpenModal(true);
            }}
          >
            Add
          </Button>
        </div>
      </Stack>

      <UsersTable
        rows={paginatedUsers}
        count={users.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number.parseInt(event.target.value, 10));
          setPage(0);
        }}
        onEdit={handleEdit}
        onDelete={(id) => {
          const user = users.find((u) => u.id === id);
          if (user) {
            setUserToDelete(user);
            setDeleteModalOpen(true);
          }
        }}
      />

      <UserFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          void fetchUsers();
        }}
        initialData={editUser}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setUserToDelete(null);
          }
        }}
        onConfirm={() => {
          if (userToDelete) {
            handleDelete(userToDelete.id);
          }
        }}
        loading={isDeleting}
      />
    </Stack>
  );
}
