import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../../../../core/theme/theme';
import InputField from '../../../../components/InputField';
import Button from '../../../../components/Button';
import { isValidEmail, isValidPhone, isValidPassword, passwordsMatch } from '../../../../core/utils/validators';

export default function RegisterScreen({ navigation }) {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const update = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!isValidPhone(form.phone)) e.phone = 'Enter a valid phone number (10+ digits)';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (!isValidPassword(form.password)) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (!passwordsMatch(form.password, form.confirmPassword)) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    const user = await register(form);
    if (!user) {
      Alert.alert('Registration Failed', 'Email may already be registered.');
      return;
    }
    Alert.alert('Success', 'Account created! Please log in.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Alot Mahay and skip the wait</Text>

          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            value={form.name}
            onChangeText={update('name')}
            error={errors.name}
            editable={!loading}
          />
          <InputField
            label="Phone Number"
            placeholder="09XX XXX XXXX"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={update('phone')}
            error={errors.phone}
            editable={!loading}
          />
          <InputField
            label="Email"
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={update('email')}
            error={errors.email}
            editable={!loading}
          />
          <InputField
            label="Password"
            placeholder="Min. 6 characters"
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={update('password')}
            error={errors.password}
            editable={!loading}
          />
          <InputField
            label="Confirm Password"
            placeholder="Re-enter password"
            secureTextEntry={!showPassword}
            value={form.confirmPassword}
            onChangeText={update('confirmPassword')}
            error={errors.confirmPassword}
            editable={!loading}
          />

          <TouchableOpacity
            style={styles.togglePasswordRow}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={theme.colors.royalBlue}
              style={{ marginRight: 5 }}
            />
            <Text style={styles.togglePassword}>
              {showPassword ? 'Hide password' : 'Show password'}
            </Text>
          </TouchableOpacity>

          <Button
            label={loading ? 'Creating account...' : 'Register'}
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
            <Text style={styles.link}>Already have an account? Login here</Text>
          </TouchableOpacity>
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
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  togglePasswordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  togglePassword: {
    ...theme.typography.caption,
    color: theme.colors.royalBlue,
    fontWeight: '600',
  },
  registerButton: {
    marginBottom: theme.spacing.md,
  },
  link: {
    color: theme.colors.primaryLight,
    textAlign: 'center',
    fontWeight: '600',
  },
});