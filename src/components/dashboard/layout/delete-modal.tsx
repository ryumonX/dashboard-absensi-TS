'use client'

import { Dialog } from '@mui/material'
import { WarningCircle } from '@phosphor-icons/react'
import { FC } from 'react'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
}

const DeleteModal: FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, loading = false }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="delete-dialog-title">
      <div className="p-6 max-w-md w-full space-y-4">
        <div className="flex items-start gap-4">
          <WarningCircle size={40} className="text-red-600" weight="fill" />
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
            className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-100 transition"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 transition"
            disabled={loading}
          >
            {loading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </Dialog>
  )
}

export default DeleteModal
