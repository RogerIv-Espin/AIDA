import React, { useRef, useState } from 'react';
import { ArchitectureSolution, DiagramNode } from '../types';
import { RenderAzureIcon } from './AzureIcons';
import { 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldCheck, 
  Info, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface ArchitectureCanvasProps {
  solution: ArchitectureSolution;
  onSelectService?: (serviceId: string) => void;
}

export function ArchitectureCanvas({ solution, onSelectService }: ArchitectureCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);
  const [exporting, setExporting] = useState(false);

  const { nodes, edges, groupings } = solution.diagram;

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.5));
  const handleResetZoom = () => setZoom(1);

  // Helper function to export SVG canvas to PNG or JPG
  const exportImage = async (format: 'png' | 'jpg') => {
    if (!svgRef.current) return;
    setExporting(true);

    try {
      const svgElement = svgRef.current;
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        // 2x resolution for crisp high-DPI export
        const scale = 2;
        const width = 1100;
        const height = 750;
        canvas.width = width * scale;
        canvas.height = height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.scale(scale, scale);

        // Background color
        ctx.fillStyle = '#0B1120'; // Deep Azure dark theme
        ctx.fillRect(0, 0, width, height);

        // Header watermark
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(0, 0, width, 50);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`Azure Solution Architecture — ${solution.metadata.title}`, 24, 32);

        ctx.fillStyle = '#38BDF8';
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText(`Environment: ${solution.metadata.environment.toUpperCase()} | Azure Bicep & Policy as Code Compliant`, width - 420, 32);

        // Draw SVG diagram
        ctx.drawImage(image, 0, 50, width, height - 50);

        // Export download
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, 0.95);

        const downloadLink = document.createElement('a');
        downloadLink.download = `azure-architecture-${solution.metadata.environment}-${Date.now()}.${format}`;
        downloadLink.href = dataUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(blobURL);
        setExporting(false);
      };

      image.src = blobURL;
    } catch (err) {
      console.error('Error exporting image:', err);
      setExporting(false);
    }
  };

  // Node position lookup
  const nodeMap = new Map<string, DiagramNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  return (
    <div className="relative flex flex-col h-full bg-slate-950 overflow-hidden select-none">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-300">
            {solution.metadata.title}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {solution.metadata.environment.toUpperCase()} · {nodes.length} Recursos Azure
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Actions */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Alejar Zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 px-2">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Acercar Zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-slate-400 hover:text-white transition-colors border-l border-slate-700/60"
              title="Restablecer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Export Dropdown / Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => exportImage('png')}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar PNG</span>
            </button>
            <button
              onClick={() => exportImage('jpg')}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JPG</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport */}
      <div 
        ref={containerRef}
        className="relative flex-1 overflow-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] bg-slate-950 p-6 flex items-center justify-center"
      >
        <div 
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150 ease-out"
        >
          <svg
            ref={svgRef}
            width="1060"
            height="720"
            viewBox="0 0 1060 720"
            className="overflow-visible"
          >
            <defs>
              <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0078D4" />
                <stop offset="100%" stopColor="#50E6FF" />
              </linearGradient>

              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#38BDF8" />
              </marker>

              <filter id="nodeShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Logical Groupings (e.g. Edge / Cloud Ingress, Virtual Network) */}
            {groupings.map((grp) => (
              <g key={grp.id}>
                <rect
                  x={grp.x}
                  y={grp.y}
                  width={grp.width}
                  height={grp.height}
                  rx="12"
                  fill="#0F172A"
                  fillOpacity="0.6"
                  stroke="#1E293B"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                />
                <text
                  x={grp.x + 16}
                  y={grp.y + 24}
                  fill="#94A3B8"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="system-ui"
                >
                  {grp.label}
                </text>
              </g>
            ))}

            {/* Connecting Edges */}
            {edges.map((edge, idx) => {
              const src = nodeMap.get(edge.source);
              const tgt = nodeMap.get(edge.target);
              if (!src || !tgt) return null;

              const srcX = src.x + 100;
              const srcY = src.y + 35;
              const tgtX = tgt.x + 10;
              const tgtY = tgt.y + 35;

              // Smooth cubic bezier path
              const dx = Math.abs(tgtX - srcX) * 0.5;
              const pathD = `M ${srcX} ${srcY} C ${srcX + dx} ${srcY}, ${tgtX - dx} ${tgtY}, ${tgtX} ${tgtY}`;

              const midX = (srcX + tgtX) / 2;
              const midY = (srcY + tgtY) / 2;

              return (
                <g key={`edge-${idx}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#1E3A8A"
                    strokeWidth="3"
                    strokeOpacity="0.4"
                  />
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#edgeGrad)"
                    strokeWidth="1.75"
                    strokeDasharray={edge.animated ? '5 5' : 'none'}
                    markerEnd="url(#arrowhead)"
                  />
                  {edge.label && (
                    <g transform={`translate(${midX}, ${midY - 8})`}>
                      <rect
                        x="-55"
                        y="-10"
                        width="110"
                        height="20"
                        rx="4"
                        fill="#0B132B"
                        stroke="#1E293B"
                        strokeWidth="1"
                      />
                      <text
                        textAnchor="middle"
                        y="4"
                        fill="#93C5FD"
                        fontSize="9"
                        fontWeight="500"
                        fontFamily="system-ui"
                      >
                        {edge.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Architecture Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => {
                    setSelectedNode(node);
                    if (onSelectService) onSelectService(node.id);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Card Background */}
                  <rect
                    width="190"
                    height="72"
                    rx="8"
                    fill={isSelected ? '#1E293B' : '#0F172A'}
                    stroke={isSelected ? '#38BDF8' : '#334155'}
                    strokeWidth={isSelected ? '2' : '1'}
                    filter="url(#nodeShadow)"
                    className="transition-colors group-hover:stroke-blue-400"
                  />

                  {/* Left accent indicator */}
                  <rect
                    x="2"
                    y="12"
                    width="3"
                    height="48"
                    rx="1.5"
                    fill={isSelected ? '#38BDF8' : '#0078D4'}
                  />

                  {/* Azure Icon */}
                  <foreignObject x="12" y="14" width="44" height="44">
                    <div className="w-full h-full flex items-center justify-center p-1 rounded-md bg-slate-900/80 border border-slate-800">
                      <RenderAzureIcon icon={node.id} size={32} />
                    </div>
                  </foreignObject>

                  {/* Node Name */}
                  <text
                    x="64"
                    y="28"
                    fill="#F8FAFC"
                    fontSize="11.5"
                    fontWeight="600"
                    fontFamily="system-ui"
                  >
                    {node.name.length > 17 ? node.name.substring(0, 16) + '...' : node.name}
                  </text>

                  {/* Category */}
                  <text
                    x="64"
                    y="43"
                    fill="#94A3B8"
                    fontSize="9.5"
                    fontFamily="system-ui"
                  >
                    {node.category}
                  </text>

                  {/* SKU Tier */}
                  <text
                    x="64"
                    y="57"
                    fill="#38BDF8"
                    fontSize="8.5"
                    fontFamily="monospace"
                  >
                    {node.sku.length > 19 ? node.sku.substring(0, 18) + '..' : node.sku}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Service Inspector Bottom Panel */}
      {selectedNode && (
        <div className="border-t border-slate-800 bg-slate-900/95 p-3.5 flex items-center justify-between gap-4 z-10 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-slate-800 rounded-md border border-slate-700">
              <RenderAzureIcon icon={selectedNode.id} size={28} />
            </div>
            <div>
              <div className="font-semibold text-slate-100 flex items-center gap-2">
                <span>{selectedNode.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedNode.tier}
                </span>
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                SKU / Capacidad: <span className="text-blue-400 font-mono">{selectedNode.sku}</span> · Estado: <span className="text-emerald-400">Verificado por Policy</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.2+ · Managed Identity</span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-slate-200 px-2 py-1"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
