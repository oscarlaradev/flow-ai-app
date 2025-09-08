const SyntaxGuide = () => {
  const GuideItem = ({
    title,
    description,
    example,
  }: {
    title: string;
    description: string;
    example: string;
  }) => (
    <li>
      <strong className="font-semibold text-foreground">{title}</strong>
      <p className="text-xs text-muted-foreground">{description}</p>
      <code className="mt-1 block rounded bg-muted px-2 py-1 font-code text-xs text-muted-foreground">
        {example}
      </code>
    </li>
  );

  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="mb-4 text-sm text-foreground">
        Describe tu diagrama de flujo con lenguaje natural. La IA interpretará tus
        instrucciones. Sé claro y directo.
      </p>
      <ul className="space-y-4">
        <GuideItem
          title="Describe el Inicio y Fin"
          description="Menciona explícitamente cuándo comienza y termina el proceso."
          example="El proceso inicia... y al final termina."
        />
        <GuideItem
          title="Define los Pasos o Acciones"
          description="Enumera las acciones secuencialmente."
          example="Primero, se recolectan los datos. Luego, se analizan."
        />
        <GuideItem
          title="Plantea las Decisiones"
          description="Usa 'si...' para indicar una bifurcación en el flujo. Especifica qué sucede en cada caso."
          example="Se comprueba si el usuario está registrado. Si es así, accede. Si no, va a la página de registro."
        />
        <GuideItem
          title="Indica las Conexiones"
          description="Describe cómo se conectan los pasos entre sí, especialmente después de una decisión."
          example="Después de registrarse, el usuario accede. Ambos caminos llevan al panel principal."
        />
      </ul>
    </div>
  );
};

export default SyntaxGuide;
