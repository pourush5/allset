import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { 
  Check, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  MoreVertical,
  FolderPlus 
} from 'lucide-react-native';
import type { TreeNode } from '../types/tree';
import { getCategoryIcon, getCategoryColors } from './categoryIcons';
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
  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = node.isExpanded ?? true;
    const hasChildren = node.children.length > 0;
    const progress = getNodeProgress(node);
    const allDescendantsDone = progress.total > 0 && progress.completed === progress.total;
    const isDone = node.completed || (hasChildren && allDescendantsDone);
    const colors = getCategoryColors(node.category);

    return (
      <View key={node.id} style={styles.nodeWrapper}>
        <View 
          style={[
            styles.nodeRow,
            { marginLeft: depth * 16 },
            isDone ? styles.nodeRowDone : styles.nodeRowPending
          ]}
        >
          {/* Chevron expand/collapse */}
          {hasChildren ? (
            <TouchableOpacity 
              onPress={() => onToggleExpand(node.id)}
              style={styles.chevronBtn}
            >
              {isExpanded ? (
                <ChevronDown size={16} color="#64748b" />
              ) : (
                <ChevronRight size={16} color="#64748b" />
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.bulletDot} />
          )}

          {/* Checkbox */}
          <TouchableOpacity
            onPress={() => onToggleComplete(node.id)}
            style={[
              styles.checkbox,
              isDone ? styles.checkboxDone : styles.checkboxPending
            ]}
          >
            {isDone && <Check size={14} color="#ffffff" strokeWidth={3} />}
          </TouchableOpacity>

          {/* Category Icon */}
          <View style={[styles.iconBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            {getCategoryIcon(node.category, 14, colors.text)}
          </View>

          {/* Title & Notes */}
          <View style={styles.titleWrap}>
            <View style={styles.titleLine}>
              <Text 
                numberOfLines={1} 
                style={[styles.titleText, isDone && styles.titleTextDone]}
              >
                {node.title}
              </Text>
              {hasChildren && (
                <View style={[styles.countBadge, { backgroundColor: allDescendantsDone ? '#dcfce7' : '#f1f5f9' }]}>
                  <Text style={[styles.countText, { color: allDescendantsDone ? '#15803d' : '#64748b' }]}>
                    {progress.completed}/{progress.total}
                  </Text>
                </View>
              )}
            </View>
            {node.notes ? (
              <Text numberOfLines={1} style={styles.notesText}>
                {node.notes}
              </Text>
            ) : null}
          </View>

          {/* Action buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity onPress={() => onAddChild(node.id)} style={styles.actionBtn}>
              <Plus size={16} color="#2563eb" strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onEditNode(node)} style={styles.actionBtn}>
              <MoreVertical size={16} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Children if expanded */}
        {hasChildren && isExpanded && (
          <View style={styles.childrenContainer}>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {renderNode(root, 0)}

      <TouchableOpacity onPress={() => onAddChild(root.id)} style={styles.addRootBtn}>
        <FolderPlus size={16} color="#2563eb" />
        <Text style={styles.addRootText}>Add Container or Bag (e.g. Duffel, Tech Pouch)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 12,
    paddingBottom: 40,
  },
  nodeWrapper: {
    marginVertical: 3,
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  nodeRowPending: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  nodeRowDone: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  chevronBtn: {
    padding: 2,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 5,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxPending: {
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  checkboxDone: {
    backgroundColor: '#10b981',
  },
  iconBadge: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  titleWrap: {
    flex: 1,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    flexShrink: 1,
  },
  titleTextDone: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
  },
  notesText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    padding: 4,
  },
  childrenContainer: {
    borderLeftWidth: 2,
    borderLeftColor: '#e2e8f0',
    marginLeft: 18,
    paddingLeft: 4,
  },
  addRootBtn: {
    marginTop: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
  },
  addRootText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
});
