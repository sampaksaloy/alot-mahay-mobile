import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../core/constants/colors';

const STATUS_CONFIG = {
  WAITING: {
    label: 'Waiting',
    icon: 'time-outline',
    bg: '#F0F5FF',
    color: '#0B2D5B',
  },
  CALLED: {
    label: 'Called',
    icon: 'megaphone-outline',
    bg: '#EBF2FD',
    color: '#1E63D6',
  },
  IN_SERVICE: {
    label: 'In Service',
    icon: 'cut-outline',
    bg: '#EBF2FD',
    color: '#1E63D6',
  },
  COMPLETED: {
    label: 'Completed',
    icon: 'checkmark-circle-outline',
    bg: '#0B2D5B',
    color: '#FFFFFF',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: 'close-circle-outline',
    bg: '#F1F5F9',
    color: '#64748B',
  },
  SKIPPED: {
    label: 'Skipped',
    icon: 'play-skip-forward-outline',
    bg: '#F1F5F9',
    color: '#64748B',
  },
};

export default function QueueStatusBadge({ status, size = 'medium', style }) {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    icon: 'information-circle-outline',
    bg: '#F1F5F9',
    color: '#64748B',
  };

  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg, borderColor: config.color + '30' },
        isSmall && styles.badgeSmall,
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${config.label}`}
    >
      <Ionicons
        name={config.icon}
        size={isSmall ? 12 : 14}
        color={config.color}
        style={styles.icon}
      />
      <Text style={[styles.text, { color: config.color }, isSmall && styles.textSmall]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textSmall: {
    fontSize: 10,
  },
});

