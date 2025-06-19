import { redirect } from 'next/navigation';

'use client'
export default function Page(): never {
  redirect('/dashboard');
}
