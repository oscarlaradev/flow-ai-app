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
  prompt: `Eres un experto en generar diagramas de flujo en formato SVG a partir de descripciones de texto. Tu tarea es convertir la descripción proporcionada en un diagrama SVG limpio, válido y visualmente atractivo.

Descripción de Texto:
{{textDescription}}

DIRECTIVAS PARA LA GENERACIÓN DEL SVG:
1.  **Salida Obligatoria**: La salida debe ser exclusivamente un código SVG completo y válido. No incluyas comentarios, explicaciones ni ningún otro texto fuera de la etiqueta <svg>.
2.  **Estilo General**: Utiliza los siguientes estilos como base. Puedes ajustarlos si es necesario para mejorar la legibilidad.
    *   **Fondo**: No definas un fondo para el SVG, debe ser transparente.
    *   **Fuente**: Usa la fuente 'sans-serif'.
    *   **Colores**:
        *   Nodos (rect, ellipse): \`fill: hsl(var(--secondary)); stroke: hsl(var(--primary)); stroke-width: 2;\`
        *   Texto: \`fill: hsl(var(--secondary-foreground)); font-size: 14px;\`
        *   Conectores (path): \`stroke: hsl(var(--accent-foreground)); stroke-width: 2;\`
        *   Puntas de flecha (marker): \`fill: hsl(var(--accent-foreground));\`
3.  **Elementos del Diagrama**:
    *   **Nodos**: Usa etiquetas \`<rect>\` (para procesos), \`<ellipse>\` (para inicio/fin) o \`<path>\` con la forma de diamante (para decisiones).
        *   Los rectángulos deben tener esquinas redondeadas (\`rx="8"\`).
    *   **Texto**: Centra el texto dentro de cada nodo usando \`text-anchor="middle"\`. Asegúrate de que el texto se ajuste si es demasiado largo, dividiéndolo en varias líneas con etiquetas \`<tspan>\`.
    *   **Conectores**: Dibuja las flechas de conexión usando etiquetas \`<path>\`. Deben terminar con una punta de flecha.
4.  **Estructura y Posicionamiento**:
    *   Calcula un diseño lógico. Los nodos deben estar distribuidos uniformemente para evitar solapamientos y facilitar la lectura.
    *   Define un \`viewBox\` adecuado en la etiqueta \`<svg>\` que contenga todo el diagrama con un margen razonable.
5.  **Punta de Flecha**: Define una punta de flecha estándar dentro de una sección \`<defs>\` y aplícala a los conectores.
    \`\`\`xml
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" />
      </marker>
    </defs>
    \`\`\`
    Aplica este marcador a tus paths de conexión así: \`marker-end="url(#arrowhead)"\`.

Asegúrate de que el SVG final sea un único bloque de código XML bien formado, comenzando con \`<svg ...>\` y terminando con \`</svg>\`. Tu capacidad para seguir estas reglas es crucial.`,
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
