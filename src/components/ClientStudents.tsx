'use client';
import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Printer, X, CheckCircle } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, LocalStudent } from '@/lib/db';

export default function ClientStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [receiptStudent, setReceiptStudent] = useState<LocalStudent | null>(null);
  
  // Lecture réactive depuis la base de données locale (IndexedDB)
  const students = useLiveQuery(() => db.students.toArray()) || [];

  // Fonction pour ajouter un élève dans la DB locale
  const addMockStudent = async () => {
    try {
      const newStudent = {
        firstName: 'Nouvel',
        lastName: 'Élève ' + Math.floor(Math.random() * 100),
        birthDate: '15/05/2010',
        birthPlace: 'Abidjan',
        grade: 'Seconde C',
        status: 'Inscrit',
        enrollmentDate: new Date().toLocaleDateString('fr-FR'),
        syncStatus: 'pending_insert' as const,
        updatedAt: Date.now()
      };
      await db.students.add(newStudent);
      console.log('Élève ajouté avec succès en local.');
    } catch (error) {
      console.error('Erreur lors de l\'ajout :', error);
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await db.students.delete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  const filteredStudents = students.filter(student => 
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Wrapper global qui se cache lors de l'impression individuelle si un reçu est ouvert */}
      <div className={receiptStudent ? 'print:hidden' : ''}>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Élèves & Inscriptions</h1>
            <p className="mt-2 text-sm text-gray-700">
              Gérez la liste de tous les élèves inscrits dans l'établissement. (Mode Offline-First actif)
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-2">
            <button
              onClick={() => window.print()}
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <Printer className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
              Imprimer la liste
            </button>
            <button
              onClick={addMockStudent}
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nouvelle Inscription (Locale)
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-white p-4 shadow rounded-lg mb-6 gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Rechercher un élève..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nom complet</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Né(e) le / à</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Classe</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date d'inscription</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sync</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          Aucun élève trouvé. Cliquez sur "Nouvelle Inscription" pour en ajouter un.
                        </td>
                      </tr>
                    ) : null}
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                              {student.firstName[0]}{student.lastName[0]}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                              <div className="text-gray-500">ID: {student.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>{student.birthDate || 'N/A'}</div>
                          <div className="text-gray-400 text-xs">{student.birthPlace || 'N/A'}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{student.grade}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{student.enrollmentDate}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {student.syncStatus === 'synced' ? (
                             <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-green-100 text-green-800">Cloud</span>
                          ) : (
                             <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-yellow-100 text-yellow-800 animate-pulse">Local</span>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end gap-2 items-center">
                             <button 
                               onClick={() => setReceiptStudent(student)}
                               className="text-gray-600 hover:text-gray-900 bg-gray-100 p-1.5 rounded-md" 
                               title="Imprimer le reçu"
                             >
                               <Printer className="h-4 w-4" />
                             </button>
                             <button className="text-blue-600 hover:text-blue-900 ml-2" title="Éditer">
                               <Edit className="h-4 w-4" />
                             </button>
                             <button 
                               onClick={() => student.id && deleteStudent(student.id)} 
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

      {/* Reçu d'inscription (Visible uniquement lors du clic sur Imprimer un reçu) */}
      {receiptStudent && (
        <div className="fixed inset-0 z-50 flex justify-center bg-gray-900 bg-opacity-75 sm:py-10 print:static print:bg-white print:p-0 print:inset-auto">
          <div className="bg-white p-8 w-full max-w-2xl sm:rounded-lg shadow-2xl relative print:shadow-none print:w-full print:max-w-full">
            <button 
              onClick={() => setReceiptStudent(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 print:hidden"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center border-b-2 border-gray-200 pb-4 mb-6">
              <h2 className="text-3xl font-extrabold text-blue-900 uppercase tracking-widest">EduSaaS</h2>
              <p className="text-gray-500 mt-1">Reçu d'Inscription Scolaire</p>
            </div>

            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-sm text-gray-500">Date d'édition</p>
                <p className="font-semibold">{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Identifiant Élève</p>
                <p className="font-bold text-lg text-blue-900">N° {receiptStudent.id}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-100">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Informations de l'Élève</h3>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <span className="text-xs text-gray-500 block">Nom complet</span>
                  <span className="font-medium text-gray-900">{receiptStudent.firstName} {receiptStudent.lastName}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Date et Lieu de naissance</span>
                  <span className="font-medium text-gray-900">{receiptStudent.birthDate} à {receiptStudent.birthPlace}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Classe affectée</span>
                  <span className="font-bold text-blue-700">{receiptStudent.grade}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Date d'inscription</span>
                  <span className="font-medium text-gray-900">{receiptStudent.enrollmentDate}</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-md p-4 mb-8">
              <div className="flex justify-between border-b pb-2 mb-2 font-semibold text-gray-700">
                <span>Désignation</span>
                <span>Montant</span>
              </div>
              <div className="flex justify-between py-1 text-gray-600">
                <span>Frais d'inscription annuels</span>
                <span>15 000 F CFA</span>
              </div>
              <div className="flex justify-between py-1 text-gray-600">
                <span>Frais annexes (T-shirt, Macaron)</span>
                <span>5 000 F CFA</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2 font-bold text-lg bg-green-50 p-2 rounded">
                <span className="text-green-800">Somme Payée (Net)</span>
                <span className="text-green-800">20 000 F CFA</span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-12 border-t pt-8">
              <div className="flex items-center text-green-600 font-bold">
                <CheckCircle className="w-5 h-5 mr-2" /> Inscription Validée
              </div>
              <div className="text-center">
                <div className="w-40 border-b border-gray-400 mb-2 h-16"></div>
                <p className="text-xs text-gray-500 uppercase">Signature de l'Administration</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4 print:hidden">
              <button 
                onClick={() => {
                  window.print();
                  setReceiptStudent(null);
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
