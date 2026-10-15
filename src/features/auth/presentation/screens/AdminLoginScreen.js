import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../../../../core/constants/strings';
import { theme } from '../../../../core/theme/theme';
import AuthLayout from '../components/AuthLayout';
import InputField from '../../../../components/InputField';
import Button from '../../../../components/Button';
import { isValidEmail } from '../../../../core/utils/validators';

export default function AdminLoginScreen({ navigation }) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Admin email is required';
    else if (!isValidEmail(email)) e.email = 'Enter a valid admin email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    setAuthError('');
    if (!validate()) return;

    const user = await login(email, password);
    if (!user) {
      setAuthError('Invalid admin credentials. Access restricted.');
      return;
    }

    if (user.role === ROLES.ADMIN) {
      navigation.replace('AdminStack');
    } else if (user.role === ROLES.STAFF) {
      navigation.replace('StaffStack');
    } else {
      navigation.replace('CustomerStack');
    }
  };

  const demoAccounts = [
    { label: 'Admin Owner (Admin Demo)', email: 'admin@test.com', password: '123456' },
  ];

  const handleSelectDemo = (item) => {
    setEmail(item.email);
    setPassword(item.password);
    setErrors({});
    setAuthError('');
  };

  return (
    <AuthLayout
      title="Admin Control Center"
      subtitle="Executive management for salon operations, staff rosters, and analytics."
      roleLabel="Admin Portal"
      roleIcon="shield-checkmark"
      roleColor="#334155"
      onBack={() => navigation.navigate('Welcome')}
      demoAccounts={demoAccounts}
      onSelectDemoAccount={handleSelectDemo}
      demoNotice="Administrative session is authenticated locally for capstone evaluation."
    >
      {authError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{authError}</Text>
        </View>
      ) : null}

      <InputField
        label="Admin Identifier / Email"
        placeholder="e.g. admin@test.com"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="shield-outline"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
        }}
        error={errors.email}
        editable={!loading}
      />

      <InputField
        label="Admin Password"
        placeholder="Enter your security password"
        secureTextEntry
        showSecureToggle
        leftIcon="lock-closed-outline"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
        }}
        error={errors.password}
        editable={!loading}
      />

      <Button
        label={loading ? 'Verifying Admin...' : 'Sign In as Administrator'}
        icon="shield-checkmark-outline"
        onPress={handleLogin}
        loading={loading}
        variant="primary"
        style={styles.submitButton}
      />

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Need to set up shop owner account? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AdminRegister')}
          disabled={loading}
        >
          <Text style={styles.registerLink}>Register</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.danger,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  errorBannerText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    backgroundColor: '#1E293B',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  footerText: {
    ...theme.typography.body,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  registerLink: {
    ...theme.typography.bodyBold,
    fontSize: 13,
    color: theme.colors.royalBlue,
  },
});
