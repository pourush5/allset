import React, { useState } from 'react';
import { X, Trash2, Check } from 'lucide-react';
import type { TreeNode, NodeCategory } from '../types/tree';
import { getCategoryIcon } from './categoryIcons';
import { getNodeBreadcrumbs } from '../utils/treeUtils';

interface NodeModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  targetNode?: TreeNode; // The node being edited, OR the parent node when adding
  root: TreeNode;
  onClose: () => void;
  onSaveAdd: (parentId: string, data: { title: string; category?: NodeCategory; notes?: string }) => void;
  onSaveEdit: (id: string, data: { title: string; category?: NodeCategory; notes?: string }) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES: { id: NodeCategory; label: string }[] = [
  { id: 'bag', label: 'Bag' },
  { id: 'suitcase', label: 'Suitcase' },
  { id: 'backpack', label: 'Backpack' },
  { id: 'tech', label: 'Tech & Gadgets' },
  { id: 'toiletries', label: 'Toiletries' },
  { id: 'clothes', label: 'Clothing' },
  { id: 'documents', label: 'Documents' },
  { id: 'wallet', label: 'Wallet & Money' },
  { id: 'keys', label: 'Keys' },
  { id: 'medicine', label: 'Medicine' },
  { id: 'food', label: 'Snacks & Food' },
  { id: 'home', label: 'Home Check' },
  { id: 'general', label: 'General' },
];

const QUICK_SUGGESTIONS = [
  { title: 'Toothbrush', category: 'toiletries' as NodeCategory },
  { title: 'Laptop', category: 'tech' as NodeCategory },
  { title: 'Wallet', category: 'wallet' as NodeCategory },
  { title: 'Passport', category: 'documents' as NodeCategory },
  { title: 'Charger & Cable', category: 'tech' as NodeCategory },
  { title: 'Earphones', category: 'tech' as NodeCategory },
  { title: 'House Keys', category: 'keys' as NodeCategory },
  { title: 'Sunglasses', category: 'general' as NodeCategory },
  { title: 'T-Shirts', category: 'clothes' as NodeCategory },
  { title: 'Power Bank', category: 'tech' as NodeCategory },
];

export const NodeModal: React.FC<NodeModalProps> = ({
  isOpen,
  mode,
  targetNode,
  root,
  onClose,
  onSaveAdd,
  onSaveEdit,
  onDelete
}) => {
  const [title, setTitle] = useState(mode === 'edit' && targetNode ? targetNode.title : '');
  const [category, setCategory] = useState<NodeCategory>(
    mode === 'edit' && targetNode ? (targetNode.category || 'general') : 'general'
  );
  const [notes, setNotes] = useState(mode === 'edit' && targetNode ? (targetNode.notes || '') : '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !targetNode) return null;

  const breadcrumbs = mode === 'add' 
    ? getNodeBreadcrumbs(root, targetNode.id)
    : getNodeBreadcrumbs(root, targetNode.id).slice(0, -1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (mode === 'add') {
      onSaveAdd(targetNode.id, {
        title: title.trim(),
        category,
        notes: notes.trim() || undefined
      });
    } else {
      onSaveEdit(targetNode.id, {
        title: title.trim(),
        category,
        notes: notes.trim() || undefined
      });
    }
    onClose();
  };

  const handleSuggestionClick = (sug: typeof QUICK_SUGGESTIONS[0]) => {
    setTitle(sug.title);
    setCategory(sug.category);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {mode === 'add' ? 'Add Item / Child Node' : 'Edit Item'}
            </h3>
            {breadcrumbs.length > 0 && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-[280px]">
                {mode === 'add' ? 'Inside: ' : 'In: '}
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {breadcrumbs.join(' › ')}
                </span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Quick Suggestions (when adding) */}
          {mode === 'add' && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Quick Suggestions:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug.title}
                    type="button"
                    onClick={() => handleSuggestionClick(sug)}
                    className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 transition-colors"
                  >
                    {sug.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Item Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Toothbrush, Laptop, Wallet..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category & Icon
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {getCategoryIcon(cat.id, 'w-3.5 h-3.5 shrink-0')}
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Notes or Quantity (optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Pack 2 pairs, keep in side pouch"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Delete Button (in edit mode) */}
          {mode === 'edit' && targetNode.id !== root.id && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              {showDeleteConfirm ? (
                <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-medium text-red-700 dark:text-red-300">
                    Delete this and all child items?
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(targetNode.id);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-sm"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-2 px-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Item</span>
                </button>
              )}
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{mode === 'add' ? 'Add to Tree' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
