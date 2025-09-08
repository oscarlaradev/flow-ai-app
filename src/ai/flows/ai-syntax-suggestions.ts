'use server';

/**
 * @fileOverview An AI agent that provides syntax suggestions for describing flowcharts in simple text.
 *
 * - getSyntaxSuggestion - A function that provides syntax suggestions for describing flowcharts.
 * - SyntaxSuggestionInput - The input type for the getSyntaxSuggestion function.
 * - SyntaxSuggestionOutput - The return type for the getSyntaxSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SyntaxSuggestionInputSchema = z.object({
  inputText: z
    .string()
    .describe('The current text input describing the flowchart.'),
});
export type SyntaxSuggestionInput = z.infer<typeof SyntaxSuggestionInputSchema>;

const SyntaxSuggestionOutputSchema = z.object({
  suggestion: z
    .string()
    .describe('The AI syntax suggestion to improve the input text.'),
});
export type SyntaxSuggestionOutput = z.infer<typeof SyntaxSuggestionOutputSchema>;

export async function getSyntaxSuggestion(input: SyntaxSuggestionInput): Promise<SyntaxSuggestionOutput> {
  return syntaxSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'syntaxSuggestionPrompt',
  input: {schema: SyntaxSuggestionInputSchema},
  output: {schema: SyntaxSuggestionOutputSchema},
  prompt: `You are an AI assistant that provides helpful syntax suggestions for describing flowcharts using a simple text-based language.

  Given the following input text, suggest how the user can improve the syntax to better describe the flowchart. Focus on providing specific and actionable suggestions.

  Input Text:
  {{inputText}}

  Suggestion:`,
});

const syntaxSuggestionFlow = ai.defineFlow(
  {
    name: 'syntaxSuggestionFlow',
    inputSchema: SyntaxSuggestionInputSchema,
    outputSchema: SyntaxSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
