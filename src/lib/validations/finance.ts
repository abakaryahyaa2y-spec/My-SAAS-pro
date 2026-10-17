import { z } from 'zod';

export const financeSchema = z.object({
  student: z
    .string()
    .min(2, { message: "Le nom de l'élève doit contenir au moins 2 caractères" })
    .trim(),
  grade: z
    .string()
    .min(1, { message: 'La classe est requise' })
    .trim(),
  amount: z
    .string()
    .min(1, { message: 'Le montant est obligatoire' })
    .regex(/^[0-9\s]+(\s?F(\s?CFA)?)?$/, { message: 'Format de montant invalide (ex: 50 000 F)' }),
  dueDate: z
    .string()
    .min(5, { message: "La date d'échéance est obligatoire" }),
  status: z
    .enum(['Payé', 'Impayé'], { message: "Le statut doit être 'Payé' ou 'Impayé'" })
    .default('Impayé'),
  type: z
    .string()
    .min(2, { message: 'Le type de frais est obligatoire' })
    .default('Scolarité'),
});

export type FinanceInput = z.infer<typeof financeSchema>;
