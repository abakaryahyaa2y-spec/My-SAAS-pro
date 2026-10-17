'use client';
import dynamic from 'next/dynamic';

const ClientFinances = dynamic(() => import('@/components/ClientFinances'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
});

export default function FinancesPage() {
  return <ClientFinances />;
}
