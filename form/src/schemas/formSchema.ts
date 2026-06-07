import { z } from "zod";

export type Form1Data = z.infer<typeof Form1Schema>;
export type Form2Data = z.infer<typeof Form2Schema>;
export type Form3Data = z.infer<typeof Form3Schema>;

export const Form1Schema = z.object({
  name: z.string().default(""),
  mail: z.string().default(""),
  age: z.number().int().positive().nullable().default(null),
  sex: z.number().int().positive().nullable().default(null),
});

export const Form2Schema = z.object({
  survey1: z.number().int().positive().nullable().default(null),
  survey2: z.number().int().positive().nullable().default(null),
  survey3: z.number().int().positive().nullable().default(null),
  survey4: z.number().int().positive().nullable().default(null),
});

export const Form3Schema = z.object({
  improvement: z.int().positive().nullable().default(null),
  opinion: z.string().default(""),
  recommend: z.number().int().positive().nullable().default(null),
});
