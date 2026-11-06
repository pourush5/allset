export type NodeCategory = 
  | 'bag' 
  | 'backpack' 
  | 'suitcase' 
  | 'tech' 
  | 'toiletries' 
  | 'clothes' 
  | 'documents' 
  | 'wallet' 
  | 'keys' 
  | 'medicine' 
  | 'food' 
  | 'home' 
  | 'general';

export interface TreeNode {
  id: string;
  title: string;
  completed: boolean;
  children: TreeNode[];
  category?: NodeCategory;
  notes?: string;
  isExpanded?: boolean;
}

export type ViewMode = 'visual-tree' | 'outline-tree';
export type FilterMode = 'all' | 'unpacked' | 'packed';
export type TreeLayoutDirection = 'horizontal' | 'vertical';

export interface TreeStats {
  total: number;
  completed: number;
  remaining: number;
  percent: number;
  leafTotal: number;
  leafCompleted: number;
}
