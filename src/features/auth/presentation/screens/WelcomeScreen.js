import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme/theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Brand Header */}
      <View style={styles.brandSection}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../../../../assets/images/logo.jpg')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.appName}>Alot Mahay</Text>
        <Text style={styles.tagline}>
          Mobile Queue Management & Waiting Time Prediction System
        </Text>
        <View style={styles.pillRow}>
          <View style={styles.featurePill}>
            <Ionicons name="flash-outline" size={13} color={theme.colors.royalBlue} />
            <Text style={styles.featurePillText}>Live Queue</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="time-outline" size={13} color={theme.colors.royalBlue} />
            <Text style={styles.featurePillText}>Smart Prediction</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="cut-outline" size={13} color={theme.colors.royalBlue} />
            <Text style={styles.featurePillText}>Salon & Barbershop</Text>
          </View>
        </View>
      </View>

      {/* Role Selection Cards */}
      <View style={styles.selectionSection}>
        <Text style={styles.sectionHeading}>Select Your Portal</Text>

        {/* Customer Entry */}
        <TouchableOpacity
          style={[styles.roleCard, styles.customerCard]}
          onPress={() => navigation.navigate('CustomerLogin')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Continue as Customer"
        >
          <View style={[styles.roleIconCircle, { backgroundColor: theme.colors.navy }]}>
            <Ionicons name="person" size={24} color={theme.colors.white} />
          </View>
          <View style={styles.roleInfo}>
            <View style={styles.roleTitleRow}>
              <Text style={styles.roleTitle}>Customer</Text>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Most Common</Text>
              </View>
            </View>
            <Text style={styles.roleDescription}>
              Browse services, join the queue remotely, and track your waiting time in real time.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={theme.colors.navy} />
        </TouchableOpacity>

        {/* Staff Entry */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => navigation.navigate('StaffLogin')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Staff Login"
        >
          <View style={[styles.roleIconCircle, { backgroundColor: theme.colors.royalBlue }]}>
            <Ionicons name="cut" size={22} color={theme.colors.white} />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Staff Member</Text>
            <Text style={styles.roleDescription}>
              Operational workspace for barbers & stylists to call next tickets and manage serving queue.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={theme.colors.royalBlue} />
        </TouchableOpacity>

        {/* Admin Entry */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => navigation.navigate('AdminLogin')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Admin Login"
        >
          <View style={[styles.roleIconCircle, { backgroundColor: theme.colors.navy }]}>
            <Ionicons name="shield-checkmark" size={22} color={theme.colors.white} />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Admin / Owner</Text>
            <Text style={styles.roleDescription}>
              Manage services, staff rosters, operational schedules, queues, and analytics.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={theme.colors.navy} />
        </TouchableOpacity>
      </View>

      {/* Customer Quick Register */}
      <View style={styles.footerSection}>
        <Text style={styles.footerText}>New to Alot Mahay?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CustomerRegister')}
          style={styles.registerLink}
        >
          <Text style={styles.registerLinkText}>Create Customer Account</Text>
          <Ionicons name="arrow-forward" size={14} color={theme.colors.royalBlue} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxl,
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.surface,
    padding: 3,
    marginBottom: theme.spacing.md,
    borderWidth: 2.5,
    borderColor: theme.colors.royalBlue,
    ...theme.shadows.md,
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },
  appName: {
    ...theme.typography.h1,
    fontSize: 30,
    color: theme.colors.navy,
    letterSpacing: -0.5,
  },
  tagline: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 290,
    lineHeight: 20,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: theme.spacing.md,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F5FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4E2F9',
  },
  featurePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.navy,
    marginLeft: 4,
  },
  selectionSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeading: {
    ...theme.typography.captionBold,
    color: theme.colors.navy,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  customerCard: {
    borderColor: theme.colors.royalBlue,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
  },
  roleIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  roleInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  roleTitle: {
    ...theme.typography.bodyBold,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  recommendedBadge: {
    backgroundColor: '#EBF2FD',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#D4E2F9',
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.royalBlue,
  },
  roleDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },
  footerSection: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  footerText: {
    ...theme.typography.body,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  registerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingVertical: 4,
  },
  registerLinkText: {
    ...theme.typography.bodyBold,
    fontSize: 14,
    color: theme.colors.royalBlue,
  },
});
