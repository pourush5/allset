import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { 
  Compass, 
  Sparkles, 
  RotateCcw, 
  GitFork, 
  ListTree 
} from 'lucide-react-native';
import type { TreeStats, ViewMode, FilterMode } from '../types/tree';

interface HeaderProps {
  tripTitle: string;
  stats: TreeStats;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filter: FilterMode;
  onFilterChange: (filter: FilterMode) => void;
  onOpenPresets: () => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tripTitle,
  stats,
  viewMode,
  onViewModeChange,
  filter,
  onFilterChange,
  onOpenPresets,
  onResetAll,
}) => {
  return (
    <View style={styles.header}>
      {/* Top Bar: Brand, Title, Utility Buttons */}
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <View style={styles.iconBox}>
            <Compass size={18} color="#ffffff" strokeWidth={2.5} />
          </View>
          <View>
            <Text style={styles.brandSubtitle}>ALLSET • PRE-JOURNEY</Text>
            <Text numberOfLines={1} style={styles.tripTitle}>{tripTitle}</Text>
          </View>
        </View>

        <View style={styles.rightButtons}>
          <TouchableOpacity onPress={onOpenPresets} style={styles.utilBtn} title="Presets">
            <Sparkles size={18} color="#f59e0b" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onResetAll} style={styles.utilBtn} title="Reset">
            <RotateCcw size={16} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar & Stats */}
      <View style={styles.progressSection}>
        <View style={styles.progressMeta}>
          <Text style={styles.progressPercent}>{stats.percent}% Packed</Text>
          <Text style={styles.progressCount}>{stats.leafCompleted} of {stats.leafTotal} items</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${Math.min(stats.percent, 100)}%` },
              stats.percent === 100 && styles.progressBarDone
            ]} 
          />
        </View>
      </View>

      {/* View Switcher & Filters */}
      <View style={styles.controlsRow}>
        {/* View Switcher */}
        <View style={styles.switcher}>
          <TouchableOpacity
            onPress={() => onViewModeChange('visual-tree')}
            style={[styles.switcherBtn, viewMode === 'visual-tree' && styles.switcherBtnActive]}
          >
            <GitFork size={13} color={viewMode === 'visual-tree' ? '#2563eb' : '#64748b'} />
            <Text style={[styles.switcherText, viewMode === 'visual-tree' && styles.switcherTextActive]}>
              Visual
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onViewModeChange('outline-tree')}
            style={[styles.switcherBtn, viewMode === 'outline-tree' && styles.switcherBtnActive]}
          >
            <ListTree size={13} color={viewMode === 'outline-tree' ? '#2563eb' : '#64748b'} />
            <Text style={[styles.switcherText, viewMode === 'outline-tree' && styles.switcherTextActive]}>
              Checklist
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter buttons */}
        <View style={styles.filtersGroup}>
          {(['all', 'unpacked', 'packed'] as FilterMode[]).map((mode) => {
            const isSelected = filter === mode;
            return (
              <TouchableOpacity
                key={mode}
                onPress={() => onFilterChange(mode)}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {mode === 'unpacked' ? 'Unpacked' : mode}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2563eb',
    letterSpacing: 0.5,
  },
  tripTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  utilBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  progressSection: {
    marginBottom: 8,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
  },
  progressCount: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#2563eb',
  },
  progressBarDone: {
    backgroundColor: '#10b981',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switcher: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 2,
  },
  switcherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  switcherBtnActive: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  switcherText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  switcherTextActive: {
    color: '#2563eb',
  },
  filtersGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  filterChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
  },
  filterChipActive: {
    backgroundColor: '#0f172a',
  },
  filterChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'capitalize',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
});

