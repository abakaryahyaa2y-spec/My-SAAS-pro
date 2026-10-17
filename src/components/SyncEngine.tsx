'use client';
import { useEffect, useState } from 'react';
import { WifiOff, RefreshCcw } from 'lucide-react';

export function SyncEngine() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Initial check
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSync = async () => {
    setIsSyncing(true);
    try {
      // Logique de synchronisation vers Supabase à implémenter ici (Phase 3)
      console.log('Synchronisation des données locales vers le cloud...');
      // Simulation d'une requête réseau
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Synchronisation terminée avec succès.');
    } catch (error) {
      console.error('Erreur lors de la synchronisation', error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isOnline && !isSyncing) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {!isOnline && (
        <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-pulse">
          <WifiOff className="w-5 h-5" />
          <div className="text-sm">
            <p className="font-bold">Mode Hors Ligne</p>
            <p className="opacity-90">Les modifications sont sauvegardées localement.</p>
          </div>
        </div>
      )}

      {isSyncing && (
        <div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3">
          <RefreshCcw className="w-5 h-5 animate-spin" />
          <div className="text-sm">
            <p className="font-bold">Réseau rétabli</p>
            <p className="opacity-90">Synchronisation au cloud en cours...</p>
          </div>
        </div>
      )}
    </div>
  );
}
