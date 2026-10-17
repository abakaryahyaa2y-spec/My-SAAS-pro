import { z } from 'zod';

export const checkoutSchema = z.object({
  planName: z
    .enum(['Mensuel', 'Trimestriel', 'Annuel'], { 
      message: 'Le plan sélectionné doit être Mensuel, Trimestriel ou Annuel' 
    }),
  email: z
    .string()
    .email({ message: 'Adresse email invalide' })
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .min(8, { message: 'Numéro de téléphone trop court' })
    .max(20, { message: 'Numéro de téléphone trop long' })
    .regex(/^[+0-9\s.-]+$/, { message: 'Format de téléphone invalide' }),
  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ''))
    .refine((val) => /^[0-9]{15,19}$/.test(val), {
      message: 'Numéro de carte bancaire invalide (16 chiffres requis)',
    }),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, {
      message: "Format d'expiration invalide (MM/AA requis)",
    }),
  cardCvc: z
    .string()
    .regex(/^[0-9]{3,4}$/, {
      message: 'Code CVC invalide (3 ou 4 chiffres)',
    }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
