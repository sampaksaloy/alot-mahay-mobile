import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../../../../core/constants/strings';
import { theme } from '../../../../core/theme/theme';
import AuthLayout from '../components/AuthLayout';
import InputField from '../../../../components/InputField';
import Button from '../../../../components/Button';
import { isValidEmail } from '../../../../core/utils/validators';

export default function StaffLoginScreen({ navigation }) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Staff email is required';
    else if (!isValidEmail(email)) e.email = 'Enter a valid staff email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    setAuthError('');
    if (!validate()) return;

    const user = await login(email, password);
    if (!user) {
      setAuthError('Incorrect staff credentials. Please check your login details.');
      return;
    }

    if (user.role === ROLES.STAFF) {
      navigation.replace('StaffStack');
    } else if (user.role === ROLES.ADMIN) {
      navigation.replace('AdminStack');
    } else {
      navigation.replace('CustomerStack');
    }
  };

  const demoAccounts = [
    { label: 'Carlos Barbero (Staff Demo)', email: 'staff@test.com', password: '123456' },
  ];

  const handleSelectDemo = (item) => {
    setEmail(item.email);
    setPassword(item.password);
    setErrors({});
    setAuthError('');
  };

  return (
    <AuthLayout
      title="Staff Workspace"
      subtitle="Sign in to call next tickets and manage active services."
      roleLabel="Staff Portal"
      roleIcon="cut"
      roleColor={theme.colors.royalBlue}
      onBack={() => navigation.navigate('Welcome')}
      demoAccounts={demoAccounts}
      onSelectDemoAccount={handleSelectDemo}
      demoNotice="Staff privileges are simulated locally for this capstone demo."
    >
      {authError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{authError}</Text>
        </View>
      ) : null}

      <InputField
        label="Staff Email"
        placeholder="e.g. staff@test.com"
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
        placeholder="Enter your staff password"
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
        label={loading ? 'Authenticating...' : 'Sign In as Staff'}
        icon="cut-outline"
        onPress={handleLogin}
        loading={loading}
        variant="royalBlue"
        style={styles.submitButton}
      />

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>New staff member? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('StaffRegister')}
          disabled={loading}
        >
          <Text style={styles.registerLink}>Register Staff Account</Text>
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
