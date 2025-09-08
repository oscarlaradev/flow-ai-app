"use client";

import { useState } from "react";
import type { FC } from "react";
import { useToast } from "@/hooks/use-toast";
import { textToFlowchart } from "@/ai/flows/text-to-flowchart";
import Header from "@/components/flow-ai/header";
import EditorPanel from "@/components/flow-ai/editor-panel";
import DiagramPanel from "@/components/flow-ai/diagram-panel";
import { EXAMPLE_FLOWS } from "@/lib/constants";

const Home: FC = () => {
  const [text, setText] = useState<string>(EXAMPLE_FLOWS[0].content);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El campo de texto no puede estar vacío.",
      });
      return;
    }
    setIsLoading(true);
    setError("");
    setSvgContent("");

    try {
      const result = await textToFlowchart({ textDescription: text });
      if (result.flowchartDiagram) {
        setSvgContent(result.flowchartDiagram);
      } else {
        throw new Error("La IA no devolvió un diagrama de flujo válido.");
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error al generar el diagrama",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleChange = (value: string) => {
    const example = EXAMPLE_FLOWS.find((ex) => ex.id === value);
    if (example) {
      setText(example.content);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background p-4">
      <Header
        onGenerate={handleGenerate}
        onExampleChange={handleExampleChange}
        isLoading={isLoading}
      />
      <main className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <EditorPanel text={text} onTextChange={setText} />
        <DiagramPanel
          svgContent={svgContent}
          isLoading={isLoading}
          error={error}
          key={svgContent} // Re-mount component on new SVG to reset pan/zoom
        />
      </main>
    </div>
  );
};

export default Home;
