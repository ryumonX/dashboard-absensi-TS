'use client';

import React from 'react';
import { Dialog } from '@mui/material';
import { WarningCircle } from '@phosphor-icons/react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="delete-dialog-title">
      <div className="p-6 w-full max-w-md bg-white rounded-lg shadow-md space-y-5">
        <div className="flex items-start gap-4">
          <WarningCircle size={40} className="text-red-600 shrink-0" weight="fill" />
          <div>
            <h2 id="delete-dialog-title" className="text-lg font-semibold text-gray-900">
              Hapus Data?
            </h2>
            <p className="text-sm text-gray-500">
              Aksi ini tidak bisa dibatalkan. Data akan dihapus secara permanen.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-sm text-white transition-colors duration-150 ${
              loading
                ? 'bg-red-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
