import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../core/theme/theme';

export default function Button({
  label,
  onPress,
  loading = false,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  disabled = false,
  size = 'medium',
  style,
  textStyle,
}) {
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';
  const isRoyal = variant === 'royalBlue';
  const isDanger = variant === 'danger';

  let bg = theme.colors.navy;
  if (isOutline) bg = 'transparent';
  else if (isSecondary) bg = theme.colors.gold;
  else if (isRoyal) bg = theme.colors.royalBlue;
  else if (isDanger) bg = theme.colors.danger;

  let textColor = theme.colors.white;
  if (isOutline) textColor = theme.colors.navy;
  else if (isSecondary) textColor = '#5B4402';

  const isDisabled = disabled || loading;

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bg },
        isOutline && styles.outline,
        isSmall && styles.buttonSmall,
        isLarge && styles.buttonLarge,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' ? (
            <Ionicons
              name={icon}
              size={isSmall ? 16 : 18}
              color={textColor}
              style={{ marginRight: 8 }}
            />
          ) : null}
          <Text
            style={[
              styles.text,
              { color: textColor },
              isSmall && styles.textSmall,
              isLarge && styles.textLarge,
              textStyle,
            ]}
          >
            {label}
          </Text>
          {icon && iconPosition === 'right' ? (
            <Ionicons
              name={icon}
              size={isSmall ? 16 : 18}
              color={textColor}
              style={{ marginLeft: 8 }}
            />
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: theme.radius.sm,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: theme.radius.lg,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: theme.colors.navy,
  },
  disabled: {
    opacity: 0.55,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  textSmall: {
    fontSize: 13,
  },
  textLarge: {
    fontSize: 16,
  },
});

