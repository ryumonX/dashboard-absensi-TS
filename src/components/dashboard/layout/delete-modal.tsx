'use client'

import { Dialog, Slide } from '@mui/material';
import { WarningCircle } from '@phosphor-icons/react';
import { FC, forwardRef, Ref, ReactElement } from 'react';
import { TransitionProps } from '@mui/material/transitions';

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteModal: FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, loading = false }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="delete-dialog-title"
      PaperProps={{
        className: 'rounded-xl shadow-xl',
      }}
    >
      <div className="p-6 md:p-8 w-full max-w-md space-y-6 bg-white">
        <div className="flex items-start gap-4">
          <div className="bg-red-100 p-3 rounded-full">
            <WarningCircle size={32} className="text-red-600" weight="duotone" />
          </div>
          <div>
            <h2 id="delete-dialog-title" className="text-lg font-bold text-gray-900">
              Yakin ingin menghapus?
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Tindakan ini bersifat permanen dan tidak bisa dikembalikan. Pastikan data yang ingin dihapus sudah benar.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-95 transition-transform duration-150"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-transform duration-150 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteModal;
