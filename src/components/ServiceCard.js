import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../core/theme/theme';

export default function ServiceCard({ service, onPress, compact = false, style }) {
  const { name, category, price, estimatedDuration, estimated_duration, description } = service;
  const duration = estimatedDuration || estimated_duration;

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.cardCompact, style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${category || 'Service'}, ₱${price}, ${duration} minutes`}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{name}</Text>
          {category ? (
            <View style={styles.categoryBadge}>
              <Text style={styles.category}>{category}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.priceBox}>
          <Text style={styles.price}>₱{price}</Text>
        </View>
      </View>
      {!compact && description ? (
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
      ) : null}
      <View style={styles.footer}>
        <View style={styles.durationRow}>
          <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.duration}>{duration} min</Text>
        </View>
        {onPress ? (
          <View style={styles.actionRow}>
            <Text style={styles.selectText}>Select</Text>
            <Ionicons name="arrow-forward" size={14} color={theme.colors.royalBlue} style={{ marginLeft: 3 }} />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  cardCompact: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  headerLeft: { flex: 1, marginRight: theme.spacing.sm },
  name: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  categoryBadge: {
    backgroundColor: theme.colors.royalBlue + '12',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  category: {
    ...theme.typography.captionBold,
    color: theme.colors.royalBlue,
    fontSize: 11,
  },
  priceBox: {
    backgroundColor: theme.colors.gold + '22',
    borderRadius: theme.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.gold + '40',
  },
  price: {
    color: '#92700C',
    fontWeight: '800',
    fontSize: 15,
  },
  description: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectText: {
    ...theme.typography.captionBold,
    color: theme.colors.royalBlue,
    fontSize: 13,
  },
});

