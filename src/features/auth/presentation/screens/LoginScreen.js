import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../../../../core/constants/strings';
import { theme } from '../../../../core/theme/theme';
import Button from '../../../../components/Button';

export default function LoginScreen({ navigation }) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!password) { setError('Please enter your password'); return; }

    const user = await login(email, password);
    if (!user) {
      setError('Wrong email or password.');
      return;
    }

    if (user.role === ROLES.ADMIN) navigation.replace('AdminStack');
    else if (user.role === ROLES.STAFF) navigation.replace('StaffStack');
    else navigation.replace('CustomerStack');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Image
            source={require('../../../../../assets/images/logo.jpg')}
            style={styles.logo}
          />
          <Text style={styles.appName}>Alot Mahay</Text>
          <Text style={styles.subtitle}>Queue Management System</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={theme.colors.danger} style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Enter your password"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <Button
            label={loading ? 'Logging in...' : 'Login'}
            onPress={handleLogin}
            loading={loading}
            variant="primary"
            style={styles.loginButton}
          />

          <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
            <Text style={styles.link}>Don't have an account? Register here</Text>
          </TouchableOpacity>

          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Demo Accounts</Text>
            <TouchableOpacity
              style={styles.demoAccount}
              onPress={() => { setEmail('customer@test.com'); setPassword('123456'); }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="person-outline" size={16} color={theme.colors.navy} style={{ marginRight: 6 }} />
                <Text style={styles.demoRole}>Customer</Text>
              </View>
              <Text style={styles.demoEmail}>customer@test.com</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.demoAccount}
              onPress={() => { setEmail('staff@test.com'); setPassword('123456'); }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="cut-outline" size={16} color={theme.colors.royalBlue} style={{ marginRight: 6 }} />
                <Text style={styles.demoRole}>Staff</Text>
              </View>
              <Text style={styles.demoEmail}>staff@test.com</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.demoAccount}
              onPress={() => { setEmail('admin@test.com'); setPassword('123456'); }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="shield-checkmark-outline" size={16} color="#334155" style={{ marginRight: 6 }} />
                <Text style={styles.demoRole}>Admin</Text>
              </View>
              <Text style={styles.demoEmail}>admin@test.com</Text>
            </TouchableOpacity>
            <Text style={styles.demoHint}>Password for all: 123456</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  appName: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 6,
    marginTop: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 50 },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  eyeIcon: { fontSize: 18 },
  errorBox: {
    backgroundColor: theme.colors.danger + '15',
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.danger,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 13,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  link: {
    color: theme.colors.primaryLight,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: theme.spacing.lg,
  },
  demoSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  demoTitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  demoAccount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  demoRole: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
    fontSize: 14,
  },
  demoEmail: {
    color: theme.colors.primaryLight,
    fontSize: 13,
  },
  demoHint: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});