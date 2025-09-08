'use server';

/**
 * @fileOverview A flowchart generation AI agent.
 *
 * - textToFlowchart - A function that generates a flowchart from a text description.
 * - TextToFlowchartInput - The input type for the textToFlowchart function.
 * - TextToFlowchartOutput - The return type for the textToFlowchart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TextToFlowchartInputSchema = z.object({
  textDescription: z
    .string()
    .describe('A text description of the flowchart to generate.'),
});
export type TextToFlowchartInput = z.infer<typeof TextToFlowchartInputSchema>;

const TextToFlowchartOutputSchema = z.object({
  flowchartDiagram: z
    .string()
    .describe('The generated flowchart diagram in SVG format.'),
});
export type TextToFlowchartOutput = z.infer<typeof TextToFlowchartOutputSchema>;

export async function textToFlowchart(input: TextToFlowchartInput): Promise<TextToFlowchartOutput> {
  return textToFlowchartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'textToFlowchartPrompt',
  input: {schema: TextToFlowchartInputSchema},
  output: {schema: TextToFlowchartOutputSchema},
  prompt: `You are an expert in generating flowcharts from text descriptions.

  Given the following text description of a flowchart, generate a flowchart diagram in SVG format.

  Text Description:
  {{textDescription}}

  The SVG should be well-formatted and visually appealing.
  Make sure to include nodes, connectors, and labels for each element in the flowchart.
  Each of the nodes should be positioned in a way that the flowchart can be visualized in a clear and understandable manner.
  Ensure that the output is a valid SVG.
  `, // Make sure this is a valid prompt for generating SVG
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
