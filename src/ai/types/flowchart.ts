import {z} from 'zod';

/**
 * @fileOverview Tipos y esquemas para la generación de diagramas de flujo.
 *
 * - FlowchartNode, FlowchartNodeSchema: Representa un nodo en el diagrama de flujo.
 * - FlowchartEdge, FlowchartEdgeSchema: Representa una conexión (arista) entre nodos.
 * - TextToFlowchartInput, TextToFlowchartInputSchema: El tipo de entrada para la función textToFlowchart.
 * - TextToFlowchartOutput, TextToFlowchartOutputSchema: El tipo de retorno, que contiene un array de nodos y aristas.
 */

export const FlowchartNodeSchema = z.object({
  id: z.string().describe('Identificador único para el nodo.'),
  label: z.string().describe('El texto que se mostrará dentro del nodo.'),
  type: z
    .enum(['process', 'decision', 'start/end'])
    .describe('El tipo de nodo.'),
});

export const FlowchartEdgeSchema = z.object({
  from: z.string().describe('El ID del nodo de origen.'),
  to: z.string().describe('El ID del nodo de destino.'),
  label: z.string().optional().describe('Etiqueta opcional para la conexión.'),
});

export const TextToFlowchartInputSchema = z.object({
  textDescription: z
    .string()
    .describe('Una descripción en texto del diagrama de flujo a generar.'),
});

export const TextToFlowchartOutputSchema = z.object({
  nodes: z
    .array(FlowchartNodeSchema)
    .describe('Una lista de todos los nodos en el diagrama.'),
  edges: z
    .array(FlowchartEdgeSchema)
    .describe('Una lista de todas las conexiones (aristas) entre nodos.'),
});

export type FlowchartNode = z.infer<typeof FlowchartNodeSchema>;
export type FlowchartEdge = z.infer<typeof FlowchartEdgeSchema>;
export type TextToFlowchartInput = z.infer<typeof TextToFlowchartInputSchema>;
export type TextToFlowchartOutput = z.infer<typeof TextToFlowchartOutputSchema>;
