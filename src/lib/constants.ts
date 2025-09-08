export const EXAMPLE_FLOW = {
  id: 'ejemplo-general',
  name: 'Ejemplo General',
  content: `// Proceso para decidir qué comer
((Inicio))
-> (Tengo hambre)
-> <¿Hay comida en casa?>
  -[Sí]-> (Revisar el refrigerador)
  -[No]-> <¿Quiero salir?>
    -[Sí]-> (Ir a un restaurante)
    -[No]-> (Pedir comida a domicilio)
-> (Comer)
-> ((Fin))
`,
};
