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
  
  const handleExport = (format: 'svg' | 'png') => {
    if (!svgContent) {
      toast({
        variant: 'destructive',
        title: 'No hay diagrama para exportar',
        description: 'Primero genera un diagrama antes de intentar exportarlo.',
      });
      return;
    }

    if (format === 'svg') {
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
    } else if (format === 'png') {
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const img = new Image();
        
        const svgElement = new DOMParser().parseFromString(svgContent, "image/svg+xml").querySelector("svg");
        if (!svgElement) return;

        const width = parseInt(svgElement.getAttribute('width') || '800', 10);
        const height = parseInt(svgElement.getAttribute('height') || '600', 10);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const pngUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = 'diagrama.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(pngUrl);
                 toast({
                  title: 'Exportación exitosa',
                  description: 'Tu diagrama se ha descargado como "diagrama.png".',
                });
            }
            URL.revokeObjectURL(svgUrl);
        };
        img.onerror = () => {
             toast({
                variant: 'destructive',
                title: 'Error al exportar PNG',
                description: 'No se pudo convertir el SVG a PNG.',
            });
            URL.revokeObjectURL(svgUrl);
        }
        img.src = svgUrl;
    }
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
