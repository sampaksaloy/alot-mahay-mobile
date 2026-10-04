import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../core/theme/theme';

export default function Button({ label, onPress, loading = false, variant = 'primary', style }) {
  const bg = variant === 'primary' ? theme.colors.primary
    : variant === 'danger' ? theme.colors.danger
    : theme.colors.surface;
  const textColor = variant === 'outline' ? theme.colors.primary : theme.colors.white;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bg }, variant === 'outline' && styles.outline, style]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? <ActivityIndicator color={textColor} /> : <Text style={[styles.text, { color: textColor }]}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: theme.radius.sm, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  outline: { borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: 'transparent' },
  text: { fontWeight: '600', fontSize: 15 },
});
