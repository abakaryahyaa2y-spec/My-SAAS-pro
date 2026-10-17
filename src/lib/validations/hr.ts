import { z } from 'zod';

export const hrSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom complet de l'employé doit contenir au moins 2 caractères" })
    .max(100, { message: 'Le nom ne peut dépasser 100 caractères' })
    .trim(),
  role: z
    .string()
    .min(2, { message: "L'intitulé du poste est obligatoire" })
    .max(50, { message: 'Le poste ne peut dépasser 50 caractères' })
    .trim(),
  salary: z
    .string()
    .min(1, { message: 'Le salaire mensuel est obligatoire' })
    .regex(/^[0-9\s]+(\s?F(\s?CFA)?)?$/, { message: 'Format de salaire invalide (ex: 250 000 F)' }),
  hireDate: z
    .string()
    .min(5, { message: "La date d'embauche est obligatoire" }),
  status: z
    .enum(['Actif', 'Inactif'], { message: "Le statut doit être 'Actif' ou 'Inactif'" })
    .default('Actif'),
});

export type HRInput = z.infer<typeof hrSchema>;
