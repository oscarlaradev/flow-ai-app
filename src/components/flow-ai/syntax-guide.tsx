const SyntaxGuide = () => {
  const SyntaxItem = ({
    title,
    code,
    description,
  }: {
    title: string;
    code: string;
    description: string;
  }) => (
    <li>
      <div className="flex items-center justify-between">
        <strong className="font-semibold text-foreground">{title}</strong>
        <code className="rounded bg-muted px-2 py-1 font-code text-xs text-muted-foreground">
          {code}
        </code>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </li>
  );

  return (
    <div className="rounded-lg border bg-card p-4">
        <ul className="space-y-4">
            <SyntaxItem
                title="Nodo de Proceso"
                code="(Acción)"
                description="Representa una acción o un paso."
            />
            <SyntaxItem
                title="Nodo de Decisión"
                code="<¿Pregunta?>"
                description="Indica un punto donde el flujo se divide."
            />
            <SyntaxItem
                title="Conexión"
                code="-> (Nodo)"
                description="Conecta dos nodos en una dirección."
            />
             <SyntaxItem
                title="Conexión con Etiqueta"
                code="-[Etiqueta]->"
                description="Conexión con texto descriptivo."
            />
            <SyntaxItem
                title="Nodo de Inicio/Fin"
                code="((Texto))"
                description="Marca el comienzo o el final del flujo."
            />
             <SyntaxItem
                title="Comentarios"
                code="// comentario"
                description="Texto que será ignorado por el generador."
            />
        </ul>
    </div>
  );
};

export default SyntaxGuide;
