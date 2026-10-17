'use client';
import { useState } from 'react';
import { CreditCard, DollarSign, AlertCircle, Printer, Trash2, X, FileText } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, LocalFinance } from '@/lib/db';

export default function ClientFinances() {
  const [receiptFinance, setReceiptFinance] = useState<LocalFinance | null>(null);
  const finances = useLiveQuery(() => db.finances.toArray()) || [];

  const addMockFinance = async () => {
    try {
      await db.finances.add({
        student: 'Nouvel Élève',
        grade: 'Seconde C',
        amount: '50 000 F',
        dueDate: new Date().toLocaleDateString('fr-FR'),
        status: Math.random() > 0.5 ? 'Payé' : 'Impayé',
        type: 'Scolarité - Trimestre 1',
        syncStatus: 'pending_insert',
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFinance = async (id: string) => {
    await db.finances.delete(id);
  };

  const totalEncaisse = finances.filter(f => f.status === 'Payé').length * 50000;
  const totalImpayes = finances.filter(f => f.status === 'Impayé').length * 50000;

  return (
    <div>
      <div className={receiptFinance ? 'print:hidden' : ''}>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Finances & Impayés</h1>
            <p className="mt-2 text-sm text-gray-700">
              Gérez les paiements de scolarité, suivez les encaissements et relancez les impayés. (Mode Offline-First actif)
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-2">
            <button 
              onClick={() => window.print()}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Printer className="-ml-1 mr-2 h-4 w-4 text-gray-500" />
              Imprimer la liste
            </button>
            <button 
              onClick={addMockFinance}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <DollarSign className="-ml-1 mr-2 h-5 w-5" />
              Enregistrer un paiement (Local)
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Encaissé (Ce mois)</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalEncaisse.toLocaleString('fr-FR')} F</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Impayés</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalImpayes.toLocaleString('fr-FR')} F</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Historique des Transactions & Situations</h2>
          <div className="flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Élève</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type de Frais</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Montant</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Échéance</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sync</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {finances.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-500">
                            Aucune transaction. Enregistrez un paiement en local pour tester.
                          </td>
                        </tr>
                      ) : null}
                      {finances.map((row) => (
                        <tr key={row.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {row.student} <span className="text-gray-500 text-xs ml-1">({row.grade})</span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{row.type}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-semibold">{row.amount}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{row.dueDate}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              row.status === 'Payé' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {row.syncStatus === 'synced' ? (
                               <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-green-100 text-green-800">Cloud</span>
                            ) : (
                               <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-yellow-100 text-yellow-800 animate-pulse">Local</span>
                            )}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-2 items-center">
                               <button 
                                 onClick={() => setReceiptFinance(row)}
                                 className="text-gray-600 hover:text-gray-900 bg-gray-100 p-1.5 rounded-md" 
                                 title="Imprimer Reçu de Paiement"
                               >
                                 <Printer className="h-4 w-4" />
                               </button>
                               <button 
                                 onClick={() => row.id && deleteFinance(row.id)} 
                                 className="text-red-600 hover:text-red-900 ml-2" 
                                 title="Supprimer"
                               >
                                 <Trash2 className="h-4 w-4" />
                               </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reçu de Paiement individuel (Facture) */}
      {receiptFinance && (
        <div className="fixed inset-0 z-50 flex justify-center bg-gray-900 bg-opacity-75 sm:py-10 print:static print:bg-white print:p-0 print:inset-auto">
          <div className="bg-white p-8 w-full max-w-2xl sm:rounded-lg shadow-2xl relative print:shadow-none print:w-full print:max-w-full">
            <button 
              onClick={() => setReceiptFinance(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 print:hidden"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center border-b-2 border-gray-200 pb-4 mb-6">
              <h2 className="text-3xl font-extrabold text-blue-900 uppercase tracking-widest">EduSaaS</h2>
              <p className="text-gray-500 mt-1">Reçu de Caisse - Frais Scolaires</p>
            </div>

            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-sm text-gray-500">Date d'émission :</p>
                <p className="font-semibold">{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">N° de Reçu</p>
                <p className="font-bold text-lg text-blue-900">FAC-{receiptFinance.id}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-100">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Informations de Facturation</h3>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <span className="text-xs text-gray-500 block">Nom de l'Élève</span>
                  <span className="font-medium text-gray-900">{receiptFinance.student}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Classe</span>
                  <span className="font-bold text-blue-700">{receiptFinance.grade}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-500 block">Motif du Paiement (Désignation)</span>
                  <span className="font-medium text-gray-900">{receiptFinance.type}</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-md p-4 mb-8">
              <div className="flex justify-between py-2 text-gray-600">
                <span className="font-semibold">Montant dû :</span>
                <span className="font-bold text-lg">{receiptFinance.amount}</span>
              </div>
              
              <div className={`flex justify-between border-t pt-4 mt-2 font-bold text-lg rounded p-3 ${receiptFinance.status === 'Payé' ? 'bg-green-50' : 'bg-red-50'}`}>
                <span className={receiptFinance.status === 'Payé' ? 'text-green-800' : 'text-red-800'}>
                  {receiptFinance.status === 'Payé' ? 'Statut : RÉGLÉ' : 'Statut : IMPAYÉ'}
                </span>
                <span className={receiptFinance.status === 'Payé' ? 'text-green-800' : 'text-red-800'}>
                  {receiptFinance.status === 'Payé' ? receiptFinance.amount : 'Reste à payer'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-12 pt-8 border-t">
              <div className="flex items-center text-gray-500 text-sm">
                <FileText className="w-5 h-5 mr-2" /> Document généré par EduSaaS
              </div>
              <div className="text-center">
                <div className="w-40 border-b border-gray-400 mb-2 h-16"></div>
                <p className="text-xs text-gray-500 uppercase">Signature de la Caisse</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4 print:hidden">
              <button 
                onClick={() => {
                  window.print();
                  setReceiptFinance(null);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 shadow flex items-center"
              >
                <Printer className="w-5 h-5 mr-2" /> Lancer l'impression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
