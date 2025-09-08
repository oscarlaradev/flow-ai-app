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
  prompt: `Eres un experto en interpretar descripciones de diagramas de flujo en lenguaje natural y convertirlas a una estructura JSON de nodos y aristas.

INSTRUCCIONES:
1.  **Analiza la Descripción**: Lee la descripción en lenguaje natural proporcionada por el usuario.
2.  **Identifica Nodos**: Extrae cada paso, acción, decisión, inicio o fin como un nodo.
3.  **Asigna Tipos de Nodo**:
    *   Usa 'start/end' para los puntos de inicio y fin del proceso.
    *   Usa 'process' para acciones o pasos (ej: "hacer algo", "limpiar material").
    *   Usa 'decision' para preguntas que dividen el flujo (ej: "¿funciona?", "¿está completo?").
4.  **Genera IDs Únicos**: Asigna un ID único y secuencial a cada nodo (ej: "nodo-1", "nodo-2").
5.  **Crea Aristas (Conexiones)**: Conecta los nodos basándote en la secuencia del flujo.
    *   Si una decisión tiene diferentes caminos (ej: "Si sí, ...", "Si no, ..."), asegúrate de que las aristas salgan del nodo de decisión y tengan la etiqueta correspondiente ("Sí", "No", etc.).
    *   Si varios caminos convergen en un solo punto, dirige las aristas al mismo nodo de destino.
6.  **Maneja Flujos Complejos**: Presta especial atención a las bifurcaciones y uniones para que el diagrama de flujo sea lógicamente correcto.

EJEMPLO:
-   **Descripción de entrada**: "El proceso comienza, luego se verifica si el sistema está activo. Si lo está, se ejecuta la tarea A. Si no, se reporta un error y el proceso termina. Después de la tarea A, el proceso también termina."
-   **Salida JSON esperada**:
    \`\`\`json
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
    \`\`\`

Ahora, analiza la siguiente descripción del usuario y genera la estructura JSON correspondiente.

Descripción del Usuario:
\`\`\`
{{{textDescription}}}
\`\`\`
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
