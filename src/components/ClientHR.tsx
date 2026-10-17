'use client';
import { useState } from 'react';
import { UserPlus, Trash2, Printer, X, FileText } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, LocalHR } from '@/lib/db';

export default function ClientHR() {
  const [payslipEmployee, setPayslipEmployee] = useState<LocalHR | null>(null);
  const hr = useLiveQuery(() => db.hr.toArray()) || [];

  const addMockEmployee = async () => {
    try {
      await db.hr.add({
        name: 'M. Professeur ' + Math.floor(Math.random() * 100),
        role: 'Professeur',
        salary: '250 000 F',
        status: 'Actif',
        hireDate: new Date().toLocaleDateString('fr-FR'),
        syncStatus: 'pending_insert',
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEmployee = async (id: string) => {
    await db.hr.delete(id);
  };

  return (
    <div>
      <div className={payslipEmployee ? 'print:hidden' : ''}>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Ressources Humaines & Paie</h1>
            <p className="mt-2 text-sm text-gray-700">
              Gérez votre personnel et suivez les fiches de paie. (Mode Offline-First actif)
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
              onClick={addMockEmployee}
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <UserPlus className="-ml-1 mr-2 h-5 w-5" />
              Ajouter un employé (Local)
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Employé</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Poste</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Salaire Mensuel</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date d'embauche</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sync</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {hr.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">
                          Aucun employé. Cliquez sur "Ajouter un employé" pour tester.
                        </td>
                      </tr>
                    ) : null}
                    {hr.map((person) => (
                      <tr key={person.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                              {person.name.charAt(3) || 'U'}
                            </div>
                            <span className="ml-3">{person.name}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{person.salary}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.hireDate}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            person.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {person.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.syncStatus === 'synced' ? (
                             <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-green-100 text-green-800">Cloud</span>
                          ) : (
                             <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-yellow-100 text-yellow-800 animate-pulse">Local</span>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end gap-2 items-center">
                             <button 
                               onClick={() => setPayslipEmployee(person)}
                               className="text-gray-600 hover:text-gray-900 bg-gray-100 p-1.5 rounded-md" 
                               title="Imprimer Fiche de Paie"
                             >
                               <Printer className="h-4 w-4" />
                             </button>
                             <button 
                               onClick={() => person.id && deleteEmployee(person.id)} 
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

      {/* Fiche de paie individuelle */}
      {payslipEmployee && (
        <div className="fixed inset-0 z-50 flex justify-center bg-gray-900 bg-opacity-75 sm:py-10 print:static print:bg-white print:p-0 print:inset-auto">
          <div className="bg-white p-8 w-full max-w-2xl sm:rounded-lg shadow-2xl relative print:shadow-none print:w-full print:max-w-full">
            <button 
              onClick={() => setPayslipEmployee(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 print:hidden"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center border-b-2 border-gray-200 pb-4 mb-6">
              <h2 className="text-3xl font-extrabold text-blue-900 uppercase tracking-widest">EduSaaS</h2>
              <p className="text-gray-500 mt-1">Fiche de Paie Mensuelle</p>
            </div>

            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-sm text-gray-500">Période :</p>
                <p className="font-semibold capitalize">{new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Matricule Employé</p>
                <p className="font-bold text-lg text-blue-900">RH-{payslipEmployee.id}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-100">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Informations de l'Employé</h3>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <span className="text-xs text-gray-500 block">Nom complet</span>
                  <span className="font-medium text-gray-900">{payslipEmployee.name}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Poste occupé</span>
                  <span className="font-medium text-gray-900">{payslipEmployee.role}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Date d'embauche</span>
                  <span className="font-medium text-gray-900">{payslipEmployee.hireDate}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Salaire de base</span>
                  <span className="font-bold text-blue-700">{payslipEmployee.salary}</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-md p-4 mb-8">
              <div className="flex justify-between border-b pb-2 mb-2 font-semibold text-gray-700">
                <span>Désignation</span>
                <span>Montant</span>
              </div>
              <div className="flex justify-between py-1 text-gray-600">
                <span>Salaire de base</span>
                <span>{payslipEmployee.salary}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-600">
                <span>Primes diverses</span>
                <span>0 F</span>
              </div>
              <div className="flex justify-between py-1 text-gray-600">
                <span>Retenues / Cotisations</span>
                <span>0 F</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2 font-bold text-lg">
                <span>Net à payer</span>
                <span className="text-blue-900">{payslipEmployee.salary}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-12 pt-8">
              <div className="flex items-center text-gray-500 text-sm">
                <FileText className="w-5 h-5 mr-2" /> Document généré numériquement
              </div>
              <div className="text-center">
                <div className="w-40 border-b border-gray-400 mb-2 h-16"></div>
                <p className="text-xs text-gray-500 uppercase">Signature Employeur</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4 print:hidden">
              <button 
                onClick={() => {
                  window.print();
                  setPayslipEmployee(null);
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
