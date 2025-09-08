"use client";

import { useEffect, useState } from "react";
import { getSyntaxSuggestion } from "@/ai/flows/ai-syntax-suggestions";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SyntaxGuide from "./syntax-guide";
import { Lightbulb, Loader2 } from "lucide-react";

interface EditorPanelProps {
  text: string;
  onTextChange: (text: string) => void;
}

const EditorPanel = ({ text, onTextChange }: EditorPanelProps) => {
  const [suggestion, setSuggestion] = useState<string>("");
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const debouncedText = useDebounce(text, 1000);

  useEffect(() => {
    const fetchSuggestion = async () => {
      if (debouncedText.trim().length > 10) {
        setIsSuggesting(true);
        try {
          const result = await getSyntaxSuggestion({
            inputText: debouncedText,
          });
          setSuggestion(result.suggestion);
        } catch (error) {
          console.error("Failed to get suggestion:", error);
          setSuggestion("");
        } finally {
          setIsSuggesting(false);
        }
      } else {
        setSuggestion("");
      }
    };

    fetchSuggestion();
  }, [debouncedText]);

  return (
    <Card className="flex w-full flex-col lg:max-w-md xl:max-w-lg">
      <CardHeader>
        <CardTitle className="text-primary">Editor & Guide</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden pt-0">
        <div className="relative flex-1">
          <Textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Describe your flowchart here..."
            className="h-full w-full resize-none text-base"
          />
        </div>
        {(isSuggesting || suggestion) && (
          <div className="rounded-lg border bg-card p-3 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              {isSuggesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="h-4 w-4 text-yellow-400" />
              )}
              AI Suggestion
            </div>
            {suggestion && !isSuggesting && (
              <p className="mt-2 text-muted-foreground">{suggestion}</p>
            )}
          </div>
        )}
        <Accordion type="single" collapsible>
          <AccordionItem value="syntax-guide">
            <AccordionTrigger className="text-sm font-semibold">
              View Syntax Guide
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
