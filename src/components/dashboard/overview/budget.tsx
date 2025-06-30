'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import { CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';
import type { SxProps } from '@mui/material/styles';
import API from '@/lib/axioClient';

export interface BudgetProps {
  sx?: SxProps;
}

export function Budget({ sx }: BudgetProps): React.JSX.Element {
  const [value, setValue] = useState('0');
  const [diff, setDiff] = useState<number | undefined>(undefined);
  const [trend, setTrend] = useState<'up' | 'down'>('up');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/attendances/total-today'); // ganti jika perlu
        const totalToday = response.data.total;

        // Contoh pembanding: minggu lalu atau angka statik
        const previous = 20;
        const percentageDiff = ((totalToday - previous) / previous) * 100;

        setValue(String(totalToday));
        setDiff(Math.abs(Math.round(percentageDiff)));

        setTrend(percentageDiff >= 0 ? 'up' : 'down');
      } catch (error) {
        console.error('Failed to fetch attendance today:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30000); // refresh tiap 30 detik
    return () => clearInterval(interval);
  }, []);

  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const trendColor = trend === 'up' ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';

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
          {/* {diff !== undefined ? (
            <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
              <Stack sx={{ alignItems: 'center' }} direction="row" spacing={0.5}>
                <TrendIcon color={trendColor} fontSize="var(--icon-fontSize-md)" />
                <Typography color={trendColor} variant="body2">
                  {diff}%
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="caption">
                Since last month
              </Typography>
            </Stack>
          ) : null} */}
        </Stack>
      </CardContent>
    </Card>
  );
}
