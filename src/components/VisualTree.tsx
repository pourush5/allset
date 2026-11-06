import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus, 
  Minus, 
  Check, 
  MoreVertical, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  ArrowRightLeft, 
  Layers
} from 'lucide-react';
import type { TreeNode, TreeLayoutDirection } from '../types/tree';
import { getCategoryIcon, getCategoryBadgeColor } from './categoryIcons';
import { getNodeProgress } from '../utils/treeUtils';

interface VisualTreeProps {
  root: TreeNode;
  onToggleComplete: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onEditNode: (node: TreeNode) => void;
}

interface LayoutItem {
  node: TreeNode;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  isLeaf: boolean;
  parentId?: string;
  parentPoint?: { x: number; y: number };
  childrenCount: number;
  completedCount: number;
  percent: number;
  allDescendantsDone: boolean;
}

interface Connection {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  isCompleted: boolean;
}

// Compute subtree span recursively (pure function)
function computeSubtreeSpan(
  node: TreeNode, 
  direction: TreeLayoutDirection, 
  nodeH: number, 
  nodeW: number, 
  gapY: number, 
  gapX: number
): number {
  const isExpanded = node.isExpanded ?? true;
  if (!isExpanded || node.children.length === 0) {
    return direction === 'horizontal' ? nodeH : nodeW;
  }

  let total = 0;
  for (const child of node.children) {
    total += computeSubtreeSpan(child, direction, nodeH, nodeW, gapY, gapX);
  }
  const gaps = (node.children.length - 1) * (direction === 'horizontal' ? gapY : gapX);
  return Math.max(direction === 'horizontal' ? nodeH : nodeW, total + gaps);
}

