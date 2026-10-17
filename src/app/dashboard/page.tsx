'use client';
import { Users, UserPlus, CreditCard, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', paiements: 4000 },
  { name: 'Fév', paiements: 3000 },
  { name: 'Mar', paiements: 2000 },
  { name: 'Avr', paiements: 2780 },
  { name: 'Mai', paiements: 1890 },
  { name: 'Juin', paiements: 2390 },
  { name: 'Juil', paiements: 3490 },
];

const stats = [
  { name: 'Total Élèves', stat: '1,429', icon: Users, change: '+12%', changeType: 'positive' },
  { name: 'Nouvelles Inscriptions', stat: '43', icon: UserPlus, change: '+5.4%', changeType: 'positive' },
  { name: 'Scolarité Payée (Ce mois)', stat: '2,450,000 F', icon: CreditCard, change: '-3.2%', changeType: 'negative' },
  { name: 'Taux de recouvrement', stat: '85%', icon: TrendingUp, change: '+4.1%', changeType: 'positive' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl shadow-lg p-6 sm:p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight">Bonjour, Directeur 👋</h1>
          <p className="mt-2 text-blue-100 max-w-xl text-lg">
            Voici ce qui se passe dans votre établissement aujourd'hui. Vous avez 4 nouveaux paiements en attente de validation.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="bg-white text-blue-900 px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-50 transition-colors shadow-sm">
              Voir les paiements
            </button>
            <button className="bg-blue-800 text-white border border-blue-600 px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-900 transition-colors">
              Ajouter un élève
            </button>
          </div>
        </div>
        {/* Decorative background pattern */}
        <div className="absolute right-0 top-0 -mt-4 -mr-4 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute right-40 bottom-0 -mb-4 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 rounded-xl">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${
                  item.changeType === 'positive' ? 'bg-blue-50' : 'bg-red-50'
                }`}>
                  <item.icon className={`h-6 w-6 ${
                    item.changeType === 'positive' ? 'text-blue-600' : 'text-red-500'
                  }`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-xl font-bold text-gray-900">{item.stat}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50/50 px-5 py-3 border-t border-gray-100">
              <div className="text-sm">
                <span className={`font-semibold ${item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change}
                </span>
                <span className="text-gray-500"> par rapport au mois dernier</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Aperçu des Paiements</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} />
                <Bar dataKey="paiements" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Impayés Récents</h2>
          <div className="flow-root">
            <ul role="list" className="-my-5 divide-y divide-gray-200">
              {[
                { name: 'Kouassi Jean', classe: 'Terminale D', amount: '50 000 F' },
                { name: 'Bamba Ali', classe: '3ème 2', amount: '25 000 F' },
                { name: 'Diallo Awa', classe: 'Seconde C', amount: '75 000 F' },
                { name: 'Touré Fanta', classe: '6ème 4', amount: '15 000 F' },
                { name: 'Kone Moussa', classe: '1ère D', amount: '40 000 F' },
              ].map((person, idx) => (
                <li key={idx} className="py-4 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <UserPlus className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{person.name}</p>
                    <p className="text-sm text-gray-500 truncate">{person.classe}</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Reste à payer : {person.amount}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
