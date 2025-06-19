'use client';

import { useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (data: string) => void;
}

export default function QRScannerHtml5({ open, onClose, onScanSuccess }: QRScannerProps) {
  const qrCodeRegionId = 'html5qr-code-region';
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;

    const startScanner = async () => {
      try {
        // 💡 Pastikan element sudah ada di DOM
        const regionEl = document.getElementById(qrCodeRegionId);
        if (!regionEl) {
          console.warn('QR element not ready yet. Retrying...');
          return;
        }

        html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);

        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          alert('No camera devices found');
          onClose();
          return;
        }

        const cameraId = devices[0].id;

        await html5QrCodeRef.current.start(
          cameraId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            onScanSuccess(decodedText);
            onClose();
          },
          (err) => {
            // optional: log scanning errors
          }
        );
      } catch (err) {
        console.error('Error accessing camera:', err);
        onClose();
      }
    };

    // 🔄 Tunggu DOM ready dulu
    const delay = setTimeout(() => {
      startScanner();
    }, 200); // beri delay kecil agar DOM benar-benar siap

    return () => {
      clearTimeout(delay);
      html5QrCodeRef.current
        ?.stop()
        .then(() => html5QrCodeRef.current?.clear())
        .catch((err) => console.warn('Cleanup error:', err));
    };
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Scan QR Code
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          X
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div id={qrCodeRegionId} style={{ width: '100%', aspectRatio: '1/1' }} />
      </DialogContent>
    </Dialog>
  );
}
