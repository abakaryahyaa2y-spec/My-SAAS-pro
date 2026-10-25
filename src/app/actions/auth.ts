'use server';
import { cookies } from 'next/headers';
import { loginSchema, registerSchema, LoginInput, RegisterInput } from '@/lib/validations/auth';
import { createClient } from '@/lib/supabase/server';

export async function loginAction(input: LoginInput) {
  const validation = loginSchema.safeParse(input);

  if (!validation.success) {
    const errorMessages = Object.values(validation.error.flatten().fieldErrors).flat();
    return {
      success: false,
      message: errorMessages.join(', ') || 'Données de connexion invalides',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validation.data;
  const cookieStore = cookies();

  // Vérifier si de vraies clés Supabase sont configurées en production sur Vercel
  const hasRealSupabase = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('demo');

  if (hasRealSupabase) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Email ou mot de passe incorrect sur votre Supabase.',
        };
      }
    } catch (err: any) {
      console.error('Erreur Supabase Auth Login:', err);
      return {
        success: false,
        message: 'Impossible de joindre Supabase : ' + (err?.message || 'Erreur inconnue'),
      };
    }
  }

  // Définition de la session via cookie serveur sécurisé
  cookieStore.set('edusaas_demo_auth', 'true', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  cookieStore.set('edusaas_demo_email_verified', 'true', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return {
    success: true,
    message: 'Connexion réussie',
    email,
  };
}

export async function registerAction(input: RegisterInput) {
  const validation = registerSchema.safeParse(input);

  if (!validation.success) {
    const errorMessages = Object.values(validation.error.flatten().fieldErrors).flat();
    return {
      success: false,
      message: errorMessages.join(' • ') || "Erreur dans les champs d'inscription",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { schoolName, fullName, email, password } = validation.data;
  const cookieStore = cookies();

  // Vérifier si de vraies clés Supabase sont configurées
  const hasRealSupabase = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('demo');

  if (hasRealSupabase) {
    try {
      const supabase = createClient();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            school_name: schoolName,
            full_name: fullName,
          },
          emailRedirectTo: `${appUrl}/auth/callback`,
        },
      });

      if (error) {
        return {
          success: false,
          message: error.message || "Erreur renvoyée par Supabase lors de l'inscription.",
        };
      }
    } catch (err: any) {
      console.error('Erreur Supabase Auth SignUp:', err);
      return {
        success: false,
        message: "Erreur de connexion à Supabase : " + (err?.message || 'Vérifiez vos variables Vercel'),
      };
    }
  }

  // Définition de la session via cookie serveur sécurisé
  cookieStore.set('edusaas_demo_auth', 'true', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  cookieStore.set('edusaas_demo_email_verified', 'false', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return {
    success: true,
    message: 'Compte créé avec succès !',
    data: {
      email,
      schoolName,
      fullName,
      requiresEmailVerification: true,
    },
  };
}

export async function verifyEmailAction() {
  const cookieStore = cookies();
  cookieStore.set('edusaas_demo_auth', 'true', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  cookieStore.set('edusaas_demo_email_verified', 'true', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return { success: true };
}
