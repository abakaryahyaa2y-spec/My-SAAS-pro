'use server';
import { financeSchema, FinanceInput } from '@/lib/validations/finance';

export async function createFinanceAction(input: FinanceInput) {
  const validation = financeSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: 'Erreur de validation financière',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    message: 'Transaction financière validée avec succès',
    data: {
      id: 'fin_' + Math.floor(Math.random() * 10000),
      ...validation.data,
      createdAt: new Date().toISOString(),
    },
  };
}
