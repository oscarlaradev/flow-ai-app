"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXAMPLE_FLOWS } from "@/lib/constants";
import { Eye, Sparkles, Download, Loader2 } from "lucide-react";

interface HeaderProps {
  onGenerate: () => void;
  onExampleChange: (value: string) => void;
  isLoading: boolean;
}

const Header = ({ onGenerate, onExampleChange, isLoading }: HeaderProps) => {
  const handleExport = () => {
    // Placeholder for export functionality
    alert("Export functionality is not yet implemented.");
  };

  return (
    <header className="flex flex-col items-center justify-between gap-4 rounded-lg border bg-card p-4 sm:flex-row">
      <div className="flex items-center gap-3 self-start">
        <Eye className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">
          Flow<span className="text-primary">AI</span>
        </h1>
      </div>
      <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
        <Select onValueChange={onExampleChange} defaultValue={EXAMPLE_FLOWS[0].id}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Load Example" />
          </SelectTrigger>
          <SelectContent>
            {EXAMPLE_FLOWS.map((example) => (
              <SelectItem key={example.id} value={example.id}>
                {example.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Button
            onClick={onGenerate}
            disabled={isLoading}
            className="flex-1 bg-primary hover:bg-accent"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles />
            )}
            <span>Generate</span>
          </Button>
          <Button variant="outline" onClick={handleExport} className="flex-1">
            <Download />
            <span>Export</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
