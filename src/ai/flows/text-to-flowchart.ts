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
  prompt: `Eres un experto en convertir descripciones en lenguaje natural a diagramas de flujo en formato JSON.

REGLAS:
-   **Nodos**: Identifica cada paso, decisión, inicio o fin como un nodo.
-   **Tipos de Nodo**:
    -   'start/end': Para el comienzo y el final.
    -   'process': Para acciones o tareas.
    -   'decision': Para preguntas que dividen el flujo.
-   **IDs**: Asigna IDs únicos y secuenciales (ej: "nodo-1", "nodo-2").
-   **Aristas**: Conecta los nodos en el orden del flujo.
    -   Las decisiones deben tener aristas con etiquetas (ej: "Sí", "No").

EJEMPLO:
-   **Entrada**: "El proceso comienza. Se verifica si el sistema está activo. Si sí, se ejecuta la tarea A. Si no, se reporta un error y el proceso termina. Después de la tarea A, el proceso también termina."
-   **Salida JSON esperada**:
    {
      "nodes": [
        { "id": "nodo-1", "label": "Inicio", "type": "start/end" },
        { "id": "nodo-2", "label": "¿Sistema activo?", "type": "decision" },
        { "id": "nodo-3", "label": "Ejecutar Tarea A", "type": "process" },
        { "id": "nodo-4", "label": "Reportar Error", "type": "process" },
        { "id": "nodo-5", "label": "Fin", "type": "start/end" }
      ],
      "edges": [
        { "from": "nodo-1", "to": "nodo-2" },
        { "from": "nodo-2", "to": "nodo-3", "label": "Sí" },
        { "from": "nodo-2", "to": "nodo-4", "label": "No" },
        { "from": "nodo-4", "to": "nodo-5" },
        { "from": "nodo-3", "to": "nodo-5" }
      ]
    }

Analiza la siguiente descripción y genera el JSON correspondiente.

Descripción del Usuario:
{{{textDescription}}}
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
    if (!output || !output.nodes || !output.edges) {
      throw new Error(
        'La IA no pudo procesar la descripción. Intenta ser más claro o descriptivo.'
      );
    }
    return output;
  }
);
