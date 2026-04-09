import { z } from 'zod';

export const candidateSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').nonempty('Full name is required'),
  phone: z.string().trim().min(6, 'Enter a valid phone number').nonempty('Phone number is required'),
  gmail: z.string().trim().email('Enter a valid email address').nonempty('Email address is required'),
  linkCV: z.string().trim().optional(),
  level: z.enum(['Senior', 'Beginner', 'Newbie']),
  gender: z.enum(['Male', 'Female', 'Other']),
  interviewStatus: z.enum(['Confirmed', 'Rejected', 'No Response']),
});

export type CandidateFormData = z.infer<typeof candidateSchema>;
