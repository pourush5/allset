import * as Haptics from 'expo-haptics';

export const hapticFeedback = {
  // Light haptic tap when ticking an item
  tick: () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore if not supported
    }
  },

  // Medium double buzz when a container/bag is completed
  containerDone: () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Ignore
    }
  },

  // Heavy celebratory vibration sequence when trip is 100% packed
  celebrate: () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Ignore
    }
  }
};

