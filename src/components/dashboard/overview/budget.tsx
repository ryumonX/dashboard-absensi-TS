'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';
import type { SxProps } from '@mui/material/styles';
import API from '@/lib/axio-client';

export interface BudgetProps {
  sx?: SxProps;
}

export function Budget({ sx }: BudgetProps): React.JSX.Element {
  const [value, setValue] = useState('0');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/attendances/total-today'); // ganti jika perlu
        const totalToday = response.data.total;

        setValue(String(totalToday));

      } catch (error) {
        console.error('Failed to fetch attendance today:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30_000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Attendance Today
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
              <CurrencyDollarIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>

        </Stack>
      </CardContent>
    </Card>
  );
}
