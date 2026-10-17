'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  User, 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Briefcase, 
  IdCard, 
  Settings,
  CreditCard as BillingIcon
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Élèves & Inscriptions', href: '/dashboard/students', icon: Users },
  { name: 'Finances', href: '/dashboard/finances', icon: CreditCard },
  { name: 'RH & Paie', href: '/dashboard/hr', icon: Briefcase },
  { name: 'Cartes Scolaires', href: '/dashboard/cards', icon: IdCard },
  { name: 'Abonnement SaaS', href: '/dashboard/billing', icon: BillingIcon },
  { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
];

// Logo SVG personnalisé
const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 drop-shadow-md">
    <path d="M20 4L4 12L20 20L36 12L20 4Z" fill="url(#paint0_linear)"/>
    <path d="M4 18L20 26L36 18V24L20 32L4 24V18Z" fill="url(#paint1_linear)"/>
    <path d="M4 26L20 34L36 26V32L20 40L4 32V26Z" fill="url(#paint2_linear)"/>
    <defs>
      <linearGradient id="paint0_linear" x1="20" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" />
        <stop offset="1" stopColor="#e0f2fe" />
      </linearGradient>
      <linearGradient id="paint1_linear" x1="20" y1="18" x2="20" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#bae6fd" />
        <stop offset="1" stopColor="#7dd3fc" />
      </linearGradient>
      <linearGradient id="paint2_linear" x1="20" y1="26" x2="20" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="1" stopColor="#0284c7" />
      </linearGradient>
    </defs>
  </svg>
);

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-blue-900 text-white shadow-md">
      {/* Top Bar: Logo & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center">
            <Logo />
            <span className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              EduSaaS
            </span>
          </div>
          
          <div className="flex-1 max-w-lg mx-auto hidden md:block">
            <form className="w-full flex" action="#" method="GET">
              <div className="relative w-full text-blue-100 focus-within:text-gray-600">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4" aria-hidden="true" />
                </div>
                <input
                  id="search-field"
                  className="block w-full h-9 pl-10 pr-3 py-2 border-transparent bg-blue-800 rounded-md text-white placeholder-blue-300 focus:outline-none focus:bg-white focus:placeholder-gray-400 focus:text-gray-900 sm:text-sm transition-colors"
                  placeholder="Rechercher un élève, un paiement..."
                  type="search"
                  name="search"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-blue-200 hover:text-white focus:outline-none">
              <span className="sr-only">Notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <button
                onClick={() => {
                  document.cookie = 'edusaas_demo_auth=; path=/; max-age=0';
                  document.cookie = 'edusaas_demo_email_verified=; path=/; max-age=0';
                  window.location.href = '/login';
                }}
                title="Se déconnecter"
                className="text-xs bg-blue-950/60 hover:bg-blue-950 text-blue-200 hover:text-white px-2.5 py-1.5 rounded-md border border-blue-700/50 flex items-center gap-1 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'bg-blue-950 text-white' 
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
