import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { X, Sparkles, ChevronRight } from 'lucide-react-native';
import { JOURNEY_PRESETS } from '../utils/presets';
import type { JourneyPreset } from '../utils/presets';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: JourneyPreset) => void;
  currentRootId: string;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  currentRootId
}) => {
  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Sparkles size={18} color="#2563eb" />
              <Text style={styles.headerTitle}>Pre-Journey Templates</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {JOURNEY_PRESETS.map((preset) => {
              const isCurrent = preset.tree.id === currentRootId;
              return (
                <TouchableOpacity
                  key={preset.id}
                  onPress={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  style={[styles.presetCard, isCurrent && styles.presetCardActive]}
                >
                  <Text style={styles.presetIcon}>{preset.icon}</Text>
                  <View style={styles.presetInfo}>
                    <Text style={styles.presetName}>{preset.name}</Text>
                    <Text numberOfLines={2} style={styles.presetDesc}>
                      {preset.description}
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#94a3b8" />
                </TouchableOpacity>
              );
            })}
          </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  list: {
    gap: 10,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  presetCardActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  presetIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  presetDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
});
