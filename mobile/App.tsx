import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FolderPlus, GitFork, ListTree, Sparkles } from 'lucide-react-native';

import type { TreeNode, ViewMode, FilterMode, NodeCategory } from './src/types/tree';
import { 
  loadSavedTreeAsync, 
  saveTreeAsync, 
  JOURNEY_PRESETS 
} from './src/utils/presets';
import type { JourneyPreset } from './src/utils/presets';
import { 
  getTreeStats, 
  toggleNodeCompletion, 
  addChildNode, 
  updateNodeData, 
  deleteNode, 
  toggleNodeExpanded, 
  resetAllCompletion, 
  filterTree, 
  findNode 
} from './src/utils/treeUtils';
import { hapticFeedback } from './src/utils/haptics';

import { Header } from './src/components/Header';
import { VisualTree } from './src/components/VisualTree';
import { OutlineTree } from './src/components/OutlineTree';
import { NodeModal } from './src/components/NodeModal';
import { PresetsModal } from './src/components/PresetsModal';
import { CelebrationModal } from './src/components/CelebrationModal';

export default function App() {
  const [tree, setTree] = useState<TreeNode>(JOURNEY_PRESETS[0].tree);
  const [viewMode, setViewMode] = useState<ViewMode>('visual-tree');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [loaded, setLoaded] = useState(false);

  // Modals state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    targetNode?: TreeNode;
  }>({ isOpen: false, mode: 'add' });

  const [presetsOpen, setPresetsOpen] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    loadSavedTreeAsync().then((saved) => {
      setTree(saved);
      setLoaded(true);
    });
  }, []);

  // Save changes to AsyncStorage
  useEffect(() => {
    if (loaded) {
      saveTreeAsync(tree);
    }
  }, [tree, loaded]);

  const stats = useMemo(() => getTreeStats(tree), [tree]);

  const displayedTree = useMemo(() => {
    if (filter === 'all') return tree;
    const filtered = filterTree(tree, filter);
    return filtered || { ...tree, children: [] };
  }, [tree, filter]);

  // Handlers
  const handleToggleComplete = useCallback((id: string) => {
    const { newTree, newlyCompletedContainer } = toggleNodeCompletion(tree, id);
    setTree(newTree);

    const newStats = getTreeStats(newTree);
    if (newStats.leafTotal > 0 && newStats.leafCompleted === newStats.leafTotal) {
      hapticFeedback.celebrate();
      setCelebrationOpen(true);
    } else if (newlyCompletedContainer) {
      hapticFeedback.containerDone();
    } else {
      hapticFeedback.tick();
    }
  }, [tree]);

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

  const handleResetAll = useCallback(() => {
    setTree(prev => resetAllCompletion(prev));
    hapticFeedback.tick();
  }, []);

  const handleSelectPreset = useCallback((preset: JourneyPreset) => {
    setTree(preset.tree);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        {/* Top Header */}
        <Header
          tripTitle={tree.title}
          stats={stats}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filter={filter}
          onFilterChange={setFilter}
          onOpenPresets={() => setPresetsOpen(true)}
          onResetAll={handleResetAll}
        />

        {/* Main Content Area */}
        <View style={styles.main}>
          {displayedTree.children.length === 0 && filter !== 'all' ? (
            <View style={styles.emptyState}>
              <Sparkles size={36} color="#94a3b8" />
              <Text style={styles.emptyTitle}>No items match your filter</Text>
              <Text style={styles.emptyText}>
                {filter === 'unpacked' 
                  ? 'All items in your tree are packed! You are ready to go.' 
                  : 'Try switching filters.'}
              </Text>
              <TouchableOpacity onPress={() => setFilter('all')} style={styles.emptyBtn}>
                <Text style={styles.emptyBtnText}>Show All Items</Text>
              </TouchableOpacity>
            </View>
          ) : viewMode === 'visual-tree' ? (
            <VisualTree
              root={displayedTree}
              onToggleComplete={handleToggleComplete}
              onToggleExpand={handleToggleExpand}
              onAddChild={handleOpenAdd}
              onEditNode={handleOpenEdit}
            />
          ) : (
            <OutlineTree
              root={displayedTree}
              onToggleComplete={handleToggleComplete}
              onToggleExpand={handleToggleExpand}
              onAddChild={handleOpenAdd}
              onEditNode={handleOpenEdit}
            />
          )}
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            onPress={() => handleOpenAdd(tree.id)} 
            style={styles.addBagBtn}
          >
            <FolderPlus size={16} color="#ffffff" strokeWidth={2.5} />
            <Text style={styles.addBagText}>Add Container / Bag</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setViewMode(v => v === 'visual-tree' ? 'outline-tree' : 'visual-tree')}
            style={styles.switchModeBtn}
          >
            {viewMode === 'visual-tree' ? (
              <>
                <ListTree size={16} color="#2563eb" />
                <Text style={styles.switchModeText}>Checklist</Text>
              </>
            ) : (
              <>
                <GitFork size={16} color="#2563eb" />
                <Text style={styles.switchModeText}>Visual Tree</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  main: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 10,
  },
  addBagBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 14,
  },
  addBagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  switchModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  switchModeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  emptyBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  emptyBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});
