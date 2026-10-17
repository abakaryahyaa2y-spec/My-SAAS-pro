'use client';
import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';

const mockStudent = {
  id: 'ELV-0014',
  firstName: 'Jean',
  lastName: 'Kouassi',
  grade: 'Terminale D',
  dob: '14 Mars 2010',
  school: 'Collège Excellence',
};

export default function CardsPage() {
  return (
    <div>
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Cartes Scolaires & QR Code</h1>
          <p className="mt-2 text-sm text-gray-700">
            Générez et imprimez les cartes scolaires des élèves avec leur code QR unique.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Printer className="-ml-1 mr-2 h-5 w-5" />
            Imprimer le lot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Exemple de Carte Scolaire */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-sm">
          <div className="bg-blue-900 text-white text-center py-4">
            <h2 className="font-bold text-lg">{mockStudent.school}</h2>
            <p className="text-xs text-blue-200">Année Scolaire 2026-2027</p>
          </div>
          <div className="p-5 flex flex-col items-center relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white -mt-12 shadow-sm flex items-center justify-center text-gray-500 overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Jean+Kouassi&background=random&size=100" alt="Avatar" />
            </div>
            
            <div className="mt-4 text-center w-full">
              <h3 className="text-xl font-bold text-gray-900">{mockStudent.lastName} {mockStudent.firstName}</h3>
              <p className="text-blue-600 font-semibold mt-1">{mockStudent.grade}</p>
              
              <div className="mt-4 text-sm text-gray-600 space-y-1 text-left px-4">
                <p><strong>Matricule:</strong> {mockStudent.id}</p>
                <p><strong>Né(e) le:</strong> {mockStudent.dob}</p>
              </div>
            </div>

            <div className="mt-6 p-2 bg-gray-50 rounded-lg">
              <QRCodeSVG 
                value={`https://edusaas.com/verify/${mockStudent.id}`} 
                size={96}
                level="M"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Scannez pour vérifier la validité</p>
          </div>
        </div>
      </div>
    </div>
  );
}
