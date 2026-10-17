import { z } from 'zod';

export const studentSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
    .max(50, { message: 'Le prénom ne peut dépasser 50 caractères' })
    .trim(),
  lastName: z
    .string()
    .min(2, { message: 'Le nom de famille doit contenir au moins 2 caractères' })
    .max(50, { message: 'Le nom de famille ne peut dépasser 50 caractères' })
    .trim(),
  birthDate: z
    .string()
    .min(5, { message: 'La date de naissance est obligatoire' })
    .trim(),
  birthPlace: z
    .string()
    .min(2, { message: 'Le lieu de naissance est obligatoire' })
    .max(100, { message: 'Le lieu de naissance ne peut dépasser 100 caractères' })
    .trim(),
  grade: z
    .string()
    .min(1, { message: 'La classe est obligatoire' })
    .trim(),
  status: z
    .enum(['Inscrit', 'En attente', 'Radié'])
    .default('Inscrit'),
  enrollmentDate: z
    .string()
    .optional(),
});

export type StudentInput = z.infer<typeof studentSchema>;
