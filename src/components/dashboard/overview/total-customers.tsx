'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps } from '@mui/material/styles';
import { UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

import API from '@/lib/axio-client';

export interface TotalCustomersProps {

  sx?: SxProps;
  value: string;
}

export function TotalCustomers({ sx }: TotalCustomersProps): React.JSX.Element {
  const [value, setValue] = useState('0');

  const fetchTotalStudent = async () => {
    try {
      const res = await API.get('/user/total-students');
      const total = res.data.total;
      setValue(total.toString());

    } catch (error) {
      console.error('Failed to fetch total students:', error);
    }
  };

  useEffect(() => {
    fetchTotalStudent();
  }, []);

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
