'use server';
/**
 * @fileOverview A Genkit flow for refining professional experience bullet points.
 *
 * - refineExperienceBulletPoints - A function that refines professional experience text into ATS-optimized, action-oriented, and quantifiable bullet points, incorporating German CV best practices.
 * - RefineExperienceBulletPointsInput - The input type for the refineExperienceBulletPoints function.
 * - RefineExperienceBulletPointsOutput - The return type for the refineExperienceBulletPoints function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RefineExperienceBulletPointsInputSchema = z.object({
  experienceText: z
    .string()
    .describe('The raw professional experience text to be refined.'),
  jobTitle: z.string().describe('The job title for this experience.'),
  companyName: z.string().describe('The company name for this experience.'),
  duration: z.string().describe('The employment duration for this experience.'),
  germanCVGuidelines: z
    .string()
    .describe(
      'Specific German CV best practices and ATS optimization guidelines to follow. Examples include avoiding tables, icons, graphics, skill bars, vague phrases, unexplained gaps, and exaggerated language levels.'
    ),
});
export type RefineExperienceBulletPointsInput = z.infer<
  typeof RefineExperienceBulletPointsInputSchema
>;

const RefineExperienceBulletPointsOutputSchema = z
  .array(z.string())
  .describe('An array of refined, ATS-optimized bullet points.');
export type RefineExperienceBulletPointsOutput = z.infer<
  typeof RefineExperienceBulletPointsOutputSchema
>;

export async function refineExperienceBulletPoints(
  input: RefineExperienceBulletPointsInput
): Promise<RefineExperienceBulletPointsOutput> {
  return refineExperienceBulletPointsFlow(input);
}

const refineExperienceBulletPointsPrompt = ai.definePrompt({
  name: 'refineExperienceBulletPointsPrompt',
  input: { schema: RefineExperienceBulletPointsInputSchema },
  output: { schema: RefineExperienceBulletPointsOutputSchema },
  prompt: `You are an expert career advisor specializing in creating ATS-optimized CVs for the German job market.
Your task is to transform raw professional experience descriptions into concise, action-oriented, quantifiable bullet points that strictly adhere to German CV best practices.

For the position of '{{{jobTitle}}}' at '{{{companyName}}}' during '{{{duration}}}', refine the following raw experience text:

Raw Experience: """{{{experienceText}}}"""

Focus on the following:
- **Action-Oriented Verbs**: Start each bullet point with a strong, impactful action verb.
- **Quantifiable Achievements**: Whenever possible, include numbers, percentages, or other measurable results to demonstrate impact.
- **ATS Optimization**: Structure the bullet points to be easily parsed by Applicant Tracking Systems (ATS).
- **German CV Best Practices**: Incorporate the following specific guidelines:
  {{{germanCVGuidelines}}}
- **Avoid**: Tables, icons, graphics, skill bars, vague phrases, unexplained gaps, and exaggerated language levels.
- **Conciseness**: Keep bullet points brief and to the point, typically one to two lines.

Return an array of polished, ATS-optimized bullet points.`,
});

const refineExperienceBulletPointsFlow = ai.defineFlow(
  {
    name: 'refineExperienceBulletPointsFlow',
    inputSchema: RefineExperienceBulletPointsInputSchema,
    outputSchema: RefineExperienceBulletPointsOutputSchema,
  },
  async (input) => {
    const { output } = await refineExperienceBulletPointsPrompt(input);
    if (!output) {
      throw new Error('Failed to refine experience bullet points.');
    }
    return output;
  }
);
