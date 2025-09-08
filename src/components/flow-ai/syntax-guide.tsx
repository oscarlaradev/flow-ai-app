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
      <SyntaxItem title="Process" code="(Action)" />
      <SyntaxItem title="Decision" code="<Question>" />
      <SyntaxItem title="Connection" code="-> [Label] (Node)" />
      <SyntaxItem title="I/O" code="[/Data/]" />
      <SyntaxItem title="Document" code="[[Report]]" />
      <SyntaxItem title="Comment" code="// This is ignored" />
    </ul>
  );
};

export default SyntaxGuide;
