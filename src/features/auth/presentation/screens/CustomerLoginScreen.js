import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../../../../core/constants/strings';
import { theme } from '../../../../core/theme/theme';
import AuthLayout from '../components/AuthLayout';
import InputField from '../../../../components/InputField';
import Button from '../../../../components/Button';
import { isValidEmail } from '../../../../core/utils/validators';

export default function CustomerLoginScreen({ navigation }) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email address is required';
    else if (!isValidEmail(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    setAuthError('');
    if (!validate()) return;

    const user = await login(email, password);
    if (!user) {
      setAuthError('Incorrect email or password. Please try again.');
      return;
    }

    if (user.role === ROLES.CUSTOMER) {
      navigation.replace('CustomerStack');
    } else if (user.role === ROLES.STAFF) {
      navigation.replace('StaffStack');
    } else {
      navigation.replace('AdminStack');
    }
  };

  const demoAccounts = [
    { label: 'Juan Dela Cruz (Customer Demo)', email: 'customer@test.com', password: '123456' },
  ];

  const handleSelectDemo = (item) => {
    setEmail(item.email);
    setPassword(item.password);
    setErrors({});
    setAuthError('');
  };

  return (
    <AuthLayout
      title="Customer Sign In"
      subtitle="Welcome back! Track queues and book your spot."
      roleLabel="Customer Portal"
      roleIcon="person-outline"
      roleColor={theme.colors.navy}
      onBack={() => navigation.navigate('Welcome')}
      demoAccounts={demoAccounts}
      onSelectDemoAccount={handleSelectDemo}
    >
      {authError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{authError}</Text>
        </View>
      ) : null}

      <InputField
        label="Email Address"
        placeholder="e.g. customer@test.com"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="mail-outline"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
        }}
        error={errors.email}
        editable={!loading}
      />

      <InputField
        label="Password"
        placeholder="Enter your password"
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
        label={loading ? 'Signing In...' : 'Sign In as Customer'}
        icon="log-in-outline"
        onPress={handleLogin}
        loading={loading}
        variant="primary"
        style={styles.submitButton}
      />

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Don't have a customer account? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CustomerRegister')}
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
