import type { TreeNode, TreeStats, FilterMode } from '../types/tree';

export function generateId(): string {
  return 'node_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Find a node by ID in the tree
export function findNode(root: TreeNode, id: string): TreeNode | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

// Find parent node by child ID
export function findParent(root: TreeNode, childId: string): TreeNode | null {
  for (const child of root.children) {
    if (child.id === childId) return root;
    const found = findParent(child, childId);
    if (found) return found;
  }
  return null;
}

// Get the path from root to node (list of node titles)
export function getNodeBreadcrumbs(root: TreeNode, targetId: string): string[] {
  function dfs(curr: TreeNode, path: string[]): string[] | null {
    if (curr.id === targetId) return [...path, curr.title];
    for (const child of curr.children) {
      const res = dfs(child, [...path, curr.title]);
      if (res) return res;
    }
    return null;
  }
  return dfs(root, []) || [];
}

// Calculate packing progress for a single node (including its descendants)
export function getNodeProgress(node: TreeNode): { total: number; completed: number; percent: number } {
  if (node.children.length === 0) {
    return {
      total: 1,
      completed: node.completed ? 1 : 0,
      percent: node.completed ? 100 : 0
    };
  }

  let total = 0;
  let completed = 0;

  function countLeaves(curr: TreeNode) {
    if (curr.children.length === 0) {
      total += 1;
      if (curr.completed) completed += 1;
    } else {
      for (const child of curr.children) {
        countLeaves(child);
      }
    }
  }

  countLeaves(node);

  return {
    total,
    completed,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100)
  };
}

