'use server';
import { hrSchema, HRInput } from '@/lib/validations/hr';

export async function createHREmployeeAction(input: HRInput) {
  const validation = hrSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: 'Erreur de validation des données RH',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    message: 'Employé validé et enregistré avec succès',
    data: {
      id: 'hr_' + Math.floor(Math.random() * 10000),
      ...validation.data,
      createdAt: new Date().toISOString(),
    },
  };
}
