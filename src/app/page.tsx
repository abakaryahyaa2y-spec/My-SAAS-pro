import { redirect } from 'next/navigation';

export default function Home() {
  // Pour le moment, on redirige directement vers le dashboard. 
  // La Landing Page sera construite lors de la Phase 4.
  redirect('/dashboard');
}