export const VisualTree: React.FC<VisualTreeProps> = ({
  root,
  onToggleComplete,
  onToggleExpand,
  onAddChild,
  onEditNode
}) => {
  const [direction, setDirection] = useState<TreeLayoutDirection>('horizontal');
  const [transform, setTransform] = useState({ x: 40, y: 80, scale: 0.95 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Constants for node dimensions
  const NODE_W = direction === 'horizontal' ? 230 : 210;
  const NODE_H = 76;
  const GAP_X = direction === 'horizontal' ? 70 : 28;
  const GAP_Y = direction === 'horizontal' ? 24 : 75;

  // Touch tracking for pinch-to-zoom
  const lastTouchDistRef = useRef<number | null>(null);

  // Compute layout positions for all visible nodes
  const { layoutItems, connections, boundingBox } = useMemo(() => {
    const items: LayoutItem[] = [];
    const conns: Connection[] = [];
    let minX = 0;
    let maxX = 500;
    let minY = 0;
    let maxY = 500;

    function layoutNode(
      node: TreeNode,
      depth: number,
      coordMain: number, // X in horizontal, Y in vertical
      coordCrossCenter: number, // Y in horizontal, X in vertical
      parentId?: string,
      parentOutputPoint?: { x: number; y: number }
    ) {
      const isExpanded = node.isExpanded ?? true;
      const progress = getNodeProgress(node);
      const isLeaf = node.children.length === 0;

      let x: number;
      let y: number;

      if (direction === 'horizontal') {
        x = coordMain;
        y = coordCrossCenter - NODE_H / 2;
      } else {
        x = coordCrossCenter - NODE_W / 2;
        y = coordMain;
      }

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x + NODE_W);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y + NODE_H);

      const allDescendantsDone = progress.total > 0 && progress.completed === progress.total;

      // Add connection from parent if available
      if (parentOutputPoint) {
        const inputPoint = direction === 'horizontal' 
          ? { x, y: y + NODE_H / 2 }
          : { x: x + NODE_W / 2, y };

        conns.push({
          id: `conn-${parentId}-${node.id}`,
          from: parentOutputPoint,
          to: inputPoint,
          isCompleted: allDescendantsDone || node.completed
        });
      }

      items.push({
        node,
        x,
        y,
        width: NODE_W,
        height: NODE_H,
        depth,
        isLeaf,
        parentId,
        childrenCount: node.children.length,
        completedCount: progress.completed,
        percent: progress.percent,
        allDescendantsDone
      });

      // If collapsed or no children, stop
      if (!isExpanded || node.children.length === 0) {
        return;
      }

      // Output point for connecting children
      const outputPoint = direction === 'horizontal'
        ? { x: x + NODE_W, y: y + NODE_H / 2 }
        : { x: x + NODE_W / 2, y: y + NODE_H };

      const span = computeSubtreeSpan(node, direction, NODE_H, NODE_W, GAP_Y, GAP_X);
      let currentCross = coordCrossCenter - span / 2;

      const nextMain = direction === 'horizontal'
        ? coordMain + NODE_W + GAP_X
        : coordMain + NODE_H + GAP_Y;

      for (const child of node.children) {
        const childSpan = computeSubtreeSpan(child, direction, NODE_H, NODE_W, GAP_Y, GAP_X);
        const childCrossCenter = currentCross + childSpan / 2;
        layoutNode(child, depth + 1, nextMain, childCrossCenter, node.id, outputPoint);
        currentCross += childSpan + (direction === 'horizontal' ? GAP_Y : GAP_X);
      }
    }

    const rootSpan = computeSubtreeSpan(root, direction, NODE_H, NODE_W, GAP_Y, GAP_X);
    layoutNode(root, 0, 40, rootSpan / 2 + 60);

    return { 
      layoutItems: items, 
      connections: conns,
      boundingBox: { width: maxX - minX + 160, height: maxY - minY + 160 }
    };
  }, [root, direction, NODE_W, NODE_H, GAP_X, GAP_Y]);

  // Center/fit view on mount or reset
  const fitView = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const scaleX = (clientWidth - 80) / boundingBox.width;
    const scaleY = (clientHeight - 80) / boundingBox.height;
    const newScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.55), 1.05);

    setTransform({
      x: 30,
      y: direction === 'horizontal' ? Math.max(40, (clientHeight - boundingBox.height * newScale) / 2) : 40,
      scale: newScale
    });
  }, [boundingBox, direction]);

  useEffect(() => {
    fitView();
  }, [direction, fitView]);

  // Drag handlers (mouse & touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-node')) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - transform.x, 
        y: e.touches[0].clientY - transform.y 
      });
      lastTouchDistRef.current = null;
    } else if (e.touches.length === 2) {
      // Pinch to zoom start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      }));
    } else if (e.touches.length === 2 && lastTouchDistRef.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = currentDist / lastTouchDistRef.current;
      lastTouchDistRef.current = currentDist;
      
      setTransform(prev => ({
        ...prev,
        scale: Math.min(Math.max(prev.scale * delta, 0.4), 2.0)
      }));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouchDistRef.current = null;
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setTransform(prev => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * zoomFactor, 0.4), 2.0)
    }));
  };

  // Zoom controls
  const handleZoom = (factor: number) => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * factor, 0.4), 2.0)
    }));
  };

  // Helper to generate SVG cubic Bezier path
  const renderPath = (conn: Connection) => {
    const { from, to, isCompleted } = conn;
    let d = '';

    if (direction === 'horizontal') {
      const dx = Math.abs(to.x - from.x) * 0.5;
      d = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
    } else {
      const dy = Math.abs(to.y - from.y) * 0.5;
      d = `M ${from.x} ${from.y} C ${from.x} ${from.y + dy}, ${to.x} ${to.y - dy}, ${to.x} ${to.y}`;
    }

    return (
      <path
        key={conn.id}
        d={d}
        fill="none"
        stroke={isCompleted ? '#10b981' : '#cbd5e1'}
        strokeWidth={isCompleted ? 2.5 : 2}
        strokeDasharray={isCompleted ? 'none' : '4 4'}
        className={`transition-colors duration-300 ${isCompleted ? 'opacity-90' : 'opacity-60 dark:stroke-slate-700'}`}
      />
    );
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none bg-slate-50/70 dark:bg-slate-950/70 cursor-grab active:cursor-grabbing touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Background Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: `${transform.x % 24}px ${transform.y % 24}px`
        }}
      />

      {/* Floating Canvas Action Controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => handleZoom(1.15)}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(0.85)}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={fitView}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
          title="Fit to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-0.5" />
        <button
          onClick={() => setDirection(d => d === 'horizontal' ? 'vertical' : 'horizontal')}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
          title={`Switch to ${direction === 'horizontal' ? 'Vertical (Top-Down)' : 'Horizontal (Left-Right)'} Layout`}
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Orientation Pill Hint */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
        <Layers className="w-3.5 h-3.5 text-blue-500" />
        <span>{direction === 'horizontal' ? 'Horizontal Tree' : 'Vertical Tree'}</span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="text-[11px] text-slate-500">{Math.round(transform.scale * 100)}%</span>
      </div>

      {/* Main SVG & Node Transform Container */}
      <div 
        className="absolute inset-0 origin-top-left transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0px) scale(${transform.scale})`
        }}
      >
        {/* SVG Bezier Branch Connectors */}
        <svg 
          className="absolute inset-0 overflow-visible pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          {connections.map(renderPath)}
        </svg>

        {/* Nodes Layer */}
        {layoutItems.map(item => {
          const { node, x, y, width, height, childrenCount, percent, allDescendantsDone } = item;
          const isSelected = selectedNodeId === node.id;
          const isExpanded = node.isExpanded ?? true;
          const hasChildren = childrenCount > 0;
          const isDone = node.completed || (hasChildren && allDescendantsDone);

          // Category Badge Styling
          const badgeColor = getCategoryBadgeColor(node.category);

          return (
            <div
              key={node.id}
              className={`interactive-node absolute rounded-2xl transition-all duration-200 shadow-sm border flex flex-col justify-between p-2.5 ${
                isDone 
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-emerald-100/50 dark:shadow-none' 
                  : isSelected
                    ? 'bg-white dark:bg-slate-900 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                    : 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:shadow-md'
              }`}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`,
              }}
              onClick={() => setSelectedNodeId(node.id)}
            >
              {/* Top Row: Category Icon + Title + Actions */}
              <div className="flex items-center gap-2 w-full">
                {/* Checkbox Tick Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(node.id);
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                    isDone
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                      : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/50 text-transparent'
                  }`}
                  title={isDone ? 'Mark Incomplete' : 'Tick Off / Pack'}
                >
                  <Check className={`w-4 h-4 stroke-[3] ${isDone ? 'opacity-100' : 'opacity-0'}`} />
                </button>

                {/* Category Icon Pill */}
                <div className={`p-1.5 rounded-lg border shrink-0 ${badgeColor}`}>
                  {getCategoryIcon(node.category, 'w-3.5 h-3.5')}
                </div>

                {/* Node Title & Notes */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className={`text-sm font-semibold truncate leading-tight transition-colors ${
                    isDone 
                      ? 'line-through text-slate-400 dark:text-slate-500' 
                      : 'text-slate-800 dark:text-slate-100'
                  }`}>
                    {node.title}
                  </div>
                  {node.notes && (
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                      {node.notes}
                    </div>
                  )}
                </div>

                {/* Options button (three dots) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditNode(node);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit or Delete Item"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Row: Subtree Progress or Add Child Button */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80 mt-1">
                {hasChildren ? (
                  <div className="flex items-center gap-1.5">
                    {/* Expand/Collapse Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleExpand(node.id);
                      }}
                      className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <Minus className="w-2.5 h-2.5" />
                          <span>Collapse</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-2.5 h-2.5" />
                          <span>Expand ({childrenCount})</span>
                        </>
                      )}
                    </button>

                    {/* Progress Badge */}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      allDescendantsDone
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {percent}%
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider pl-1">
                    Leaf Item
                  </span>
                )}

                {/* Quick Add Child Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddChild(node.id);
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-2 py-0.5 rounded-md transition-colors"
                  title="Add child node inside this node"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
