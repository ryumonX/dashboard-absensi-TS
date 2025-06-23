'use client';
import { useParams } from 'next/navigation';
import RaportPage from '@/components/dashboard/students/raport';

export default function Page() {
  const params = useParams();
  return <RaportPage userId={parseInt(params.id as string)} />;
}
