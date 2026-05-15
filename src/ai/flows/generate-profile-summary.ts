'use server';
/**
 * @fileOverview A Genkit flow for generating an ATS-optimized profile summary for a German CV.
 *
 * - generateProfileSummary - A function that handles the profile summary generation process.
 * - GenerateProfileSummaryInput - The input type for the generateProfileSummary function.
 * - GenerateProfileSummaryOutput - The return type for the generateProfileSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProfileSummaryInputSchema = z.object({
  experience: z
    .string()
    .describe('A detailed summary of the user\'s professional experience.'),
  skills: z
    .string()
    .describe('A list or description of the user\'s technical and professional skills.'),
  targetRole: z
    .string()
    .optional()
    .describe(
      'The target job role for which the CV is being prepared, if specified.'
    ),
  germanCVGuidelines: z
    .string()
    .describe(
      'Comprehensive guidelines for German CVs, including ATS rules, formatting, and common pitfalls to avoid.'
    ),
});
export type GenerateProfileSummaryInput = z.infer<
  typeof GenerateProfileSummaryInputSchema
>;

const GenerateProfileSummaryOutputSchema = z
  .string()
  .describe('The generated ATS-optimized profile summary for a German CV.');
export type GenerateProfileSummaryOutput = z.infer<
  typeof GenerateProfileSummaryOutputSchema
>;

export async function generateProfileSummary(
  input: GenerateProfileSummaryInput
): Promise<GenerateProfileSummaryOutput> {
  return generateProfileSummaryFlow(input);
}

const generateProfileSummaryPrompt = ai.definePrompt({
  name: 'generateProfileSummaryPrompt',
  input: { schema: GenerateProfileSummaryInputSchema },
  output: { schema: GenerateProfileSummaryOutputSchema },
  prompt: `You are an expert career advisor specializing in crafting ATS-optimized CVs for the German job market.
Your task is to generate a concise, compelling, and ATS-friendly profile summary for a German CV based on the provided experience, skills, and German CV guidelines.

***Important German CV Guidelines & ATS Optimization Rules:***
{{{germanCVGuidelines}}}

***User's Professional Experience:***
{{{experience}}}

***User's Skills:***
{{{skills}}}

{{#if targetRole}}
***Target Job Role:***
{{{targetRole}}}

Ensure the summary is highly relevant to this role.
{{/if}}

Based on the information above, generate a professional, ATS-optimized profile summary suitable for a German CV. The summary should be approximately 3-5 sentences long, highlight key qualifications, achievements, and skills, and align with German recruitment expectations and ATS best practices. Avoid vague phrases, unexplained gaps, and exaggerated language levels. Focus on quantifiable achievements where possible and use language commonly found in German job descriptions for the target role.
`,
});

const generateProfileSummaryFlow = ai.defineFlow(
  {
    name: 'generateProfileSummaryFlow',
    inputSchema: GenerateProfileSummaryInputSchema,
    outputSchema: GenerateProfileSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await generateProfileSummaryPrompt(input);
    return output!;
  }
);
