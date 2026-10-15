import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../../../../core/theme/theme';
import AuthLayout from '../components/AuthLayout';
import InputField from '../../../../components/InputField';
import Button from '../../../../components/Button';
import { isValidEmail, isValidPhone, isValidPassword, passwordsMatch } from '../../../../core/utils/validators';

export default function AdminRegisterScreen({ navigation }) {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const update = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
    if (authError) setAuthError('');
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Administrator / Owner name is required';
    if (!form.email.trim()) e.email = 'Admin email is required';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email address';
    if (!form.phone.trim()) e.phone = 'Contact number is required';
    else if (!isValidPhone(form.phone)) e.phone = 'Enter valid phone (at least 10 digits)';
    if (!form.password) e.password = 'Password is required';
    else if (!isValidPassword(form.password)) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Confirm your password';
    else if (!passwordsMatch(form.password, form.confirmPassword))
      e.confirmPassword = 'Passwords do not match';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    setAuthError('');
    if (!validate()) return;

    const user = await register({
      ...form,
      role: 'ADMIN',
    });

    if (!user) {
      setAuthError('Admin registration failed. Email might already exist.');
      return;
    }

    Alert.alert(
      'Admin Profile Initialized',
      'Mock administrator credentials configured in local store. Please log in to access the control center.',
      [{ text: 'Proceed to Admin Sign In', onPress: () => navigation.navigate('AdminLogin') }]
    );
  };

  return (
    <AuthLayout
      title="Admin Registration"
      subtitle="Register an administrative account for salon management."
      roleLabel="Admin Setup"
      roleIcon="shield-checkmark"
      roleColor="#334155"
      onBack={() => navigation.goBack()}
      demoNotice="Important Note: This frontend-only registration operates in local demo mode. In a production deployment, administrator accounts are strictly governed and provisioned via secure backend channels."
    >
      {authError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{authError}</Text>
        </View>
      ) : null}

      <InputField
        label="Owner / Administrator Name"
        placeholder="e.g. Maria Clara (Owner)"
        leftIcon="person-outline"
        value={form.name}
        onChangeText={update('name')}
        error={errors.name}
        editable={!loading}
      />

      <InputField
        label="Administrative Email"
        placeholder="owner@alotmahay.ph"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="mail-outline"
        value={form.email}
        onChangeText={update('email')}
        error={errors.email}
        editable={!loading}
      />

      <InputField
        label="Direct Mobile Number"
        placeholder="0937 123 4567"
        keyboardType="phone-pad"
        leftIcon="call-outline"
        value={form.phone}
        onChangeText={update('phone')}
        error={errors.phone}
        editable={!loading}
      />

      <InputField
        label="Admin Password"
        placeholder="Minimum 6 characters"
        secureTextEntry
        showSecureToggle
        leftIcon="lock-closed-outline"
        value={form.password}
        onChangeText={update('password')}
        error={errors.password}
        editable={!loading}
      />

      <InputField
        label="Confirm Admin Password"
        placeholder="Re-enter password"
        secureTextEntry
        showSecureToggle
        leftIcon="shield-checkmark-outline"
        value={form.confirmPassword}
        onChangeText={update('confirmPassword')}
        error={errors.confirmPassword}
        editable={!loading}
      />

      <Button
        label={loading ? 'Registering Admin...' : 'Register Administrator'}
        icon="shield-checkmark-outline"
        onPress={handleRegister}
        loading={loading}
        variant="primary"
        style={styles.submitButton}
      />

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already have admin credentials? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AdminLogin')}
          disabled={loading}
        >
          <Text style={styles.loginLink}>Sign In</Text>
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
  loginLink: {
    ...theme.typography.bodyBold,
    fontSize: 13,
    color: theme.colors.royalBlue,
  },
});
