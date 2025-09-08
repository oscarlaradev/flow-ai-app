"use client";

import { Button } from "@/components/ui/button";
import { Eye, Sparkles, Download, Loader2, RefreshCw } from "lucide-react";

interface HeaderProps {
  onGenerate: () => void;
  onExampleChange: () => void;
  onExport: () => void;
  isLoading: boolean;
}

const Header = ({ onGenerate, onExampleChange, onExport, isLoading }: HeaderProps) => {

  return (
    <header className="flex flex-col items-center justify-between gap-4 rounded-lg border bg-card p-4 sm:flex-row">
      <div className="flex items-center gap-3 self-start">
        <Eye className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">
          Flow<span className="text-primary">AI</span>
        </h1>
      </div>
      <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
        <Button
          variant="outline"
          onClick={onExampleChange}
          className="w-full sm:w-auto"
        >
          <RefreshCw />
          <span>Cargar Ejemplo</span>
        </Button>
        <div className="flex items-center gap-2">
          <Button
            onClick={onGenerate}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles />
            )}
            <span>Generar</span>
          </Button>
          <Button variant="outline" onClick={onExport} className="flex-1">
            <Download />
            <span>Exportar</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
