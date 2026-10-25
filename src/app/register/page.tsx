'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { registerAction } from '@/app/actions/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [schoolName, setSchoolName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    setGeneralError(null);
    setLoading(true);

    try {
      const result = await registerAction({
        schoolName,
        fullName,
        email,
        password,
      });

      if (!result.success) {
        setGeneralError(result.message || 'Erreur lors de la création du compte');
        if (result.errors) setErrors(result.errors);
        setLoading(false);
        return;
      }

      // Enregistrement de l'état temporaire nécessitant vérification email
      document.cookie = 'edusaas_demo_auth=true; path=/; max-age=86400';
      document.cookie = 'edusaas_demo_email_verified=false; path=/; max-age=86400';

      router.push('/verify-email?email=' + encodeURIComponent(email));
    } catch {
      setGeneralError('Une erreur réseau est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white font-bold shadow-md">
            E
          </div>
          <span className="text-3xl font-extrabold text-blue-900 tracking-tight">EduSaaS</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Inscrire votre établissement</h2>
        <p className="mt-2 text-sm text-green-700 font-semibold bg-green-50 inline-block px-3 py-1 rounded-full border border-green-200">
          🎁 3 jours d'essai gratuit sur toutes les formules
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          {generalError && (
            <div className="mb-5 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-red-700">{generalError}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom de l'établissement</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  placeholder="Collège Privé Excellence"
                />
              </div>
              {errors?.schoolName && (
                <p className="text-xs text-red-600 mt-1">{errors.schoolName[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nom complet du Directeur / Administrateur</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  placeholder="Jean Kouassi"
                />
              </div>
              {errors?.fullName && (
                <p className="text-xs text-red-600 mt-1">{errors.fullName[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse Email Officielle</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  placeholder="directeur@ecole.com"
                />
              </div>
              {errors?.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mot de passe (au moins 6 caractères)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  placeholder="••••••••"
                />
              </div>
              {errors?.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password[0]}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Création en cours...' : 'Démarrer l\'essai gratuit'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Déjà inscrit ?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
