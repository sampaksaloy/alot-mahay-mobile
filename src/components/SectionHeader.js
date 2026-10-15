import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../core/theme/theme';

export default function SectionHeader({ title, rightText, onRightPress, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {rightText ? (
        onRightPress ? (
          <TouchableOpacity onPress={onRightPress} activeOpacity={0.7}>
            <Text style={styles.right}>{rightText}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.right}>{rightText}</Text>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  right: {
    ...theme.typography.captionBold,
    color: theme.colors.royalBlue,
  },
});

