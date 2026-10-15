import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../core/theme/theme';

export default function EmptyState({
  icon = 'folder-open-outline',
  title = 'Nothing here yet',
  message = '',
  action,
  style,
}) {
  const isEmoji = typeof icon === 'string' && icon.length <= 2 && !icon.includes('-');

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        {isEmoji ? (
          <Text style={styles.emojiText}>{icon}</Text>
        ) : (
          <Ionicons name={icon} size={40} color={theme.colors.royalBlue} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {action ? <View style={styles.actionContainer}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl * 1.5,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.royalBlue + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.royalBlue + '20',
  },
  emojiText: {
    fontSize: 36,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  actionContainer: {
    marginTop: theme.spacing.lg,
  },
});

