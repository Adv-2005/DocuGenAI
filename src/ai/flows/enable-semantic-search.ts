'use server';

/**
 * @fileOverview Implements semantic search over codebase and documentation using natural language queries.
 *
 * - semanticSearch - A function that performs semantic search.
 * - SemanticSearchInput - The input type for the semanticSearch function.
 * - SemanticSearchOutput - The return type for the semanticSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SemanticSearchInputSchema = z.object({
  query: z.string().describe('The natural language query to search with.'),
  documents: z
    .array(z.string())
    .describe('The list of documents to search over.'),
});
export type SemanticSearchInput = z.infer<typeof SemanticSearchInputSchema>;

const SemanticSearchOutputSchema = z.object({
  results: z
    .array(z.string())
    .describe('The list of relevant documents based on the query.'),
});
export type SemanticSearchOutput = z.infer<typeof SemanticSearchOutputSchema>;

export async function semanticSearch(input: SemanticSearchInput): Promise<SemanticSearchOutput> {
  return semanticSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'semanticSearchPrompt',
  input: {schema: SemanticSearchInputSchema},
  output: {schema: SemanticSearchOutputSchema},
  prompt: `You are a search assistant helping users find relevant information in their codebase and documentation.

  Given the following query:
  {{query}}

  Search within the following documents and identify the most relevant ones:
  {{#each documents}}
  - {{{this}}}
  {{/each}}

  Return a list of the most relevant documents.
  `,
});

const semanticSearchFlow = ai.defineFlow(
  {
    name: 'semanticSearchFlow',
    inputSchema: SemanticSearchInputSchema,
    outputSchema: SemanticSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
