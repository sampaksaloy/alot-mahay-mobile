import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getMyProfileUseCase } from '../../domain/usecases/getMyProfileUseCase';
import { theme } from '../../../../core/theme/theme';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfileUseCase().then(setUser).finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} />;
  if (!user) return <View style={styles.center}><Text>Wala nakuha ang profile.</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={theme.typography.h2}>{user.name}</Text>
      <Text style={styles.label}>Email: {user.email}</Text>
      <Text style={styles.label}>Phone: {user.phone}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { marginTop: theme.spacing.sm, color: theme.colors.textSecondary },
});
