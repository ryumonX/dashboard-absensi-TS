'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import type { SxProps } from '@mui/material/styles';

export interface TotalProfitProps {
  sx?: SxProps;
}

export function TotalProfit({ sx }: TotalProfitProps): React.JSX.Element {
  const [currentTime, setCurrentTime] = React.useState<string>(() =>
    new Date().toLocaleTimeString('id-ID', { hour12: false })
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString('id-ID', { hour12: false });
      setCurrentTime(now);
    }, 1000); // update setiap 1 detik

    return () => clearInterval(interval); // bersihkan saat unmount
  }, []);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" gutterBottom variant="overline">
                Waktu Sekarang
              </Typography>
              <Typography variant="h4">{currentTime}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: 56, width: 56 }}>
              <ClockIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
