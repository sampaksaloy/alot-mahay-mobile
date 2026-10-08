import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../../../../core/theme/theme';

export default function RegisterScreen({ navigation }) {
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '' });

  const update = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    const user = await register(form);
    if (!user) {
      Alert.alert('', error || 'Registration failed.');
      return;
    }
    Alert.alert('', 'Account created! Balik sa Login.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome! Please Register Here</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={form.name} onChangeText={update('name')} />
      <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={form.phone} onChangeText={update('phone')} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={update('email')} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={form.password} onChangeText={update('password')} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={form.confirmPassword} onChangeText={update('confirmPassword')} />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Please wait...' : 'Register'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Naa nay account? Login dinhi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg, justifyContent: 'center', backgroundColor: theme.colors.background },
  title: { ...theme.typography.h2, color: theme.colors.primary, textAlign: 'center', marginBottom: theme.spacing.xl },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    color: theme.colors.textPrimary,
  },
  button: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.sm, paddingVertical: 14, alignItems: 'center', marginTop: theme.spacing.sm },
  buttonText: { color: theme.colors.white, fontWeight: '600' },
  link: { color: theme.colors.primaryLight || theme.colors.primary, textAlign: 'center', marginTop: theme.spacing.md, fontWeight: '600' },
});