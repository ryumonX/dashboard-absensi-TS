'use client';
import { useParams } from 'next/navigation';
import AttendanceHistoryPage from '@/components/dashboard/students/attendancehistory';

export default function Page() {
  const params = useParams();
  return <AttendanceHistoryPage userId={parseInt(params.id as string)} />;
}
