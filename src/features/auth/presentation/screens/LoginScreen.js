import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../../../../core/constants/strings';
import { theme } from '../../../../core/theme/theme';

export default function LoginScreen({ navigation }) {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    const user = await login(email, password, rememberMe);
    if (!user) {
      Alert.alert('', error || 'Wrong email or password.');
      return;
    }

    if (user.role === ROLES.ADMIN) navigation.replace('AdminStack');
    else if (user.role === ROLES.STAFF) navigation.replace('StaffStack');
    else navigation.replace('CustomerStack');
  };

  const handleGoogleLogin = () => {
    Alert.alert('', 'Google login coming soon.');
  };

  const handleFacebookLogin = () => {
    Alert.alert('', 'Facebook login coming soon.');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../../assets/images/logo.jpg')}
        style={styles.logo}
      />
      <Text style={styles.appName}>Alot Mahay Queue</Text>
      <Text style={styles.title}>Welcome! Please Login Here</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={styles.rememberContainer}
          onPress={() => setRememberMe(!rememberMe)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.rememberText}>Remember Me</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotLink}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Please wait...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Wala pay account boss? Register dinhi</Text>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
          <Image
            source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Gmail</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
          <Text style={[styles.socialIconText, { color: '#1877F2' }]}>f</Text>
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg, justifyContent: 'center' },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: theme.spacing.sm,
  },
  appName: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  title: { ...theme.typography.h2, color: theme.colors.primary, textAlign: 'center', marginBottom: theme.spacing.xl },
  input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.sm, padding: theme.spacing.md, marginBottom: theme.spacing.md },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  rememberContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: { color: theme.colors.white, fontSize: 13, fontWeight: 'bold' },
  rememberText: { color: theme.colors.text || '#333' },
  forgotLink: { color: theme.colors.primary },
  button: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.sm, paddingVertical: 14, alignItems: 'center', marginTop: theme.spacing.sm },
  buttonText: { color: theme.colors.white, fontWeight: '600' },
  link: { color: theme.colors.primary, textAlign: 'center', marginTop: theme.spacing.md },
   dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  dividerLine: {
    display: 'none',
  },
  dividerText: {
    marginHorizontal: theme.spacing.sm,
    color: '#000000',
    fontSize: 13,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingVertical: 12,
    marginHorizontal: 4,
    minWidth: 0,
  },
  socialIcon: { width: 18, height: 18, marginRight: 8 },
  socialIconText: { fontSize: 18, fontWeight: 'bold', marginRight: 8 },
  socialText: { fontWeight: '500', color: theme.colors.text || '#333' },
});