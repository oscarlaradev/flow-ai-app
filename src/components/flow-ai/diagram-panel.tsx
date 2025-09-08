"use client";

import { useState, useRef, type MouseEvent, type WheelEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { AlertTriangle, GalleryVerticalEnd } from "lucide-react";

interface DiagramPanelProps {
  svgContent: string;
  isLoading: boolean;
  error: string;
}

const BackgroundGrid = () => {
  const gridSize = 40;
  return (
    <svg width="100%" height="100%" className="absolute inset-0">
      <defs>
        <pattern
          id="grid"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" className="fill-muted" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
};

const DiagramPanel = ({ svgContent, isLoading, error }: DiagramPanelProps) => {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    isPanning.current = true;
    startPoint.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
  };

  const handleMouseUp = () => {
    isPanning.current = false;
    if (containerRef.current) containerRef.current.style.cursor = "grab";
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isPanning.current) return;
    setPan({
      x: e.clientX - startPoint.current.x,
      y: e.clientY - startPoint.current.y,
    });
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.2, Math.min(3, scale + delta));

    const pointX = (mouseX - pan.x) / scale;
    const pointY = (mouseY - pan.y) / scale;

    const newPanX = mouseX - pointX * newScale;
    const newPanY = mouseY - pointY * newScale;

    setScale(newScale);
    setPan({ x: newPanX, y: newPanY });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <Skeleton className="h-4/5 w-4/5 rounded-lg" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="m-auto flex flex-col items-center gap-4 text-destructive">
          <AlertTriangle className="h-12 w-12" />
          <p className="max-w-md text-center font-semibold">
            Could not generate flowchart.
          </p>
          <p className="max-w-md text-center text-sm text-muted-foreground">
            {error}
          </p>
        </div>
      );
    }
    if (svgContent) {
      return (
        <div
          className="transition-transform duration-75 ease-out"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      );
    }
    return (
      <div className="m-auto flex flex-col items-center gap-4 text-muted-foreground">
        <GalleryVerticalEnd className="h-12 w-12" />
        <p>Your interactive diagram will appear here</p>
      </div>
    );
  };

  return (
    <Card className="flex flex-1 flex-col overflow-hidden">
      <CardHeader>
        <CardTitle className="text-accent">Interactive Visualizer</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-2 pt-0 sm:p-4">
        <div
          ref={containerRef}
          className={cn(
            "relative h-full w-full overflow-hidden rounded-lg bg-background",
            "cursor-grab"
          )}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
        >
          <BackgroundGrid />
          <div className="relative z-10 h-full w-full">{renderContent()}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagramPanel;
