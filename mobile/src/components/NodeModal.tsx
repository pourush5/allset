import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { X, Check, Trash2 } from 'lucide-react-native';
import type { TreeNode, NodeCategory } from '../types/tree';
import { getCategoryIcon, getCategoryColors } from './categoryIcons';
import { getNodeBreadcrumbs } from '../utils/treeUtils';

interface NodeModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  targetNode?: TreeNode;
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
  { id: 'tech', label: 'Tech' },
  { id: 'toiletries', label: 'Toiletries' },
  { id: 'clothes', label: 'Clothes' },
  { id: 'documents', label: 'Docs' },
  { id: 'wallet', label: 'Wallet' },
  { id: 'keys', label: 'Keys' },
  { id: 'medicine', label: 'Meds' },
  { id: 'food', label: 'Food' },
  { id: 'home', label: 'Home' },
  { id: 'general', label: 'General' },
];

const QUICK_SUGGESTIONS = [
  { title: 'Toothbrush', category: 'toiletries' as NodeCategory },
  { title: 'Laptop', category: 'tech' as NodeCategory },
  { title: 'Wallet', category: 'wallet' as NodeCategory },
  { title: 'Passport', category: 'documents' as NodeCategory },
  { title: 'Charger', category: 'tech' as NodeCategory },
  { title: 'Keys', category: 'keys' as NodeCategory },
  { title: 'T-Shirts', category: 'clothes' as NodeCategory },
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

  if (!isOpen || !targetNode) return null;

  const breadcrumbs = mode === 'add'
    ? getNodeBreadcrumbs(root, targetNode.id)
    : getNodeBreadcrumbs(root, targetNode.id).slice(0, -1);

  const handleSave = () => {
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

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>
                {mode === 'add' ? 'Add Item / Child Node' : 'Edit Item'}
              </Text>
              {breadcrumbs.length > 0 && (
                <Text numberOfLines={1} style={styles.breadcrumbText}>
                  {mode === 'add' ? 'Inside: ' : 'In: '}
                  {breadcrumbs.join(' › ')}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Quick Suggestions (if adding) */}
          {mode === 'add' && (
            <View style={styles.suggestionsSection}>
              <Text style={styles.fieldLabel}>Quick Suggestions:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                {QUICK_SUGGESTIONS.map((sug) => (
                  <TouchableOpacity
                    key={sug.title}
                    onPress={() => {
                      setTitle(sug.title);
                      setCategory(sug.category);
                    }}
                    style={styles.chipBtn}
                  >
                    <Text style={styles.chipText}>{sug.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Item Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Item Name *</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Toothbrush, Laptop, Wallet..."
              style={styles.textInput}
              autoFocus
            />
          </View>

          {/* Category Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Category & Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                const colors = getCategoryColors(cat.id);
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setCategory(cat.id)}
                    style={[
                      styles.catCard,
                      isSelected && { borderColor: '#2563eb', backgroundColor: '#eff6ff' }
                    ]}
                  >
                    {getCategoryIcon(cat.id, 14, colors.text)}
                    <Text style={[styles.catLabel, isSelected && { color: '#2563eb', fontWeight: '700' }]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Notes Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Notes / Quantity (optional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Pack 2 pairs, in front pouch"
              style={styles.textInput}
            />
          </View>

          {/* Delete Option if Editing */}
          {mode === 'edit' && targetNode.id !== root.id && (
            <TouchableOpacity 
              onPress={() => {
                onDelete(targetNode.id);
                onClose();
              }}
              style={styles.deleteBtn}
            >
              <Trash2 size={16} color="#ef4444" />
              <Text style={styles.deleteText}>Delete Item</Text>
            </TouchableOpacity>
          )}

          {/* Save Button */}
          <TouchableOpacity 
            onPress={handleSave} 
            disabled={!title.trim()} 
            style={[styles.saveBtn, !title.trim() && { opacity: 0.5 }]}
          >
            <Check size={18} color="#ffffff" strokeWidth={3} />
            <Text style={styles.saveBtnText}>
              {mode === 'add' ? 'Add to Tree' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  breadcrumbText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    maxWidth: 260,
  },
  closeBtn: {
    padding: 6,
  },
  suggestionsSection: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  chipBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 6,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  inputGroup: {
    marginBottom: 14,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0f172a',
  },
  catScroll: {
    flexDirection: 'row',
  },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    marginRight: 6,
  },
  catLabel: {
    fontSize: 11,
    color: '#475569',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    marginBottom: 12,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
  saveBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});

