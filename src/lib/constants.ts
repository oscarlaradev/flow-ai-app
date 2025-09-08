export const EXAMPLE_FLOW = {
  id: 'ejemplo-general',
  name: 'Ejemplo General',
  content: `// Proceso de decisión para salir
((Inicio))
-> (Revisar el clima)
-> <¿Está lloviendo?>
  -[Sí]-> (Coger un paraguas)
  -[No]-> (Dejar el paraguas)
-> (Salir de casa)
-> ((Fin))
`,
};
