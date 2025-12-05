'use server';

/**
 * @fileOverview Flow for automatically generating module-level READMEs.
 *
 * - generateModuleReadme - A function that generates a module-level README.
 * - GenerateModuleReadmeInput - The input type for the generateModuleReadme function.
 * - GenerateModuleReadmeOutput - The return type for the generateModuleReadme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateModuleReadmeInputSchema = z.object({
  moduleName: z.string().describe('The name of the module.'),
  moduleCode: z.string().describe('The code of the module.'),
  repoName: z.string().describe('The name of the repository the module belongs to'),
});
export type GenerateModuleReadmeInput = z.infer<typeof GenerateModuleReadmeInputSchema>;

const GenerateModuleReadmeOutputSchema = z.object({
  readmeContent: z.string().describe('The generated README content for the module.'),
});
export type GenerateModuleReadmeOutput = z.infer<typeof GenerateModuleReadmeOutputSchema>;

export async function generateModuleReadme(input: GenerateModuleReadmeInput): Promise<GenerateModuleReadmeOutput> {
  return generateModuleReadmeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateModuleReadmePrompt',
  input: {schema: GenerateModuleReadmeInputSchema},
  output: {schema: GenerateModuleReadmeOutputSchema},
  prompt: `You are an expert documentation writer, tasked with generating a module-level README file for a given module of code.

  The README should include a clear description of the module's purpose, its main functions and classes, and how to use it.
  Include code examples where appropriate.
  The README should be written in Markdown format.
  The repository name is {{{repoName}}}.

  Here is the module code:
  \`\`\`typescript
  {{{moduleCode}}}
  \`\`\`

  Module Name: {{{moduleName}}}
  `, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const generateModuleReadmeFlow = ai.defineFlow(
  {
    name: 'generateModuleReadmeFlow',
    inputSchema: GenerateModuleReadmeInputSchema,
    outputSchema: GenerateModuleReadmeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
