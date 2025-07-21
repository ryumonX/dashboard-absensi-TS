'use client';

import React, { useEffect, useRef, useCallback } from 'react';
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

  const handleScanSuccess = useCallback((decodedText: string) => {
    onScanSuccess(decodedText);
    onClose();
  }, [onScanSuccess, onClose]);

  const handleScanError = useCallback((_error: string) => {
    // Optional: log scanning errors
  }, []);

  useEffect(() => {
    if (!open || globalThis.window === undefined) return;

    const startScanner = async () => {
      try {
        const regionEl = document.querySelector(`#${qrCodeRegionId}`);
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

        // Cari kamera belakang jika ada
        let cameraId = devices[0].id;
        for (const device of devices) {
          if (/back|environment/i.test(device.label)) {
            cameraId = device.id;
            break;
          }
        }

        await html5QrCodeRef.current.start(
          cameraId,
          { fps: 30, qrbox: { width: 250, height: 250 } },
          handleScanSuccess,
          handleScanError
        );
      } catch (error) {
        console.error('Error accessing camera:', error);
        onClose();
      }
    };

    const delay = setTimeout(() => {
      startScanner();
    }, 100);

    return () => {
      clearTimeout(delay);
      html5QrCodeRef.current
        ?.stop()
        .then(() => html5QrCodeRef.current?.clear())
        .catch((error) => console.warn('Cleanup error:', error));
    };
  }, [open, onClose, handleScanSuccess, handleScanError]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Scan QR Code
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div
          id={qrCodeRegionId}
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
