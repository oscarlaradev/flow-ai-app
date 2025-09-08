'use server';

/**
 * @fileOverview Un agente de IA para la generación de diagramas de flujo.
 *
 * - textToFlowchart - Una función que genera un diagrama de flujo a partir de una descripción de texto.
 * - TextToFlowchartInput - El tipo de entrada para la función textToFlowchart.
 * - TextToFlowchartOutput - El tipo de retorno para la función textToFlowchart.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TextToFlowchartInputSchema = z.object({
  textDescription: z
    .string()
    .describe('Una descripción en texto del diagrama de flujo a generar.'),
});
export type TextToFlowchartInput = z.infer<typeof TextToFlowchartInputSchema>;

const TextToFlowchartOutputSchema = z.object({
  flowchartDiagram: z
    .string()
    .describe('El diagrama de flujo generado en formato SVG.'),
});
export type TextToFlowchartOutput = z.infer<typeof TextToFlowchartOutputSchema>;

export async function textToFlowchart(input: TextToFlowchartInput): Promise<TextToFlowchartOutput> {
  return textToFlowchartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'textToFlowchartPrompt',
  input: {schema: TextToFlowchartInputSchema},
  output: {schema: TextToFlowchartOutputSchema},
  prompt: `Eres un experto en generar diagramas de flujo a partir de descripciones de texto.

  Dada la siguiente descripción de texto de un diagrama de flujo, genera un diagrama de flujo en formato SVG.

  Descripción de Texto:
  {{textDescription}}

  El SVG debe estar bien formateado y ser visualmente atractivo.
  Asegúrate de incluir nodos, conectores y etiquetas para cada elemento en el diagrama de flujo.
  Cada uno de los nodos debe posicionarse de manera que el diagrama de flujo se pueda visualizar de forma clara y comprensible.
  Asegúrate de que la salida sea un SVG válido.
  `, 
});

const textToFlowchartFlow = ai.defineFlow(
  {
    name: 'textToFlowchartFlow',
    inputSchema: TextToFlowchartInputSchema,
    outputSchema: TextToFlowchartOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
