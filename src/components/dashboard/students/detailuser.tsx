'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  CircularProgress,
  Box,
  Button,
  DialogActions,
  Stack,
  Divider,
} from '@mui/material';
import QRCode from 'react-qr-code';
import API from '@/lib/axio-client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import dayjs from 'dayjs';

interface StudentDetailModalProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
}

interface UserDetail {
  id: number;
  name: string;
  email: string;
  role: string;
  qrcode: string;
  destinationCountry: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
}

export default function StudentDetailModal({
  open,
  onClose,
  userId,
}: StudentDetailModalProps) {
  const [user, setUser] = React.useState<UserDetail | null>(null);
  const [loading, setLoading] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (userId === null || !open) return;

    setLoading(true);
    API.get(`/user/${userId}`)
      .then((res) => setUser(res.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [userId, open]);

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, {
      scale: 3,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [100, 65], // Lebar lebih besar untuk 2 kolom
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = 100;
    const pdfHeight = 65;
    const imgRatio = imgProps.width / imgProps.height;

    let imgWidth = pdfWidth;
    let imgHeight = imgWidth / imgRatio;

    if (imgHeight > pdfHeight) {
      imgHeight = pdfHeight;
      imgWidth = imgHeight * imgRatio;
    }

    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save(`${user?.name ?? 'user'}_card.pdf`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent
        sx={{
          background: '#f3f4f6',
          borderRadius: 2,
          p: 3,
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : user ? (
          <Box
            ref={contentRef}
            sx={{
              width: 360,
              mx: 'auto',
              backgroundColor: '#ffffff',
              border: '2px solid #d1d5db',
              borderRadius: 4,
              p: 2,
              boxShadow: '0 0 0 4px #1e3a8a',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                backgroundColor: '#1e3a8a',
                color: '#ffffff',
                borderRadius: '8px 8px 0 0',
                py: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Kartu Siswa
              </Typography>
              <Typography variant="body2">
                Delta Abadi Internasional
              </Typography>
            </Box>

            {/* QR Code */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={2}
              mb={1}
              p={1}
              sx={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 2,
              }}
            >
              <QRCode value={user.qrcode} size={120} />
            </Box>

            {/* Nama dan ID */}
            <Typography
              variant="h6"
              fontWeight="bold"
              textAlign="center"
              gutterBottom
              sx={{ color: '#1e293b' }}
            >
              {user.name.toUpperCase()}
            </Typography>
            <Typography
              variant="subtitle2"
              textAlign="center"
              gutterBottom
              color="text.secondary"
            >
              ID: WT{user.id.toString().padStart(7, '0')}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Informasi Detail */}
            <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
              <Stack spacing={1} flex={1} minWidth={150}>
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  <strong>Role:</strong> {user.role}
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  <strong>Destination:</strong> {user.destinationCountry || 'N/A'}
                </Typography>
              </Stack>
              <Stack spacing={1} flex={1} minWidth={150}>
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  <strong>Phone:</strong> {user.phoneNumber || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Birth:</strong>{' '}
                  {user.dateOfBirth
                    ? dayjs(user.dateOfBirth).format('D MMMM YYYY')
                    : 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Join date:</strong> 6/2025
                </Typography>
              </Stack>

            </Stack>

            <Typography
              variant="caption"
              display="block"
              mt={2}
              textAlign="center"
              sx={{ fontStyle: 'italic', color: '#6b7280' }}
            >
              KARTU IDENTITAS DIGITAL SISWA
            </Typography>
          </Box>
        ) : (
          <Typography>User tidak ditemukan</Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Tutup
        </Button>
        <Button onClick={handleDownloadPDF} variant="contained" color="primary">
          Download Card
        </Button>
      </DialogActions>
    </Dialog>
  );
}
