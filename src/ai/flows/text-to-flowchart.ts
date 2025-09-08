'use server';

/**
 * @fileOverview Un agente de IA que convierte descripciones de texto de diagramas de flujo en una estructura de datos JSON.
 *
 * - textToFlowchart - Una función que convierte la descripción textual de un diagrama de flujo en una estructura JSON.
 */

import {ai} from '@/ai/genkit';
import {
  TextToFlowchartInputSchema,
  TextToFlowchartOutputSchema,
  type TextToFlowchartInput,
  type TextToFlowchartOutput,
} from '@/ai/types/flowchart';

export type {
  TextToFlowchartInput,
  TextToFlowchartOutput,
  FlowchartNode,
  FlowchartEdge,
} from '@/ai/types/flowchart';

export async function textToFlowchart(
  input: TextToFlowchartInput
): Promise<TextToFlowchartOutput> {
  return textToFlowchartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'textToFlowchartPrompt',
  input: {schema: TextToFlowchartInputSchema},
  output: {schema: TextToFlowchartOutputSchema},
  prompt: `Eres un experto en interpretar descripciones textuales de diagramas de flujo y convertirlas en una estructura de datos JSON. Tu tarea es analizar el texto proporcionado y generar una lista de nodos y conexiones (aristas) que representen el diagrama.

Descripción de Texto a convertir:
\`\`\`
{{{textDescription}}}
\`\`\`

INSTRUCCIONES PARA LA GENERACIÓN DEL JSON:
1.  **Identificadores de Nodos**: Asigna un ID único a cada nodo (por ejemplo, "nodo-1", "nodo-2"). Sé consistente al referenciar estos IDs en las aristas.
2.  **Tipos de Nodos**:
    *   Usa el tipo \`start/end\` para la sintaxis \`((Texto))\`.
    *   Usa el tipo \`process\` para la sintaxis \`(Texto)\`.
    *   Usa el tipo \`decision\` para la sintaxis \`<¿Pregunta?>\`.
3.  **Etiquetas de Nodos**: El texto dentro de los paréntesis o corchetes debe ser el campo \`label\` del nodo.
4.  **Aristas (Conexiones)**:
    *   Cada \`->\` representa una arista. El campo \`from\` debe ser el ID del nodo anterior y \`to\` el ID del nodo siguiente.
    *   Para conexiones con etiquetas como \`-[Etiqueta]->\`, usa el campo opcional \`label\` en la arista.
5.  **Ignorar Comentarios**: Ignora cualquier línea que comience con \`//\`.

**Ejemplo de Conversión**:
Si el texto es:
\`\`\`
((Inicio)) -> <¿Funciona?>
<¿Funciona?> -[Sí]-> (Continuar)
<¿Funciona?> -[No]-> ((Fin))
\`\`\`

La salida JSON esperada sería:
\`\`\`json
{
  "nodes": [
    { "id": "nodo-1", "label": "Inicio", "type": "start/end" },
    { "id": "nodo-2", "label": "¿Funciona?", "type": "decision" },
    { "id": "nodo-3", "label": "Continuar", "type": "process" },
    { "id": "nodo-4", "label": "Fin", "type": "start/end" }
  ],
  "edges": [
    { "from": "nodo-1", "to": "nodo-2" },
    { "from": "nodo-2", "to": "nodo-3", "label": "Sí" },
    { "from": "nodo-2", "to": "nodo-4", "label": "No" }
  ]
}
\`\`\`

Analiza la descripción del usuario y genera la estructura JSON correspondiente. Asegúrate de que todos los nodos estén conectados correctamente según la descripción.`,
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
