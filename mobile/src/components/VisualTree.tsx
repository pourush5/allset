import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Check, Plus, Minus, MoreVertical } from 'lucide-react-native';
import type { TreeNode } from '../types/tree';
import { getCategoryIcon, getCategoryColors } from './categoryIcons';
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
  isLeaf: boolean;
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

const NODE_W = 210;
const NODE_H = 76;
const GAP_X = 64;
const GAP_Y = 22;

function computeSubtreeSpan(node: TreeNode): number {
  const isExpanded = node.isExpanded ?? true;
  if (!isExpanded || node.children.length === 0) {
    return NODE_H;
  }
  let total = 0;
  for (const child of node.children) {
    total += computeSubtreeSpan(child);
  }
  const gaps = (node.children.length - 1) * GAP_Y;
  return Math.max(NODE_H, total + gaps);
}

export const VisualTree: React.FC<VisualTreeProps> = ({
  root,
  onToggleComplete,
  onToggleExpand,
  onAddChild,
  onEditNode
}) => {
  const { layoutItems, connections, boundingBox } = useMemo(() => {
    const items: LayoutItem[] = [];
    const conns: Connection[] = [];
    let maxX = 500;
    let maxY = 500;

    function layoutNode(
      node: TreeNode,
      depth: number,
      coordX: number,
      coordYCenter: number,
      parentId?: string,
      parentOutputPoint?: { x: number; y: number }
    ) {
      const isExpanded = node.isExpanded ?? true;
      const progress = getNodeProgress(node);
      const isLeaf = node.children.length === 0;

      const x = coordX;
      const y = coordYCenter - NODE_H / 2;

      maxX = Math.max(maxX, x + NODE_W + 60);
      maxY = Math.max(maxY, y + NODE_H + 60);

      const allDescendantsDone = progress.total > 0 && progress.completed === progress.total;

      if (parentOutputPoint) {
        conns.push({
          id: `conn-${parentId}-${node.id}`,
          from: parentOutputPoint,
          to: { x, y: y + NODE_H / 2 },
          isCompleted: allDescendantsDone || node.completed
        });
      }

      items.push({
        node,
        x,
        y,
        width: NODE_W,
        height: NODE_H,
        isLeaf,
        childrenCount: node.children.length,
        completedCount: progress.completed,
        percent: progress.percent,
        allDescendantsDone
      });

      if (!isExpanded || node.children.length === 0) return;

      const outputPoint = { x: x + NODE_W, y: y + NODE_H / 2 };
      const span = computeSubtreeSpan(node);
      let currentY = coordYCenter - span / 2;
      const nextX = coordX + NODE_W + GAP_X;

      for (const child of node.children) {
        const childSpan = computeSubtreeSpan(child);
        const childYCenter = currentY + childSpan / 2;
        layoutNode(child, depth + 1, nextX, childYCenter, node.id, outputPoint);
        currentY += childSpan + GAP_Y;
      }
    }

    const rootSpan = computeSubtreeSpan(root);
    layoutNode(root, 0, 30, rootSpan / 2 + 40);

    return {
      layoutItems: items,
      connections: conns,
      boundingBox: { width: Math.max(maxX, 600), height: Math.max(maxY, 700) }
    };
  }, [root]);

  return (
    <ScrollView 
      horizontal 
      style={styles.container}
      contentContainerStyle={{ width: boundingBox.width, minHeight: boundingBox.height }}
      showsHorizontalScrollIndicator
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ width: boundingBox.width, height: boundingBox.height }}
        showsVerticalScrollIndicator
      >
        <View style={{ width: boundingBox.width, height: boundingBox.height, position: 'relative' }}>
          {/* SVG Connector Paths */}
          <Svg style={StyleSheet.absoluteFill}>
            {connections.map((conn) => {
              const { from, to, isCompleted } = conn;
              const dx = Math.abs(to.x - from.x) * 0.5;
              const d = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
              return (
                <Path
                  key={conn.id}
                  d={d}
                  fill="none"
                  stroke={isCompleted ? '#10b981' : '#cbd5e1'}
                  strokeWidth={isCompleted ? 2.5 : 2}
                  strokeDasharray={isCompleted ? undefined : '4,4'}
                />
              );
            })}
          </Svg>

          {/* Node Cards */}
          {layoutItems.map((item) => {
            const { node, x, y, width, height, childrenCount, percent, allDescendantsDone } = item;
            const hasChildren = childrenCount > 0;
            const isDone = node.completed || (hasChildren && allDescendantsDone);
            const colors = getCategoryColors(node.category);
            const isExpanded = node.isExpanded ?? true;

            return (
              <View
                key={node.id}
                style={[
                  styles.card,
                  {
                    left: x,
                    top: y,
                    width,
                    height,
                    backgroundColor: isDone ? '#f0fdf4' : '#ffffff',
                    borderColor: isDone ? '#86efac' : '#e2e8f0',
                  }
                ]}
              >
                {/* Top Row: Checkbox, Icon, Title, More */}
                <View style={styles.topRow}>
                  <TouchableOpacity
                    onPress={() => onToggleComplete(node.id)}
                    style={[
                      styles.checkbox,
                      isDone ? styles.checkboxDone : styles.checkboxPending
                    ]}
                  >
                    {isDone && <Check size={14} color="#ffffff" strokeWidth={3} />}
                  </TouchableOpacity>

                  <View style={[styles.categoryIconBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                    {getCategoryIcon(node.category, 14, colors.text)}
                  </View>

                  <View style={styles.titleWrap}>
                    <Text 
                      numberOfLines={1} 
                      style={[styles.nodeTitle, isDone && styles.nodeTitleDone]}
                    >
                      {node.title}
                    </Text>
                    {node.notes ? (
                      <Text numberOfLines={1} style={styles.nodeNotes}>
                        {node.notes}
                      </Text>
                    ) : null}
                  </View>

                  <TouchableOpacity onPress={() => onEditNode(node)} style={styles.moreBtn}>
                    <MoreVertical size={14} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                {/* Bottom Row: Subtree Progress & Add Button */}
                <View style={styles.bottomRow}>
                  {hasChildren ? (
                    <TouchableOpacity
                      onPress={() => onToggleExpand(node.id)}
                      style={styles.expandBtn}
                    >
                      {isExpanded ? <Minus size={11} color="#64748b" /> : <Plus size={11} color="#64748b" />}
                      <Text style={styles.expandText}>
                        {isExpanded ? 'Collapse' : `Expand (${childrenCount})`}
                      </Text>
                      <View style={[styles.percentBadge, { backgroundColor: allDescendantsDone ? '#dcfce7' : '#f1f5f9' }]}>
                        <Text style={[styles.percentText, { color: allDescendantsDone ? '#15803d' : '#64748b' }]}>
                          {percent}%
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.leafTag}>Item</Text>
                  )}

                  <TouchableOpacity 
                    onPress={() => onAddChild(node.id)}
                    style={styles.addChildBtn}
                  >
                    <Plus size={12} color="#2563eb" strokeWidth={2.5} />
                    <Text style={styles.addChildText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  card: {
    position: 'absolute',
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    backgroundColor: '#ffffff',
  },
  checkboxDone: {
    backgroundColor: '#10b981',
  },
  categoryIconBadge: {
    padding: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  titleWrap: {
    flex: 1,
    marginRight: 2,
  },
  nodeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  nodeTitleDone: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  nodeNotes: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 1,
  },
  moreBtn: {
    padding: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 4,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  expandText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  percentBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 2,
  },
  percentText: {
    fontSize: 9,
    fontWeight: '700',
  },
  leafTag: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  addChildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#eff6ff',
  },
  addChildText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563eb',
  },
});

