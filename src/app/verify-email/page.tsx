'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, CheckCircle2, RefreshCw, ArrowRight, ShieldAlert } from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'votre adresse email';
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResendSuccess(true);
    }, 1200);
  };

  const handleSimulateVerification = () => {
    document.cookie = 'edusaas_demo_email_verified=true; path=/; max-age=86400';
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Mail className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Vérification de votre Email</h2>
          <p className="text-sm text-gray-600 mb-6">
            Pour sécuriser les dossiers de votre établissement, nous avons envoyé un lien de confirmation à l'adresse :
            <br />
            <strong className="text-blue-900 font-semibold">{email}</strong>
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left flex items-start gap-2 mb-6 text-xs text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Sécurité RLS active :</strong> L'accès aux élèves, finances et données sensibles du SaaS est restreint tant que l'email n'a pas été confirmé.
            </div>
          </div>

          {resendSuccess && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-xs p-3 rounded-md flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Un nouvel email de validation vient d'être envoyé !
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleSimulateVerification}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              J'ai cliqué sur le lien (Accéder au Dashboard)
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${resending ? 'animate-spin' : ''}`} />
              {resending ? 'Envoi en cours...' : 'Renvoyer l\'email de confirmation'}
            </button>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <Link href="/login" className="text-xs text-blue-600 hover:text-blue-500">
              Changer de compte ou retourner à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
