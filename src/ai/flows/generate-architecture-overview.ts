'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an architecture overview of a codebase.
 *
 * The flow takes codebase content as input and outputs a high-level architecture overview.
 * - generateArchitectureOverview - A function that triggers the architecture overview generation flow.
 * - GenerateArchitectureOverviewInput - The input type for the generateArchitectureOverview function.
 * - GenerateArchitectureOverviewOutput - The return type for the generateArchitectureOverview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArchitectureOverviewInputSchema = z.object({
  codebaseContent: z
    .string()
    .describe('The content of the codebase to generate an architecture overview for.'),
});
export type GenerateArchitectureOverviewInput = z.infer<typeof GenerateArchitectureOverviewInputSchema>;

const GenerateArchitectureOverviewOutputSchema = z.object({
  architectureOverview: z
    .string()
    .describe('A high-level architecture overview of the codebase.'),
});
export type GenerateArchitectureOverviewOutput = z.infer<typeof GenerateArchitectureOverviewOutputSchema>;

export async function generateArchitectureOverview(
  input: GenerateArchitectureOverviewInput
): Promise<GenerateArchitectureOverviewOutput> {
  return generateArchitectureOverviewFlow(input);
}

const architectureOverviewPrompt = ai.definePrompt({
  name: 'architectureOverviewPrompt',
  input: {schema: GenerateArchitectureOverviewInputSchema},
  output: {schema: GenerateArchitectureOverviewOutputSchema},
  prompt: `You are an expert software architect. Please analyze the following codebase content and generate a high-level architecture overview, explaining the main components, their relationships, and the overall structure.  Focus on clarity and conciseness, so a developer new to the project can quickly understand it.\n\nCodebase Content:\n{{{codebaseContent}}}`,
});

const generateArchitectureOverviewFlow = ai.defineFlow(
  {
    name: 'generateArchitectureOverviewFlow',
    inputSchema: GenerateArchitectureOverviewInputSchema,
    outputSchema: GenerateArchitectureOverviewOutputSchema,
  },
  async input => {
    const {output} = await architectureOverviewPrompt(input);
    return output!;
  }
);
