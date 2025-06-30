'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps } from '@mui/material/styles';
import { ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import { UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

import API from '@/lib/axioClient';

export interface TotalCustomersProps {
  diff?: number;
  trend: 'up' | 'down';
  sx?: SxProps;
  value: string;
}

export function TotalCustomers({ sx }: TotalCustomersProps): React.JSX.Element {
  const [value, setValue] = useState('0');
  const [trend, setTrend] = useState<'up' | 'down'>('up');
  const [diff, setDiff] = useState<number | undefined>(undefined);

  const fetchTotalStudent = async () => {
    try {
      const res = await API.get('/user/total-students');
      const total = res.data.total;
      setValue(total.toString());

      const previous = 35;
      const current = total;
      const difference = previous > 0 ? ((current - previous) / previous) * 100 : 0;

      setTrend(current >= previous ? 'up' : 'down');
      setDiff(Math.abs(Math.round(difference)));
    } catch (err) {
      console.error('Failed to fetch total students:', err);
    }
  };

  useEffect(() => {
    fetchTotalStudent();
  }, []);

  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const trendColor = trend === 'up' ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Total Student
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-success-main)', height: '56px', width: '56px' }}>
              <UsersIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        
        </Stack>
      </CardContent>
    </Card>
  );
}
