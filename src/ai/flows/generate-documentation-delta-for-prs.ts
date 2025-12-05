'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating documentation deltas for pull requests.
 *
 * The flow takes the code changes in a pull request as input and automatically generates suggested documentation changes.
 * It exports:
 *   - `generateDocumentationDeltaForPRs`: The main function to trigger the flow.
 *   - `GenerateDocumentationDeltaForPRsInput`: The input type for the flow.
 *   - `GenerateDocumentationDeltaForPRsOutput`: The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDocumentationDeltaForPRsInputSchema = z.object({
  codeChanges: z
    .string()
    .describe("The code changes in the pull request."),
  existingDocumentation: z.string().optional().describe("The existing documentation."),
});

export type GenerateDocumentationDeltaForPRsInput = z.infer<
  typeof GenerateDocumentationDeltaForPRsInputSchema
>;

const GenerateDocumentationDeltaForPRsOutputSchema = z.object({
  suggestedDocumentationChanges: z
    .string()
    .describe("The suggested documentation changes based on the code changes."),
});

export type GenerateDocumentationDeltaForPRsOutput = z.infer<
  typeof GenerateDocumentationDeltaForPRsOutputSchema
>;

export async function generateDocumentationDeltaForPRs(
  input: GenerateDocumentationDeltaForPRsInput
): Promise<GenerateDocumentationDeltaForPRsOutput> {
  return generateDocumentationDeltaForPRsFlow(input);
}

const generateDocumentationDeltaForPRsPrompt = ai.definePrompt({
  name: 'generateDocumentationDeltaForPRsPrompt',
  input: {schema: GenerateDocumentationDeltaForPRsInputSchema},
  output: {schema: GenerateDocumentationDeltaForPRsOutputSchema},
  prompt: `You are an AI documentation assistant. Given the following code changes and existing documentation, generate suggested documentation changes.

Code Changes:
{{{codeChanges}}}

Existing Documentation:
{{{existingDocumentation}}}

Suggested Documentation Changes:
`,
});

const generateDocumentationDeltaForPRsFlow = ai.defineFlow(
  {
    name: 'generateDocumentationDeltaForPRsFlow',
    inputSchema: GenerateDocumentationDeltaForPRsInputSchema,
    outputSchema: GenerateDocumentationDeltaForPRsOutputSchema,
  },
  async input => {
    const {output} = await generateDocumentationDeltaForPRsPrompt(input);
    return output!;
  }
);
