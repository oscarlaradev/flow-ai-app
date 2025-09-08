export const EXAMPLE_FLOWS = [
  {
    id: 'algoritmo-simple',
    name: 'Algoritmo Simple',
    content: `// Algoritmo para hacer café
((Inicio))
-> (Hervir agua)
-> (Poner café en una taza)
-> (Verter agua caliente)
-> <¿Añadir azúcar?>
  -[Sí]-> (Añadir azúcar)
  -[No]-> (Remover)
-> (Remover)
-> ((Fin))
`,
  },
  {
    id: 'proceso-desarrollo',
    name: 'Proceso de Desarrollo',
    content: `// Flujo de desarrollo de una nueva función
((Inicio))
-> (Analizar requisitos)
-> (Diseñar la solución)
-> (Escribir el código)
-> <¿Pasa las pruebas?>
  -[No]-> (Corregir errores)
  -[Sí]-> (Hacer 'commit' de los cambios)
-> (Hacer 'commit' de los cambios)
-> (Desplegar a producción)
-> ((Fin))
`,
  },
  {
    id: 'resolucion-problemas',
    name: 'Resolución de Problemas',
    content: `// Proceso para solucionar un bug
((Inicio))
-> (Identificar el bug)
-> (Reproducir el bug)
-> <¿Es reproducible?>
  -[No]-> (Añadir más 'logs') -> (Identificar el bug)
  -[Sí]-> (Buscar la causa raíz)
-> (Buscar la causa raíz)
-> (Implementar una solución)
-> (Probar la solución)
-> ((Fin))
`,
  },
];
