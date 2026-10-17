'use server';
import { checkoutSchema, CheckoutInput } from '@/lib/validations/subscription';

export async function processCheckoutAction(input: CheckoutInput) {
  // Validation Zod stricte côté serveur
  const validation = checkoutSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: 'Erreur lors de la validation des informations de paiement',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { planName, email, phone, cardNumber } = validation.data;

  // Calcul du montant selon le plan
  const pricingMap: Record<string, number> = {
    Mensuel: 14000,
    Trimestriel: 50000,
    Annuel: 140000,
  };

  const amount = pricingMap[planName] || 14000;
  const maskedCard = `•••• •••• •••• ${cardNumber.slice(-4)}`;

  return {
    success: true,
    message: `Période d'essai gratuit de 3 jours activée pour le plan ${planName} !`,
    data: {
      subscriptionId: 'sub_' + Math.floor(Math.random() * 100000),
      plan: planName,
      amountFcfa: amount,
      email,
      phone,
      card: maskedCard,
      trialStart: new Date().toISOString(),
      trialEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'trialing',
    },
  };
}
