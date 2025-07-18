'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import API from '@/lib/axio-client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';

export interface SalesProps {
  sx?: SxProps;
}

type DailyData = {
  day: string;
  total: number;
};

export function Sales({ sx }: SalesProps): React.JSX.Element {
  const [chartSeries, setChartSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);

  const fetchWeeklyData = async () => {
    try {
      const response = await API.get('/attendances/total-this-week');
      const { daily, total } = response.data;

      const labels = daily.map((d: DailyData) => d.day);
      const data = daily.map((d: DailyData) => d.total);

      setCategories(labels);
      setChartSeries([
        {
          name: 'This Week',
          data,
        },
      ]);
      setTotal(total);
    } catch (error) {
      console.error('Failed to fetch weekly attendance data:', error);
    }
  };

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const chartOptions = useChartOptions(categories);

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button color="inherit" size="small" startIcon={<ArrowClockwiseIcon />} onClick={fetchWeeklyData}>
            Sync
          </Button>
        }
        title={`Attendance This Week (Total: ${total})`}
      />
      <CardContent>
        <Chart height={350} options={chartOptions} series={chartSeries} type="bar" width="100%" />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="inherit" endIcon={<ArrowRightIcon />} size="small">
          Overview
        </Button>
      </CardActions>
    </Card>
  );
}

function useChartOptions(categories: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent', stacked: false, toolbar: { show: false } },
    colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
    plotOptions: { bar: { columnWidth: '40px' } },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      categories,
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value}`,
        offsetX: -10,
        style: { colors: theme.palette.text.secondary },
      },
    },
  };
}
