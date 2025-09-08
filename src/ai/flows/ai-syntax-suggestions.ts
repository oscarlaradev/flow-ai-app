'use server';

/**
 * @fileOverview Un agente de IA que proporciona sugerencias de sintaxis para describir diagramas de flujo en texto simple.
 *
 * - getSyntaxSuggestion - Una función que proporciona sugerencias de sintaxis para describir diagramas de flujo.
 * - SyntaxSuggestionInput - El tipo de entrada para la función getSyntaxSuggestion.
 * - SyntaxSuggestionOutput - El tipo de retorno para la función getSyntaxSuggestion.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SyntaxSuggestionInputSchema = z.object({
  inputText: z
    .string()
    .describe('El texto de entrada actual que describe el diagrama de flujo.'),
});
export type SyntaxSuggestionInput = z.infer<typeof SyntaxSuggestionInputSchema>;

const SyntaxSuggestionOutputSchema = z.object({
  suggestion: z
    .string()
    .describe('La sugerencia de sintaxis de la IA para mejorar el texto de entrada.'),
});
export type SyntaxSuggestionOutput = z.infer<typeof SyntaxSuggestionOutputSchema>;

export async function getSyntaxSuggestion(input: SyntaxSuggestionInput): Promise<SyntaxSuggestionOutput> {
  return syntaxSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'syntaxSuggestionPrompt',
  input: {schema: SyntaxSuggestionInputSchema},
  output: {schema: SyntaxSuggestionOutputSchema},
  prompt: `Eres un asistente de IA que proporciona sugerencias útiles de sintaxis para describir diagramas de flujo utilizando un lenguaje simple basado en texto.

  Dado el siguiente texto de entrada, sugiere cómo el usuario puede mejorar la sintaxis para describir mejor el diagrama de flujo. Concéntrate en proporcionar sugerencias específicas y accionables.

  Texto de Entrada:
  {{inputText}}

  Sugerencia:`,
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
