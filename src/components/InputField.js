import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { theme } from '../core/theme/theme';

export default function InputField({ label, error, style, ...textInputProps }) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput style={[styles.input, error && styles.inputError, style]} {...textInputProps} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: theme.spacing.md },
  label: { marginBottom: 4, color: theme.colors.textSecondary, fontSize: 13 },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  inputError: { borderColor: theme.colors.danger },
  error: { color: theme.colors.danger, fontSize: 12, marginTop: 4 },
});
