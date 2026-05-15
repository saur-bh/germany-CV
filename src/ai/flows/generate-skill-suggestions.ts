'use server';
/**
 * @fileOverview A Genkit flow for generating skill suggestions based on job roles and experience.
 *
 * - generateSkillSuggestions - A function that generates skill suggestions.
 * - GenerateSkillSuggestionsInput - The input type for the generateSkillSuggestions function.
 * - GenerateSkillSuggestionsOutput - The return type for the generateSkillSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSkillSuggestionsInputSchema = z.object({
  jobRoles: z.array(z.string()).describe('A list of job roles the user has held or is targeting.').min(1, 'At least one job role is required.'),
  experience: z.string().describe('A detailed description of the user\'s professional experience and responsibilities.').min(50, 'Experience description should be at least 50 characters long.'),
});
export type GenerateSkillSuggestionsInput = z.infer<typeof GenerateSkillSuggestionsInputSchema>;

const GenerateSkillSuggestionsOutputSchema = z.object({
  skills: z.array(z.string()).describe('A list of technical and professional skills relevant to the provided job roles and experience, optimized for ATS and German job applications.'),
});
export type GenerateSkillSuggestionsOutput = z.infer<typeof GenerateSkillSuggestionsOutputSchema>;

export async function generateSkillSuggestions(input: GenerateSkillSuggestionsInput): Promise<GenerateSkillSuggestionsOutput> {
  return generateSkillSuggestionsFlow(input);
}

const generateSkillSuggestionsPrompt = ai.definePrompt({
  name: 'generateSkillSuggestionsPrompt',
  input: {schema: GenerateSkillSuggestionsInputSchema},
  output: {schema: GenerateSkillSuggestionsOutputSchema},
  prompt: `You are an AI assistant specialized in German CV optimization and ATS compatibility. Your task is to suggest relevant technical and professional skills based on a user's job roles and experience.

Focus on skills that are pertinent keywords for Applicant Tracking Systems (ATS) and highly valued in the German job market. Prioritize specific technical skills, transferable professional skills, and industry-specific competencies.

Avoid suggesting vague or generic skills. Provide only the most relevant and impactful skills.

Job Roles: 
{{#each jobRoles}}- {{{this}}}
{{/each}}

Experience: {{{experience}}}

Based on the above, suggest a concise list of key technical and professional skills.`,
});

const generateSkillSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateSkillSuggestionsFlow',
    inputSchema: GenerateSkillSuggestionsInputSchema,
    outputSchema: GenerateSkillSuggestionsOutputSchema,
  },
  async (input) => {
    const {output} = await generateSkillSuggestionsPrompt(input);
    return output!;
  }
);
