import { z } from 'zod';

export const interviewSchema = z.object({
  interviewDate: z.string().nonempty('Interview date is required'),
  result: z.string().optional(),
  salaryExpectation: z.string().optional(),
  salaryType: z.enum(['monthly', 'yearly']),
  strength: z.string().optional(),
  weakness: z.string().optional(),
  background: z.string().optional(),
  skill: z.string().optional(),
  yearsExp: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
      { message: 'Years of experience must be a non-negative number' }
    ),
  note: z.string().optional(),
});

export type InterviewFormData = z.infer<typeof interviewSchema>;
