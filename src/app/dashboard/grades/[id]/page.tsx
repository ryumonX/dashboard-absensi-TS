"use client";
import * as React from 'react';
import { useParams } from 'next/navigation';
import RaportPage from '@/components/dashboard/students/raport';

export default function Page(): React.JSX.Element {
  const params = useParams();
  return <RaportPage userId={Number.parseInt(params.id as string, 10)} />;
}
