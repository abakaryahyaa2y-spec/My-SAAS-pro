'use client';
import { useState } from 'react';
import { Check, X, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { processCheckoutAction } from '@/app/actions/subscription';

const tiers = [
  {
    name: 'Mensuel',
    price: '14 000',
    description: 'Facturé chaque mois.',
    features: [
      'Gestion illimitée des élèves',
      'Tableau de bord financier complet',
      'Génération de cartes scolaires (QR)',
      'Support par email',
    ],
  },
  {
    name: 'Trimestriel',
    price: '50 000',
    description: 'Facturé tous les 3 mois (Économisez 2 000 F).',
    features: [
      'Toutes les fonctionnalités du plan Mensuel',
      'Rapports d\'activité avancés',
      'Gestion des ressources humaines et paie',
      'Support prioritaire 24/7',
    ],
  },
  {
    name: 'Annuel',
    price: '140 000',
    description: 'Facturé une fois par an (Économisez 28 000 F).',
    features: [
      'Toutes les fonctionnalités du plan Trimestriel',
      'Nom de domaine personnalisé',
      'Formation sur site pour le personnel',
      'Account Manager dédié',
    ],
  },
];

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<'Mensuel' | 'Trimestriel' | 'Annuel' | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setLoading(true);
    setErrors(null);

    const res = await processCheckoutAction({
      planName: selectedPlan,
      email,
      phone,
      cardNumber,
      cardExpiry,
      cardCvc,
    });

    setLoading(false);

    if (!res.success) {
      if (res.errors) setErrors(res.errors);
      return;
    }

    setSuccessMessage(res.message || 'Essai gratuit activé !');
    setTimeout(() => {
      setSelectedPlan(null);
      setSuccessMessage(null);
      setEmail('');
      setPhone('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvc('');
    }, 2500);
  };

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="sm:flex sm:flex-col sm:align-center mb-12 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-center">Gérez votre abonnement SaaS</h1>
        <p className="mt-5 text-xl text-gray-500 sm:text-center">
          Choisissez le plan qui convient le mieux à la taille de votre établissement.
        </p>
      </div>

      <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.name} className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white flex flex-col">
            <div className="p-6 flex-1">
              <h2 className="text-lg leading-6 font-medium text-gray-900">{tier.name}</h2>
              <p className="mt-4 text-sm text-gray-500">{tier.description}</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">{tier.price} F</span>
                <span className="text-base font-medium text-gray-500"> / {tier.name.toLowerCase()}</span>
              </p>
              <p className="mt-2 text-sm text-green-600 font-medium bg-green-50 inline-block px-2 py-1 rounded-md">
                3 jours d'essai gratuit
              </p>
              <button
                onClick={() => setSelectedPlan(tier.name as any)}
                className={`mt-6 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700 transition-colors ${
                  tier.name === 'Trimestriel' ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                }`}
              >
                Démarrer l'essai gratuit
              </button>
            </div>
            <div className="pt-6 pb-8 px-6">
              <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">Ce qui est inclus</h3>
              <ul role="list" className="mt-6 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                    <span className="text-sm text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Modale de Paiement (Checkout Modal) */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden relative">
            <div className="p-6">
              <button 
                onClick={() => setSelectedPlan(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Démarrer l'essai gratuit</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Plan sélectionné : <strong className="text-blue-600">{selectedPlan}</strong>
                </p>
                <div className="mt-3 p-3 bg-blue-50 text-blue-800 text-xs rounded-md text-left leading-relaxed">
                  <strong>Important :</strong> Votre essai gratuit dure 3 jours. Si vous n'annulez pas avant la fin de cette période, l'abonnement sera activé automatiquement. Vous pouvez annuler à tout moment sans frais pendant ces 3 jours.
                </div>
              </div>

              {successMessage ? (
                <div className="p-6 text-center bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-green-800">{successMessage}</p>
                  <p className="text-xs text-green-600 mt-1">Validation serveur effectuée avec succès.</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleCheckout}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Adresse Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="directeur@ecole.com"
                    />
                    {errors?.email && <p className="text-xs text-red-600 mt-1">{errors.email[0]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="+225 01 02 03 04 05"
                    />
                    {errors?.phone && <p className="text-xs text-red-600 mt-1">{errors.phone[0]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Informations bancaires</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                    {errors?.cardNumber && <p className="text-xs text-red-600 mt-1">{errors.cardNumber[0]}</p>}

                    <div className="flex gap-4 mt-2">
                      <div className="w-1/2">
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="MM/AA"
                        />
                        {errors?.cardExpiry && <p className="text-xs text-red-600 mt-1">{errors.cardExpiry[0]}</p>}
                      </div>
                      <div className="w-1/2">
                        <input
                          type="text"
                          required
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="CVC"
                        />
                        {errors?.cardCvc && <p className="text-xs text-red-600 mt-1">{errors.cardCvc[0]}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Validation en cours...' : 'Confirmer l\'essai gratuit'}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3">
                      Validation serveur Zod & cryptage SSL actif.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
