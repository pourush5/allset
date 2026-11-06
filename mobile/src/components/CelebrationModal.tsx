import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Plane, CheckCircle2, RotateCcw, X } from 'lucide-react-native';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  tripTitle: string;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  onReset,
  tripTitle
}) => {
  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={18} color="#94a3b8" />
          </TouchableOpacity>

          <View style={styles.iconCircle}>
            <Plane size={32} color="#10b981" />
          </View>

          <Text style={styles.title}>You're All Set! 🎉</Text>
          <Text style={styles.subtitle}>100% of your items are packed</Text>

          <Text style={styles.description}>
            Every bag, container, and item for "{tripTitle}" has been packed and ticked off. Safe travels!
          </Text>

          <TouchableOpacity onPress={onClose} style={styles.readyBtn}>
            <CheckCircle2 size={18} color="#ffffff" />
            <Text style={styles.readyBtnText}>Ready for Departure!</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              onReset();
              onClose();
            }} 
            style={styles.resetBtn}
          >
            <RotateCcw size={14} color="#64748b" />
            <Text style={styles.resetBtnText}>Reset Checklist for Return Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 4,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 12,
  },
  description: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  readyBtn: {
    width: '100%',
    backgroundColor: '#10b981',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  readyBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  resetBtnText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
});

