const SyntaxGuide = () => {
  const SyntaxItem = ({
    title,
    code,
  }: {
    title: string;
    code: string | string[];
  }) => (
    <li>
      <strong className="font-semibold">{title}:</strong>
      {Array.isArray(code) ? (
        code.map((c, i) => (
          <code
            key={i}
            className="ml-2 rounded bg-background p-1 font-code text-xs text-muted-foreground"
          >
            {c}
          </code>
        ))
      ) : (
        <code className="ml-2 rounded bg-background p-1 font-code text-xs text-muted-foreground">
          {code}
        </code>
      )}
    </li>
  );

  return (
    <ul className="space-y-3 text-sm text-foreground">
      <SyntaxItem title="Proceso" code="(Acción)" />
      <SyntaxItem title="Decisión" code="<Pregunta>" />
      <SyntaxItem title="Conexión" code="-> [Etiqueta] (Nodo)" />
      <SyntaxItem title="Entrada/Salida" code="[/Datos/]" />
      <SyntaxItem title="Documento" code="[[Reporte]]" />
      <SyntaxItem title="Comentario" code="// Esto se ignora" />
    </ul>
  );
};

export default SyntaxGuide;
