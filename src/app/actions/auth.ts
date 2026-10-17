'use server';
import { loginSchema, registerSchema, LoginInput, RegisterInput } from '@/lib/validations/auth';

export async function loginAction(input: LoginInput) {
  const validation = loginSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: 'Données de connexion invalides',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  // Simulation de vérification (connecté à Supabase Auth en prod)
  return {
    success: true,
    message: 'Connexion réussie',
    email: validation.data.email,
  };
}

export async function registerAction(input: RegisterInput) {
  const validation = registerSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: "Erreur dans les champs d'inscription",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    message: 'Compte créé avec succès ! Veuillez vérifier votre boîte de réception pour valider votre adresse email.',
    data: {
      email: validation.data.email,
      schoolName: validation.data.schoolName,
      fullName: validation.data.fullName,
      requiresEmailVerification: true,
    },
  };
}
