import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Adresse email invalide' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
});

export const registerSchema = z.object({
  schoolName: z
    .string()
    .min(3, { message: "Le nom de l'établissement doit contenir au moins 3 caractères" })
    .max(100, { message: "Le nom de l'établissement ne peut dépasser 100 caractères" })
    .trim(),
  fullName: z
    .string()
    .min(2, { message: 'Votre nom complet doit contenir au moins 2 caractères' })
    .max(100, { message: 'Votre nom ne peut dépasser 100 caractères' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Adresse email invalide' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
