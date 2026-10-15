import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../../../../core/theme/theme';
import AuthLayout from '../components/AuthLayout';
import InputField from '../../../../components/InputField';
import Button from '../../../../components/Button';
import { isValidEmail, isValidPhone, isValidPassword, passwordsMatch } from '../../../../core/utils/validators';

export default function StaffRegisterScreen({ navigation }) {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    staffType: 'Barber',
    specialization: 'Haircut, Shaving',
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
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Staff email is required';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email address';
    if (!form.phone.trim()) e.phone = 'Contact number is required';
    else if (!isValidPhone(form.phone)) e.phone = 'Enter valid phone (at least 10 digits)';
    if (!form.specialization.trim()) e.specialization = 'Please list specializations';
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
      role: 'STAFF',
    });

    if (!user) {
      setAuthError('Staff registration failed. Email may already exist.');
      return;
    }

    Alert.alert(
      'Staff Account Registered',
      'Your staff profile and operational record have been created in the demo store. Please log in.',
      [{ text: 'Sign In as Staff', onPress: () => navigation.navigate('StaffLogin') }]
    );
  };

  return (
    <AuthLayout
      title="Staff Registration"
      subtitle="Register a new barber or stylist demo profile."
      roleLabel="Staff Onboarding"
      roleIcon="cut"
      roleColor={theme.colors.royalBlue}
      onBack={() => navigation.goBack()}
      demoNotice="Demo Limitation: Frontend demonstration only. In production, staff accounts are provisioned via backend admin."
    >
      {authError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{authError}</Text>
        </View>
      ) : null}

      <InputField
        label="Full Name"
        placeholder="e.g. Alex Rivera"
        leftIcon="person-outline"
        value={form.name}
        onChangeText={update('name')}
        error={errors.name}
        editable={!loading}
      />

      <InputField
        label="Staff Email"
        placeholder="alex.staff@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="mail-outline"
        value={form.email}
        onChangeText={update('email')}
        error={errors.email}
        editable={!loading}
      />

      <InputField
        label="Contact Number"
        placeholder="0927 123 4567"
        keyboardType="phone-pad"
        leftIcon="call-outline"
        value={form.phone}
        onChangeText={update('phone')}
        error={errors.phone}
        editable={!loading}
      />

      {/* Staff Type Selector */}
      <View style={styles.typeSelectorWrapper}>
        <Text style={styles.typeLabel}>Staff Role Type</Text>
        <View style={styles.typeButtonsRow}>
          {['Barber', 'Stylist', 'Colorist'].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeBtn, form.staffType === t && styles.typeBtnActive]}
              onPress={() => update('staffType')(t)}
              activeOpacity={0.7}
            >
              <Text style={[styles.typeBtnText, form.staffType === t && styles.typeBtnTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <InputField
        label="Specialization / Skills"
        placeholder="e.g. Fade, Beard Grooming, Styling"
        leftIcon="ribbon-outline"
        value={form.specialization}
        onChangeText={update('specialization')}
        error={errors.specialization}
        editable={!loading}
      />

      <InputField
        label="Password"
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
        label="Confirm Password"
        placeholder="Repeat password"
        secureTextEntry
        showSecureToggle
        leftIcon="shield-checkmark-outline"
        value={form.confirmPassword}
        onChangeText={update('confirmPassword')}
        error={errors.confirmPassword}
        editable={!loading}
      />

      <Button
        label={loading ? 'Registering Staff...' : 'Create Staff Account'}
        icon="cut-outline"
        onPress={handleRegister}
        loading={loading}
        variant="royalBlue"
        style={styles.submitButton}
      />

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already have staff credentials? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('StaffLogin')}
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
  typeSelectorWrapper: {
    marginBottom: theme.spacing.md,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  typeButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  typeBtnActive: {
    borderColor: theme.colors.royalBlue,
    backgroundColor: theme.colors.royalBlue + '12',
  },
  typeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  typeBtnTextActive: {
    color: theme.colors.royalBlue,
    fontWeight: '700',
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
  loginLink: {
    ...theme.typography.bodyBold,
    fontSize: 13,
    color: theme.colors.royalBlue,
  },
});
