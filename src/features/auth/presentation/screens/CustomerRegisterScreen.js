import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../../../../core/theme/theme';
import AuthLayout from '../components/AuthLayout';
import InputField from '../../../../components/InputField';
import Button from '../../../../components/Button';
import { isValidEmail, isValidPhone, isValidPassword, passwordsMatch } from '../../../../core/utils/validators';

export default function CustomerRegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('Creating account...');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
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

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!isValidPhone(form.phone)) e.phone = 'Enter valid phone (at least 10 digits)';
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email address';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.password) e.password = 'Password is required';
    else if (!isValidPassword(form.password)) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Confirm your password';
    else if (!passwordsMatch(form.password, form.confirmPassword))
      e.confirmPassword = 'Passwords do not match';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNextStep = () => {
    setAuthError('');
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleRegister = async () => {
    setAuthError('');
    if (!validateStep2()) return;

    setSubmitting(true);
    setLoadingPhase('Validating customer information...');

    setTimeout(() => {
      setLoadingPhase('Setting up queue profile & security...');
    }, 500);

    try {
      const user = await register({ ...form, role: 'CUSTOMER' });
      if (!user) {
        setSubmitting(false);
        setAuthError('Registration failed. Email might already be registered.');
        return;
      }

      setLoadingPhase('Account created! Finalizing...');
      setTimeout(() => {
        setSubmitting(false);
        Alert.alert(
          'Registration Successful',
          'Welcome to Alot Mahay! Your customer profile has been activated. Please sign in.',
          [{ text: 'Sign In Now', onPress: () => navigation.navigate('CustomerLogin') }]
        );
      }, 400);
    } catch (err) {
      setSubmitting(false);
      setAuthError('Registration error. Please check your details and try again.');
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to join salon queues and skip the wait."
      roleLabel="Customer Registration"
      roleIcon="person-add-outline"
      roleColor={theme.colors.navy}
      onBack={() => {
        if (currentStep === 2) setCurrentStep(1);
        else navigation.goBack();
      }}
    >
      {/* Visual Step Progress Indicator */}
      <View style={styles.stepProgressContainer}>
        <View style={styles.stepHeaderRow}>
          <Text style={styles.stepTitle}>
            {currentStep === 1
              ? 'Step 1 of 2: Personal Details'
              : 'Step 2 of 2: Account Security'}
          </Text>
          <Text style={styles.stepPercentage}>
            {currentStep === 1 ? '50%' : '100%'}
          </Text>
        </View>

        {/* Progress bar track */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarActive,
              { width: currentStep === 1 ? '50%' : '100%' },
            ]}
          />
        </View>

        {/* Step Nodes */}
        <View style={styles.stepNodesRow}>
          <TouchableOpacity
            style={[styles.stepNode, currentStep >= 1 && styles.stepNodeActive]}
            onPress={() => setCurrentStep(1)}
            disabled={submitting}
          >
            <Ionicons
              name={currentStep > 1 ? 'checkmark' : 'person-outline'}
              size={14}
              color={currentStep >= 1 ? '#FFFFFF' : '#94A3B8'}
            />
            <Text style={[styles.stepNodeLabel, currentStep >= 1 && styles.stepNodeLabelActive]}>
              1. Profile
            </Text>
          </TouchableOpacity>

          <View style={[styles.stepConnectorLine, currentStep === 2 && styles.stepConnectorActive]} />

          <View style={[styles.stepNode, currentStep === 2 && styles.stepNodeActive]}>
            <Ionicons
              name="lock-closed-outline"
              size={14}
              color={currentStep === 2 ? '#FFFFFF' : '#94A3B8'}
            />
            <Text style={[styles.stepNodeLabel, currentStep === 2 && styles.stepNodeLabelActive]}>
              2. Security
            </Text>
          </View>
        </View>
      </View>

      {authError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{authError}</Text>
        </View>
      ) : null}

      {/* STEP 1: Personal Details */}
      {currentStep === 1 && (
        <View>
          <InputField
            label="Full Name"
            placeholder="e.g. Maria Santos"
            leftIcon="person-outline"
            value={form.name}
            onChangeText={update('name')}
            error={errors.name}
            editable={!submitting}
          />

          <InputField
            label="Mobile Number"
            placeholder="0917 123 4567"
            keyboardType="phone-pad"
            leftIcon="call-outline"
            value={form.phone}
            onChangeText={update('phone')}
            error={errors.phone}
            editable={!submitting}
          />

          <InputField
            label="Email Address"
            placeholder="maria@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            value={form.email}
            onChangeText={update('email')}
            error={errors.email}
            editable={!submitting}
          />

          <Button
            label="Continue to Security"
            icon="arrow-forward-outline"
            onPress={handleNextStep}
            variant="primary"
            style={styles.submitButton}
          />
        </View>
      )}

      {/* STEP 2: Password & Credentials */}
      {currentStep === 2 && (
        <View>
          <InputField
            label="Password"
            placeholder="At least 6 characters"
            secureTextEntry
            showSecureToggle
            leftIcon="lock-closed-outline"
            value={form.password}
            onChangeText={update('password')}
            error={errors.password}
            editable={!submitting}
          />

          <InputField
            label="Confirm Password"
            placeholder="Re-type your password"
            secureTextEntry
            showSecureToggle
            leftIcon="shield-checkmark-outline"
            value={form.confirmPassword}
            onChangeText={update('confirmPassword')}
            error={errors.confirmPassword}
            editable={!submitting}
          />

          <View style={styles.step2ButtonsRow}>
            <TouchableOpacity
              style={styles.backStepButton}
              onPress={() => setCurrentStep(1)}
              disabled={submitting}
            >
              <Ionicons name="arrow-back" size={16} color={theme.colors.navy} style={{ marginRight: 4 }} />
              <Text style={styles.backStepText}>Back</Text>
            </TouchableOpacity>

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Button
                label="Complete Registration"
                icon="checkmark-circle-outline"
                onPress={handleRegister}
                loading={submitting}
                variant="primary"
              />
            </View>
          </View>
        </View>
      )}

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already registered? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CustomerLogin')}
          disabled={submitting}
        >
          <Text style={styles.loginLink}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Interactive Process Loading Modal Effect */}
      <Modal visible={submitting} transparent animationType="fade">
        <View style={styles.loadingModalOverlay}>
          <View style={styles.loadingCard}>
            <View style={styles.loadingIconCircle}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
            <Text style={styles.loadingTitle}>Creating Customer Account</Text>
            <Text style={styles.loadingSubtitle}>{loadingPhase}</Text>
            <View style={styles.loadingMiniBarBg}>
              <View style={styles.loadingMiniBarFill} />
            </View>
          </View>
        </View>
      </Modal>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  stepProgressContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.navy,
  },
  stepPercentage: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.royalBlue,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarActive: {
    height: '100%',
    backgroundColor: theme.colors.royalBlue,
    borderRadius: 3,
  },
  stepNodesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepNode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  stepNodeActive: {
    backgroundColor: theme.colors.royalBlue,
  },
  stepNodeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  stepNodeLabelActive: {
    color: '#FFFFFF',
  },
  stepConnectorLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  stepConnectorActive: {
    backgroundColor: theme.colors.royalBlue,
  },
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
  step2ButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  backStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  backStepText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.navy,
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
  loadingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 91, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.xl,
    padding: 24,
    width: '88%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.royalBlue,
    ...theme.shadows.lg,
  },
  loadingIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.royalBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 4,
  },
  loadingTitle: {
    ...theme.typography.h3,
    color: theme.colors.navy,
    marginBottom: 6,
    textAlign: 'center',
  },
  loadingSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingMiniBarBg: {
    width: '100%',
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingMiniBarFill: {
    width: '85%',
    height: '100%',
    backgroundColor: theme.colors.royalBlue,
    borderRadius: 2,
  },
});
