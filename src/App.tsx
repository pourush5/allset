import { useState, useEffect, useMemo, useCallback } from 'react';
import type { TreeNode, ViewMode, FilterMode, NodeCategory } from './types/tree';
import { 
  loadSavedTree, 
  saveTree
} from './utils/presets';
import type { JourneyPreset } from './utils/presets';
import { 
  getTreeStats, 
  toggleNodeCompletion, 
  addChildNode, 
  updateNodeData, 
  deleteNode, 
  toggleNodeExpanded, 
  setAllExpanded, 
  resetAllCompletion, 
  filterTree, 
  findNode 
} from './utils/treeUtils';
import { sound } from './utils/sound';
import { Header } from './components/Header';
import { VisualTree } from './components/VisualTree';
import { OutlineTree } from './components/OutlineTree';
import { NodeModal } from './components/NodeModal';
import { PresetsModal } from './components/PresetsModal';
import { CelebrationModal } from './components/CelebrationModal';
import { MobileFrame } from './components/MobileFrame';
import { FolderPlus, GitFork, ListTree, Sparkles } from 'lucide-react';

export function App() {
  const [tree, setTree] = useState<TreeNode>(() => loadSavedTree());
  const [viewMode, setViewMode] = useState<ViewMode>('visual-tree');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    targetNode?: TreeNode;
  }>({ isOpen: false, mode: 'add' });

  const [presetsOpen, setPresetsOpen] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);

  // Autosave tree whenever it changes
  useEffect(() => {
    saveTree(tree);
  }, [tree]);

  // Compute stats
  const stats = useMemo(() => getTreeStats(tree), [tree]);

  // Filtered Tree
  const displayedTree = useMemo(() => {
    if (filter === 'all' && !searchQuery.trim()) {
      return tree;
    }
    const filtered = filterTree(tree, filter, searchQuery);
    return filtered || { ...tree, children: [] };
  }, [tree, filter, searchQuery]);

  // Handlers
  const handleToggleComplete = useCallback((id: string) => {
    const node = findNode(tree, id);
    const wasCompleted = node?.completed;

    const { newTree, newlyCompletedContainer } = toggleNodeCompletion(tree, id);
    setTree(newTree);

    // Check if the trip is now 100% packed!
    const newStats = getTreeStats(newTree);
    if (newStats.leafTotal > 0 && newStats.leafCompleted === newStats.leafTotal) {
      if (soundEnabled) {
        sound.celebrate();
      }
      setCelebrationOpen(true);
    } else if (soundEnabled) {
      if (newlyCompletedContainer) {
        sound.containerDone();
      } else {
        sound.tick(!wasCompleted);
      }
    }
  }, [tree, soundEnabled]);

  const handleToggleExpand = useCallback((id: string) => {
    setTree(prev => toggleNodeExpanded(prev, id));
  }, []);

  const handleOpenAdd = useCallback((parentId: string) => {
    const parent = findNode(tree, parentId);
    if (parent) {
      setModalState({ isOpen: true, mode: 'add', targetNode: parent });
    }
  }, [tree]);

  const handleOpenEdit = useCallback((node: TreeNode) => {
    setModalState({ isOpen: true, mode: 'edit', targetNode: node });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleSaveAdd = useCallback((parentId: string, data: { title: string; category?: NodeCategory; notes?: string }) => {
    setTree(prev => addChildNode(prev, parentId, data));
  }, []);

  const handleSaveEdit = useCallback((id: string, data: { title: string; category?: NodeCategory; notes?: string }) => {
    setTree(prev => updateNodeData(prev, id, data));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTree(prev => deleteNode(prev, id));
  }, []);

  const handleToggleExpandAll = useCallback((expand: boolean) => {
    setTree(prev => setAllExpanded(prev, expand));
  }, []);

  const handleResetAll = useCallback(() => {
    setTree(prev => resetAllCompletion(prev));
    if (soundEnabled) {
      sound.tick(false);
    }
  }, [soundEnabled]);

  const handleSelectPreset = useCallback((preset: JourneyPreset) => {
    setTree(preset.tree);
  }, []);

  return (
    <MobileFrame>
      <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900 select-none overflow-hidden">
        {/* App Header */}
        <Header
          tripTitle={tree.title}
          stats={stats}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(s => !s)}
          onOpenPresets={() => setPresetsOpen(true)}
          onResetAll={handleResetAll}
          onAddContainer={() => handleOpenAdd(tree.id)}
          onToggleExpandAll={handleToggleExpandAll}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full min-h-0 relative overflow-hidden">
          {displayedTree.children.length === 0 && (filter !== 'all' || searchQuery) ? (
            /* Empty Filter State */
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-base font-bold text-slate-700 dark:text-slate-200">
                No items match your filter
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                {filter === 'unpacked' 
                  ? 'All items in your tree are packed! You are ready to go.' 
                  : 'Try clearing your search or switching filters.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white"
              >
                Show All Items
              </button>
            </div>
          ) : viewMode === 'visual-tree' ? (
            /* Interactive Canvas/SVG Visual Tree View */
            <VisualTree
              root={displayedTree}
              onToggleComplete={handleToggleComplete}
              onToggleExpand={handleToggleExpand}
              onAddChild={handleOpenAdd}
              onEditNode={handleOpenEdit}
            />
          ) : (
            /* Outline Checklist View */
            <OutlineTree
              root={displayedTree}
              onToggleComplete={handleToggleComplete}
              onToggleExpand={handleToggleExpand}
              onAddChild={handleOpenAdd}
              onEditNode={handleOpenEdit}
            />
          )}
        </main>

        {/* Bottom Quick-Action Bar for Mobile Thumb Ergonomics */}
        <footer className="shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 z-30">
          {/* Quick Add Container Button */}
          <button
            type="button"
            onClick={() => handleOpenAdd(tree.id)}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs shadow-sm shadow-blue-600/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <FolderPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Container / Bag</span>
          </button>

          {/* Quick Toggle View Mode */}
          <button
            type="button"
            onClick={() => setViewMode(v => v === 'visual-tree' ? 'outline-tree' : 'visual-tree')}
            className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {viewMode === 'visual-tree' ? (
              <>
                <ListTree className="w-3.5 h-3.5 text-blue-500" />
                <span>Checklist View</span>
              </>
            ) : (
              <>
                <GitFork className="w-3.5 h-3.5 rotate-90 text-blue-500" />
                <span>Visual Tree</span>
              </>
            )}
          </button>
        </footer>

        {/* Modals */}
        <NodeModal
          key={`${modalState.targetNode?.id || 'new'}-${modalState.mode}`}
          isOpen={modalState.isOpen}
          mode={modalState.mode}
          targetNode={modalState.targetNode}
          root={tree}
          onClose={handleCloseModal}
          onSaveAdd={handleSaveAdd}
          onSaveEdit={handleSaveEdit}
          onDelete={handleDelete}
        />

        <PresetsModal
          isOpen={presetsOpen}
          onClose={() => setPresetsOpen(false)}
          onSelectPreset={handleSelectPreset}
          currentRootId={tree.id}
        />

        <CelebrationModal
          isOpen={celebrationOpen}
          onClose={() => setCelebrationOpen(false)}
          onReset={handleResetAll}
          tripTitle={tree.title}
        />
      </div>
    </MobileFrame>
  );
}

export default App;
