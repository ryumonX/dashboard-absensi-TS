'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ListBulletsIcon } from '@phosphor-icons/react/dist/ssr/ListBullets';
import type { SxProps } from '@mui/material/styles';
import API from '@/lib/axio-client';

export interface TasksProgressProps {
  sx?: SxProps;
}

export function TasksProgress({ sx }: TasksProgressProps): React.JSX.Element {
  const [totalSubjects, setTotalSubjects] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchTotalSubjects = async () => {
      try {
        const res = await API.get('/subjects/total');
        setTotalSubjects(res.data.total); // { total: 7 }
      } catch (error) {
        console.error('Failed to fetch total subjects:', error);
      }
    };

    fetchTotalSubjects();
  }, []);

  const progressValue = Math.min((totalSubjects / 10) * 100, 100);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" gutterBottom variant="overline">
                Subject Total
              </Typography>
              <Typography variant="h4">{totalSubjects}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-warning-main)', height: 56, width: 56 }}>
              <ListBulletsIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
          <div>
            <LinearProgress value={progressValue} variant="determinate" />
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
