import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme/theme';

export default function AuthLayout({
  title,
  subtitle,
  roleLabel,
  roleIcon = 'person',
  roleColor,
  onBack,
  demoAccounts = [],
  onSelectDemoAccount,
  demoNotice = 'Frontend Demo: Stored locally in mock store.',
  children,
}) {
  const accentColor = roleColor || theme.colors.royalBlue;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerArea}>
          {onBack ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Back to role selection"
            >
              <Ionicons name="arrow-back" size={22} color={theme.colors.navy} />
            </TouchableOpacity>
          ) : null}

          <Image
            source={require('../../../../../assets/images/logo.jpg')}
            style={styles.logo}
          />
          <Text style={styles.appName}>Alot Mahay</Text>
          <Text style={styles.appTagline}>Queue Management & Waiting Time System</Text>

          {roleLabel ? (
            <View style={[styles.roleBadge, { backgroundColor: accentColor + '15', borderColor: accentColor + '30' }]}>
              <Ionicons name={roleIcon} size={14} color={accentColor} style={{ marginRight: 5 }} />
              <Text style={[styles.roleText, { color: accentColor }]}>{roleLabel}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

          {children}

          {demoAccounts.length > 0 ? (
            <View style={styles.demoSection}>
              <View style={styles.demoHeader}>
                <Ionicons name="sparkles-outline" size={14} color={theme.colors.gold} />
                <Text style={styles.demoTitle}> Quick Demo Sign-In</Text>
              </View>
              {demoAccounts.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.demoItem}
                  onPress={() => onSelectDemoAccount && onSelectDemoAccount(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.demoItemLeft}>
                    <Text style={styles.demoItemLabel}>{item.label}</Text>
                    <Text style={styles.demoItemEmail}>{item.email}</Text>
                  </View>
                  <Ionicons name="arrow-forward-circle-outline" size={20} color={theme.colors.royalBlue} />
                </TouchableOpacity>
              ))}
              <Text style={styles.demoHint}>Default Password: 123456</Text>
            </View>
          ) : null}

          {demoNotice ? (
            <View style={styles.noticeBox}>
              <Ionicons name="shield-checkmark-outline" size={14} color={theme.colors.textMuted} style={{ marginRight: 6 }} />
              <Text style={styles.noticeText}>{demoNotice}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    justifyContent: 'center',
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: theme.colors.gold,
  },
  appName: {
    ...theme.typography.h1,
    color: theme.colors.navy,
    letterSpacing: -0.5,
  },
  appTagline: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  cardContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.md,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.navy,
    marginBottom: 4,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  demoSection: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: '#F8FAFC',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.navy,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  demoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  demoItemLeft: {
    flex: 1,
  },
  demoItemLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  demoItemEmail: {
    fontSize: 12,
    color: theme.colors.royalBlue,
  },
  demoHint: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  noticeText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textAlign: 'center',
    flex: 1,
  },
});
