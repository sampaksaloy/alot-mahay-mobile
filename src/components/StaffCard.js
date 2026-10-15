import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../core/theme/theme';

export default function StaffCard({ staff, onPress, selected = false, style }) {
  const { name, staffType, specialization, status } = staff;
  const isAvailable = status === 'AVAILABLE';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.cardSelected,
        !isAvailable && styles.cardUnavailable,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress || !isAvailable}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${staffType}, ${isAvailable ? 'Available' : 'Unavailable'}`}
    >
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{name?.charAt(0)?.toUpperCase() || '?'}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{name}</Text>
          {selected && (
            <Ionicons name="checkmark-circle" size={18} color={theme.colors.royalBlue} style={{ marginLeft: 6 }} />
          )}
        </View>
        <Text style={styles.type}>{staffType}</Text>
        {specialization ? (
          <Text style={styles.spec} numberOfLines={1}>{specialization}</Text>
        ) : null}
      </View>
      <View style={[styles.statusBadge, { backgroundColor: isAvailable ? '#DCFCE7' : '#F1F5F9' }]}>
        <View style={[styles.statusDot, { backgroundColor: isAvailable ? theme.colors.success : theme.colors.textMuted }]} />
        <Text style={[styles.statusText, { color: isAvailable ? '#15803D' : theme.colors.textMuted }]}>
          {isAvailable ? 'Available' : 'Busy'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  cardSelected: {
    borderColor: theme.colors.royalBlue,
    backgroundColor: theme.colors.royalBlue + '08',
  },
  cardUnavailable: {
    opacity: 0.6,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: theme.colors.white,
    fontWeight: '800',
    fontSize: 18,
  },
  info: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
  },
  type: {
    ...theme.typography.captionBold,
    color: theme.colors.royalBlue,
    marginTop: 2,
  },
  spec: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: theme.spacing.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

