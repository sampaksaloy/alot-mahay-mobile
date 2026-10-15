import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../core/theme/theme';

export default function InputField({
  label,
  error,
  helperText,
  leftIcon,
  secureTextEntry,
  showSecureToggle = false,
  style,
  inputStyle,
  ...textInputProps
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);

  const hasToggle = showSecureToggle || (secureTextEntry !== undefined && secureTextEntry !== null);

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
      >
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={18}
            color={isFocused ? theme.colors.royalBlue : theme.colors.textMuted}
            style={styles.leftIcon}
          />
        ) : null}
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={hasToggle ? isSecure : secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        {hasToggle ? (
          <TouchableOpacity
            style={styles.rightIconButton}
            onPress={() => setIsSecure(!isSecure)}
            accessibilityRole="button"
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
          >
            <Ionicons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={theme.colors.danger} style={{ marginRight: 4 }} />
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: theme.spacing.md },
  label: {
    marginBottom: 6,
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    minHeight: 50,
  },
  inputFocused: {
    borderColor: theme.colors.royalBlue,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: theme.colors.danger,
    backgroundColor: theme.colors.danger + '06',
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textPrimary,
    paddingVertical: 12,
  },
  rightIconButton: {
    padding: 6,
    marginLeft: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  error: {
    color: theme.colors.danger,
    fontSize: 12,
    fontWeight: '500',
  },
  helperText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
});

