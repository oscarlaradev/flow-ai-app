import dagre from 'dagre';
import { line, curveBasis } from 'd3-shape';
import type { TextToFlowchartOutput, FlowchartNode } from '@/ai/types/flowchart';

const NODE_WIDTH = 160;
const NODE_HEIGHT = 80;
const NODE_PADDING = 20;

function createSVGElement(tag: string, attributes: { [key: string]: string | number }): string {
    const attrs = Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ');
    return `<${tag} ${attrs} />`;
}

function createText(node: dagre.Node, isDarkMode: boolean): string {
  const textColor = isDarkMode ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)';
  const words = node.label.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  const maxCharsPerLine = 18; // Aproximación

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  lines.push(currentLine);

  const lineHeight = 1.2; // em
  const startYOffset = -(lines.length - 1) / 2 * lineHeight;

  const tspanLines = lines.map((line, index) => {
    const dy = index === 0 ? `${startYOffset}em` : `${lineHeight}em`;
    return `<tspan x="${node.x}" dy="${dy}">${line}</tspan>`;
  }).join('');

  return `<text
    y="${node.y}"
    fill="${textColor}"
    font-family="sans-serif"
    font-size="14px"
    text-anchor="middle"
    dominant-baseline="central"
  >${tspanLines}</text>`;
}

function createNode(node: dagre.Node, nodeInfo: FlowchartNode, isDarkMode: boolean): string {
  const x = node.x - node.width / 2;
  const y = node.y - node.height / 2;
  const strokeColor = isDarkMode ? 'hsl(217.2 91.2% 59.8%)' : 'hsl(221.2 83.2% 53.3%)';
  const fillColor = isDarkMode ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(210 40% 96.1%)';

  switch (nodeInfo.type) {
    case 'start/end':
      return createSVGElement('rect', {
        x,
        y,
        width: node.width,
        height: node.height,
        rx: node.height / 2,
        ry: node.height / 2,
        fill: fillColor,
        stroke: strokeColor,
        'stroke-width': 2,
      });
    case 'decision':
      const points = [
        [node.x, y],
        [x + node.width, node.y],
        [node.x, y + node.height],
        [x, node.y],
      ].map(p => p.join(',')).join(' ');
      return createSVGElement('polygon', {
        points,
        fill: fillColor,
        stroke: strokeColor,
        'stroke-width': 2,
      });
    case 'process':
    default:
      return createSVGElement('rect', {
        x,
        y,
        width: node.width,
        height: node.height,
        rx: 8,
        ry: 8,
        fill: fillColor,
        stroke: strokeColor,
        'stroke-width': 2,
      });
  }
}

function createEdge(edge: dagre.Edge, isDarkMode: boolean): string {
  const edgeColor = isDarkMode ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)';
  const lineGenerator = line<{ x: number; y: number }>()
    .x(d => d.x)
    .y(d => d.y)
    .curve(curveBasis);
  
  const path = lineGenerator(edge.points);

  if (!path) return '';

  const pathElement = `<path d="${path}"
    stroke="${edgeColor}"
    stroke-width="2"
    fill="none"
    marker-end="url(#arrowhead)"
  />`;
  
  let labelElement = '';
  if (edge.label) {
    const labelColor = isDarkMode ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)';
    labelElement = `<text
      x="${edge.x}"
      y="${edge.y}"
      fill="${labelColor}"
      font-size="12px"
      text-anchor="middle"
      dominant-baseline="middle"
      dy="-5"
      style="background-color: hsl(var(--background));"
    >${edge.label}</text>`;
  }

  return labelElement + pathElement;
}


export function generateSvgFromFlowData(flowData: TextToFlowchartOutput, isDarkMode = true): string {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'TB', marginx: NODE_PADDING, marginy: NODE_PADDING, nodesep: 50, ranksep: 50 });
  g.setDefaultEdgeLabel(() => ({}));

  flowData.nodes.forEach(node => {
    g.setNode(node.id, { label: node.label, width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  flowData.edges.forEach(edge => {
    g.setEdge(edge.from, edge.to, { label: edge.label });
  });

  dagre.layout(g);

  const nodes = flowData.nodes.map(n => {
    const node = g.node(n.id);
    return {
      node: createNode(node, n, isDarkMode),
      text: createText(node, isDarkMode),
    };
  });

  const edges = g.edges().map(e => {
    const edge = g.edge(e);
    return createEdge(edge, isDarkMode);
  });
  
  const graphWidth = g.graph().width ?? 800;
  const graphHeight = g.graph().height ?? 600;

  const arrowHeadColor = isDarkMode ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)';
  const backgroundColor = isDarkMode ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)';

  return `
    <svg width="${graphWidth}" height="${graphHeight}" viewBox="0 0 ${graphWidth} ${graphHeight}">
      <defs>
        <marker
          id="arrowhead"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="${arrowHeadColor}" />
        </marker>
      </defs>
      <g>
        ${nodes.map(n => n.node).join('')}
        ${edges.join('')}
        ${nodes.map(n => n.text).join('')}
      </g>
    </svg>
  `;
}
