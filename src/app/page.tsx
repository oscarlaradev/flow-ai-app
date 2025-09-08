"use client";

import { useState, useEffect, useMemo } from "react";
import type { FC } from "react";
import { useToast } from "@/hooks/use-toast";
import { textToFlowchart, type TextToFlowchartOutput } from "@/ai/flows/text-to-flowchart";
import Header from "@/components/flow-ai/header";
import EditorPanel from "@/components/flow-ai/editor-panel";
import DiagramPanel from "@/components/flow-ai/diagram-panel";
import { EXAMPLE_FLOW } from "@/lib/constants";
import { generateSvgFromFlowData } from "@/lib/flow-renderer";


const Home: FC = () => {
  const [text, setText] = useState<string>("");
  const [flowData, setFlowData] = useState<TextToFlowchartOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  
  const svgContent = useMemo(() => {
    if (!flowData) return "";
    try {
      return generateSvgFromFlowData(flowData);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Error al renderizar el SVG: ${errorMessage}`);
      return "";
    }
  }, [flowData]);


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
    setFlowData(null);

    try {
      const result = await textToFlowchart({ textDescription: text });
      if (result && result.nodes && result.edges) {
        setFlowData(result);
      } else {
        throw new Error("La IA no devolvió una estructura de diagrama válida.");
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
    setFlowData(null);
  };
  
  const handleExport = () => {
    if (!svgContent) {
      toast({
        variant: 'destructive',
        title: 'No hay diagrama para exportar',
        description: 'Primero genera un diagrama antes de intentar exportarlo.',
      });
      return;
    }

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagrama.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

     toast({
      title: 'Exportación exitosa',
      description: 'Tu diagrama se ha descargado como "diagrama.svg".',
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-4 overflow-auto">
      <Header
        onGenerate={handleGenerate}
        onExampleChange={handleExampleChange}
        onExport={handleExport}
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
