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
  prompt: `Eres un experto en generar diagramas de flujo en formato SVG a partir de una sintaxis de texto específica. Tu tarea es convertir la descripción proporcionada en un diagrama SVG limpio, válido y visualmente atractivo.

Descripción de Texto a convertir:
{{{textDescription}}}

INSTRUCCIONES PARA LA GENERACIÓN DEL SVG:
1.  **Salida Exclusiva**: Tu única salida debe ser el código SVG. No incluyas comentarios de Markdown, explicaciones, ni ningún texto fuera de la etiqueta <svg>.
2.  **Estilos CSS**: Utiliza los siguientes estilos. Los colores se basan en variables CSS para que el diagrama se adapte a temas claro/oscuro.
    *   **SVG Global**: \`font-family: sans-serif;\`
    *   **Nodos (rect, ellipse, path para diamante)**: \`fill: hsl(var(--secondary)); stroke: hsl(var(--primary)); stroke-width: 2px;\`
    *   **Texto dentro de Nodos**: \`fill: hsl(var(--secondary-foreground)); font-size: 14px; text-anchor: middle; dominant-baseline: central;\`
    *   **Líneas de Conexión**: \`stroke: hsl(var(--accent-foreground)); stroke-width: 2px; marker-end: url(#arrowhead);\`
    *   **Punta de Flecha**: \`fill: hsl(var(--accent-foreground));\`
    *   **Etiquetas de Conexión**: \`fill: hsl(var(--muted-foreground)); font-size: 12px; text-anchor: middle;\`

3.  **Elementos del Diagrama y Diseño**:
    *   **Nodos**: Usa \`<rect>\` para procesos (con esquinas redondeadas, \`rx="8"\`), \`<ellipse>\` para inicio/fin, y \`<path>\` con forma de diamante para decisiones.
    *   **Texto**: El texto dentro de los nodos debe estar centrado. Si es muy largo, divídelo en varias líneas usando \`<tspan>\` con un espaciado adecuado (\`dy="1.2em"\`).
    *   **Conectores**: Dibuja flechas con \`<path>\`. Asegúrate de que apunten correctamente a los bordes de los nodos.
    *   **Diseño**: Calcula un diseño lógico y espaciado. Los nodos no deben solaparse. Define un \`viewBox\` en la etiqueta \`<svg>\` que encaje todo el diagrama con un margen de al menos 20px.

4.  **Definición de la Punta de Flecha**: Incluye esta definición estándar dentro de una sección \`<defs>\` en tu SVG:
    \`\`\`xml
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto" markerUnits="strokeWidth">
        <polygon points="0 0, 10 3.5, 0 7" />
      </marker>
    </defs>
    \`\`\`

Tu objetivo es producir un SVG impecable y funcional basado en el texto del usuario. Analiza la estructura del texto y genera el diagrama correspondiente.`,
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
