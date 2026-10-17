'use client';
import dynamic from 'next/dynamic';

const ClientHR = dynamic(() => import('@/components/ClientHR'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
});

export default function HRPage() {
  return <ClientHR />;
}