// Compute total stats for the whole tree
export function getTreeStats(root: TreeNode): TreeStats {
  let total = 0;
  let completed = 0;
  let leafTotal = 0;
  let leafCompleted = 0;

  function traverse(node: TreeNode) {
    total += 1;
    if (node.completed) completed += 1;

    if (node.children.length === 0) {
      leafTotal += 1;
      if (node.completed) leafCompleted += 1;
    } else {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  // Count from children of root, or root itself if it's considered an item
  // Usually the root is the Journey itself ("Tokyo Trip")
  for (const child of root.children) {
    traverse(child);
  }

  // If root has no children yet, consider root
  if (root.children.length === 0) {
    leafTotal = 1;
    leafCompleted = root.completed ? 1 : 0;
  }

  const effectiveTotal = leafTotal > 0 ? leafTotal : 1;
  const percent = Math.round((leafCompleted / effectiveTotal) * 100);

  return {
    total,
    completed,
    remaining: leafTotal - leafCompleted,
    percent,
    leafTotal,
    leafCompleted
  };
}

// Recursively set completed state on node and all its descendants
function setDescendantsCompletion(node: TreeNode, completed: boolean): TreeNode {
  return {
    ...node,
    completed,
    children: node.children.map(child => setDescendantsCompletion(child, completed))
  };
}

// Toggle a node's completion status with smart cascading
export function toggleNodeCompletion(root: TreeNode, targetId: string): { newTree: TreeNode; newlyCompletedContainer: boolean } {
  let newlyCompletedContainer = false;

  function updateCompletionRecursive(node: TreeNode): TreeNode {
    if (node.id === targetId) {
      const willBeCompleted = !node.completed;
      const updated = setDescendantsCompletion(node, willBeCompleted);
      if (willBeCompleted && node.children.length > 0) {
        newlyCompletedContainer = true;
      }
      return updated;
    }

    if (node.children.length === 0) {
      return node;
    }

    const updatedChildren = node.children.map(updateCompletionRecursive);

    // Auto-update parent completion based on all its children
    const allChildrenCompleted = updatedChildren.length > 0 && updatedChildren.every(c => c.completed);
    const wasCompleted = node.completed;

    if (!wasCompleted && allChildrenCompleted) {
      newlyCompletedContainer = true;
    }

    return {
      ...node,
      completed: allChildrenCompleted,
      children: updatedChildren
    };
  }

  const newTree = updateCompletionRecursive(root);
  return { newTree, newlyCompletedContainer };
}

// Add a child node
export function addChildNode(
  root: TreeNode, 
  parentId: string, 
  nodeData: { title: string; category?: TreeNode['category']; notes?: string }
): TreeNode {
  const newNode: TreeNode = {
    id: generateId(),
    title: nodeData.title.trim() || 'New Item',
    completed: false,
    children: [],
    category: nodeData.category || 'general',
    notes: nodeData.notes?.trim() || undefined,
    isExpanded: true
  };

  function insert(node: TreeNode): TreeNode {
    if (node.id === parentId) {
      return {
        ...node,
        isExpanded: true,
        completed: false, // New child means parent is incomplete until ticked
        children: [...node.children, newNode]
      };
    }

    return {
      ...node,
      children: node.children.map(insert)
    };
  }

  return insert(root);
}

// Update existing node data
export function updateNodeData(
  root: TreeNode,
  targetId: string,
  updates: Partial<Omit<TreeNode, 'id' | 'children'>>
): TreeNode {
  function update(node: TreeNode): TreeNode {
    if (node.id === targetId) {
      return { ...node, ...updates };
    }
    return {
      ...node,
      children: node.children.map(update)
    };
  }
  return update(root);
}

// Delete a node
export function deleteNode(root: TreeNode, targetId: string): TreeNode {
  // If target is root, we don't delete root completely, we clear its children
  if (root.id === targetId) {
    return { ...root, children: [], completed: false };
  }

  function remove(node: TreeNode): TreeNode {
    const remainingChildren = node.children.filter(child => child.id !== targetId);
    const updatedChildren = remainingChildren.map(remove);

    const allCompleted = updatedChildren.length > 0 && updatedChildren.every(c => c.completed);

    return {
      ...node,
      completed: updatedChildren.length === 0 ? node.completed : allCompleted,
      children: updatedChildren
    };
  }

  return remove(root);
}

// Toggle expand/collapse state
export function toggleNodeExpanded(root: TreeNode, targetId: string): TreeNode {
  function toggle(node: TreeNode): TreeNode {
    if (node.id === targetId) {
      return { ...node, isExpanded: !(node.isExpanded ?? true) };
    }
    return {
      ...node,
      children: node.children.map(toggle)
    };
  }
  return toggle(root);
}

// Expand or collapse all nodes
export function setAllExpanded(node: TreeNode, isExpanded: boolean): TreeNode {
  return {
    ...node,
    isExpanded,
    children: node.children.map(child => setAllExpanded(child, isExpanded))
  };
}

// Reset all completion (ready for returning home or next trip!)
export function resetAllCompletion(node: TreeNode): TreeNode {
  return {
    ...node,
    completed: false,
    children: node.children.map(resetAllCompletion)
  };
}

// Filter the tree for packed/unpacked items
export function filterTree(
  node: TreeNode, 
  filter: FilterMode, 
  searchQuery: string = ''
): TreeNode | null {
  const query = searchQuery.toLowerCase().trim();
  const matchesSearch = !query || node.title.toLowerCase().includes(query) || (node.notes && node.notes.toLowerCase().includes(query));

  // If node has children, filter children
  const filteredChildren: TreeNode[] = [];
  for (const child of node.children) {
    const res = filterTree(child, filter, query);
    if (res) filteredChildren.push(res);
  }

  // Leaf node logic
  if (node.children.length === 0) {
    let matchesFilter = true;
    if (filter === 'packed') matchesFilter = node.completed;
    if (filter === 'unpacked') matchesFilter = !node.completed;

    if (matchesFilter && matchesSearch) {
      return { ...node };
    }
    return null;
  }

  // Branch node logic: keep if it matches search or has visible children
  let matchesFilter = true;
  if (filter === 'packed') matchesFilter = node.completed || filteredChildren.length > 0;
  if (filter === 'unpacked') matchesFilter = !node.completed || filteredChildren.length > 0;

  if ((matchesFilter && matchesSearch) || filteredChildren.length > 0) {
    return {
      ...node,
      children: filteredChildren
    };
  }

  return null;
}
