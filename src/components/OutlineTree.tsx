import React from 'react';
import { 
  Plus, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  MoreVertical, 
  FolderPlus 
} from 'lucide-react';
import type { TreeNode } from '../types/tree';
import { getCategoryIcon, getCategoryBadgeColor } from './categoryIcons';
import { getNodeProgress } from '../utils/treeUtils';

interface OutlineTreeProps {
  root: TreeNode;
  onToggleComplete: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onEditNode: (node: TreeNode) => void;
}

export const OutlineTree: React.FC<OutlineTreeProps> = ({
  root,
  onToggleComplete,
  onToggleExpand,
  onAddChild,
  onEditNode
}) => {
  // Render a node row and recursively its children
  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = node.isExpanded ?? true;
    const hasChildren = node.children.length > 0;
    const progress = getNodeProgress(node);
    const allDescendantsDone = progress.total > 0 && progress.completed === progress.total;
    const isDone = node.completed || (hasChildren && allDescendantsDone);
    const badgeColor = getCategoryBadgeColor(node.category);

    return (
      <div key={node.id} className="relative flex flex-col">
        {/* Node Row Card */}
        <div 
          className={`group flex items-center gap-2.5 p-3 rounded-2xl transition-all border my-1 ${
            isDone 
              ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60' 
              : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
          }`}
          style={{
            marginLeft: depth > 0 ? `${depth * 22}px` : '0px'
          }}
        >
          {/* Indentation Branch Indicator */}
          {depth > 0 && (
            <div 
              className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-px bg-slate-300 dark:bg-slate-700 pointer-events-none"
            />
          )}

          {/* Expand/Collapse Chevron (if node has children) */}
          {hasChildren ? (
            <button
              type="button"
              onClick={() => onToggleExpand(node.id)}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>
          )}

          {/* Checkbox Tick Button */}
          <button
            type="button"
            onClick={() => onToggleComplete(node.id)}
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 ${
              isDone
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/50 text-transparent'
            }`}
            title={isDone ? 'Mark Incomplete' : 'Tick Off / Pack'}
          >
            <Check className={`w-4 h-4 stroke-[3] ${isDone ? 'opacity-100' : 'opacity-0'}`} />
          </button>

          {/* Category Icon */}
          <div className={`p-1.5 rounded-xl border shrink-0 ${badgeColor}`}>
            {getCategoryIcon(node.category, 'w-4 h-4')}
          </div>

          {/* Title & Notes */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold truncate transition-colors ${
                isDone 
                  ? 'line-through text-slate-400 dark:text-slate-500' 
                  : 'text-slate-800 dark:text-slate-100'
              }`}>
                {node.title}
              </span>

              {hasChildren && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  allDescendantsDone
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {progress.completed}/{progress.total}
                </span>
              )}
            </div>

            {node.notes && (
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                {node.notes}
              </p>
            )}
          </div>

          {/* Action Buttons: Add Child & More */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onAddChild(node.id)}
              className="p-1.5 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
              title="Add child item inside this node"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={() => onEditNode(node)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit or Delete"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Children Rendered if Expanded */}
        {hasChildren && isExpanded && (
          <div className="relative pl-3 border-l-2 border-slate-200/80 dark:border-slate-800/80 ml-4 my-0.5">
            {node.children.map((child) => 
              renderNode(child, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 py-4 pb-24">
      {/* Root Node & Subtrees */}
      {renderNode(root, 0)}

      {/* Floating Add Root Container Button at bottom of list */}
      <div className="mt-4 pt-2">
        <button
          type="button"
          onClick={() => onAddChild(root.id)}
          className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center gap-2 font-semibold text-sm transition-all active:scale-[0.99] bg-white/50 dark:bg-slate-900/50"
        >
          <FolderPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Container or Bag (e.g. Duffel, Tech Pouch)</span>
        </button>
      </div>
    </div>
  );
};
