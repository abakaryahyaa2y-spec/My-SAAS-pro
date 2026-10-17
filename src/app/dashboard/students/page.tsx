'use client';
import dynamic from 'next/dynamic';

// Chargement dynamique du composant contenant la logique Dexie.js (IndexedDB)
// On désactive le SSR (Server-Side Rendering) car IndexedDB n'existe que dans le navigateur.
const ClientStudents = dynamic(() => import('@/components/ClientStudents'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
});

export default function StudentsPage() {
  return <ClientStudents />;
}
