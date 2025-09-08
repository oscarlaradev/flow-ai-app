"use client";

import { useState, useEffect } from "react";
import type { FC } from "react";
import { useToast } from "@/hooks/use-toast";
import { textToFlowchart } from "@/ai/flows/text-to-flowchart";
import Header from "@/components/flow-ai/header";
import EditorPanel from "@/components/flow-ai/editor-panel";
import DiagramPanel from "@/components/flow-ai/diagram-panel";
import { EXAMPLE_FLOW } from "@/lib/constants";

const Home: FC = () => {
  const [text, setText] = useState<string>("");
  const [svgContent, setSvgContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    setText(EXAMPLE_FLOW.content);
  }, []);

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
        description: "La IA no pudo procesar la descripción. Intenta simplificar el texto o revisar la sintaxis.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleChange = () => {
    setText(EXAMPLE_FLOW.content);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-4 overflow-auto">
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
          key={svgContent} 
        />
      </main>
    </div>
  );
};

export default Home;
