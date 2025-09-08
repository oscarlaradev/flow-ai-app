"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import SyntaxGuide from "./syntax-guide";

interface EditorPanelProps {
  text: string;
  onTextChange: (text: string) => void;
}

const EditorPanel = ({ text, onTextChange }: EditorPanelProps) => {
  return (
    <Card className="flex w-full flex-col lg:max-w-md xl:max-w-lg">
      <CardHeader>
        <CardTitle className="text-primary">Editor de Flujo</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden pt-0">
        <div className="relative flex-1">
          <Textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Describe tu diagrama de flujo aquí usando lenguaje natural..."
            className="h-full w-full resize-none text-base font-code"
          />
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="syntax-guide">
            <AccordionTrigger className="text-sm font-semibold">
              Ver Guía Rápida
            </AccordionTrigger>
            <AccordionContent>
              <SyntaxGuide />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default EditorPanel;
