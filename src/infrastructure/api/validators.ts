import { z } from "zod";

export const listLeadersQuerySchema = z.object({
  year: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .refine((v) => v === undefined || Number.isFinite(v), {
      message: "year deve ser número",
    }),
  company: z.string().optional(),
});

export const getLeaderParamsSchema = z.object({ id: z.string().min(1) });

export const listKpisQuerySchema = z.object({
  leaderId: z.string().optional(),
  year: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .refine((v) => v === undefined || Number.isFinite(v), {
      message: "year deve ser número",
    }),
});


