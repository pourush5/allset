import React from 'react';
import { 
  Briefcase, 
  Luggage, 
  Backpack, 
  Laptop, 
  Sparkles, 
  Shirt, 
  FileText, 
  Wallet, 
  Key, 
  Pill, 
  Utensils, 
  Home, 
  Package
} from 'lucide-react';
import type { NodeCategory } from '../types/tree';

export function getCategoryIcon(category?: NodeCategory, className: string = 'w-4 h-4'): React.ReactNode {
  switch (category) {
    case 'bag':
      return <Briefcase className={className} />;
    case 'suitcase':
      return <Luggage className={className} />;
    case 'backpack':
      return <Backpack className={className} />;
    case 'tech':
      return <Laptop className={className} />;
    case 'toiletries':
      return <Sparkles className={className} />;
    case 'clothes':
      return <Shirt className={className} />;
    case 'documents':
      return <FileText className={className} />;
    case 'wallet':
      return <Wallet className={className} />;
    case 'keys':
      return <Key className={className} />;
    case 'medicine':
      return <Pill className={className} />;
    case 'food':
      return <Utensils className={className} />;
    case 'home':
      return <Home className={className} />;
    default:
      return <Package className={className} />;
  }
}

export function getCategoryBadgeColor(category?: NodeCategory): string {
  switch (category) {
    case 'bag':
    case 'suitcase':
      return 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    case 'backpack':
      return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
    case 'tech':
      return 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    case 'toiletries':
      return 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800';
    case 'clothes':
      return 'bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 border-pink-200 dark:border-pink-800';
    case 'documents':
      return 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    case 'wallet':
      return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    case 'keys':
      return 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    case 'medicine':
      return 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    case 'home':
      return 'bg-slate-50 text-slate-600 dark:bg-slate-900/50 dark:text-slate-400 border-slate-200 dark:border-slate-800';
    default:
      return 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
  }
}
