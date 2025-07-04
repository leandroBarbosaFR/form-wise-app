import { z } from "zod";

export const preRegistrationSchema = z.object({
  parent: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(5),
    address: z.string().min(1),
  }),
  children: z.array(
    z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      gender: z.enum(["FILLE", "GARÇON"]),
      birthDate: z.string().min(1),
      birthCity: z.string(),
      birthCountry: z.string(),
      currentSchool: z.string(),
      desiredClass: z.string(),
    })
  ),
  uploadedFiles: z.object({
    motivationLetterUrl: z.string().nullable(),
    schoolResultsUrl: z.string().nullable(),
    familyBookUrl: z.string().nullable(),
  }),
});

export type PreRegistrationFormData = z.infer<typeof preRegistrationSchema>;
