import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../core/theme/theme';

const EMOJI_TO_ICON = {
  '⏳': 'time-outline',
  '✂️': 'cut-outline',
  '✅': 'checkmark-circle-outline',
  '⏱': 'timer-outline',
  '📋': 'list-outline',
  '👤': 'person-outline',
  '👥': 'people-outline',
  '⭐': 'star-outline',
  '📊': 'bar-chart-outline',
  '📅': 'calendar-outline',
  '🔔': 'notifications-outline',
  '☕': 'cafe-outline',
};

export default function StatCard({ icon, label, value, color, style }) {
  const iconColor = color || theme.colors.royalBlue;
  const resolvedIcon = EMOJI_TO_ICON[icon] || icon || 'stats-chart-outline';

  return (
    <View style={[styles.card, style]}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
        {typeof resolvedIcon === 'string' && (
          <Ionicons name={resolvedIcon} size={20} color={iconColor} />
        )}
      </View>
      <Text style={[styles.value, color ? { color } : null]}>{value}</Text>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 96,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
});

