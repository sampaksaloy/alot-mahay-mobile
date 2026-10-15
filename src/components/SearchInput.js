import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../core/theme/theme';

export default function SearchInput({ value, onChangeText, placeholder = 'Search...', style }) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={18} color={theme.colors.textMuted} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  icon: { marginRight: theme.spacing.sm },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
});
