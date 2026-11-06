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
} from 'lucide-react-native';
import type { NodeCategory } from '../types/tree';

export function getCategoryIcon(category?: NodeCategory, size: number = 18, color: string = '#4b5563'): React.ReactNode {
  switch (category) {
    case 'bag':
      return <Briefcase size={size} color={color} />;
    case 'suitcase':
      return <Luggage size={size} color={color} />;
    case 'backpack':
      return <Backpack size={size} color={color} />;
    case 'tech':
      return <Laptop size={size} color={color} />;
    case 'toiletries':
      return <Sparkles size={size} color={color} />;
    case 'clothes':
      return <Shirt size={size} color={color} />;
    case 'documents':
      return <FileText size={size} color={color} />;
    case 'wallet':
      return <Wallet size={size} color={color} />;
    case 'keys':
      return <Key size={size} color={color} />;
    case 'medicine':
      return <Pill size={size} color={color} />;
    case 'food':
      return <Utensils size={size} color={color} />;
    case 'home':
      return <Home size={size} color={color} />;
    default:
      return <Package size={size} color={color} />;
  }
}

export function getCategoryColors(category?: NodeCategory): { bg: string; text: string; border: string } {
  switch (category) {
    case 'bag':
    case 'suitcase':
      return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
    case 'backpack':
      return { bg: '#eef2ff', text: '#4f46e5', border: '#c7d2fe' };
    case 'tech':
      return { bg: '#faf5ff', text: '#9333ea', border: '#e9d5ff' };
    case 'toiletries':
      return { bg: '#ecfeff', text: '#0891b2', border: '#a5f3fc' };
    case 'clothes':
      return { bg: '#fdf2f8', text: '#db2777', border: '#fbcfe8' };
    case 'documents':
      return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' };
    case 'wallet':
      return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
    case 'keys':
      return { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' };
    case 'medicine':
      return { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' };
    case 'home':
      return { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' };
    default:
      return { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb' };
  }
}
