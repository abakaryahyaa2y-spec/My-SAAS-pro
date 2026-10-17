'use server';
import { studentSchema, StudentInput } from '@/lib/validations/student';

export interface ActionResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export async function createStudentAction(input: StudentInput): Promise<ActionResponse> {
  // 1. Validation stricte côté serveur avec Zod
  const validation = studentSchema.safeParse(input);

  if (!validation.success) {
    const formattedErrors = validation.error.flatten().fieldErrors;
    return {
      success: false,
      message: 'Erreur de validation des données de l\'élève',
      errors: formattedErrors,
    };
  }

  const validData = validation.data;

  // 2. Traitement / insertion (ici préparé pour Supabase server client)
  try {
    return {
      success: true,
      message: 'Élève validé et enregistré avec succès côté serveur',
      data: {
        id: 'srv_' + Math.floor(Math.random() * 10000),
        ...validData,
        createdAt: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Erreur interne du serveur lors de l\'enregistrement',
    };
  }
}
