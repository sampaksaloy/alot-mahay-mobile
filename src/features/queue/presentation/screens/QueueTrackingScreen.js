import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useQueue } from '../hooks/useQueue';
import { theme } from '../../../../core/theme/theme';
import { COLORS } from '../../../../core/constants/colors';

export default function QueueTrackingScreen() {
  const { queue, loading, refreshMyQueue } = useQueue();

  useEffect(() => {
    refreshMyQueue();
  }, [refreshMyQueue]);

  if (loading) return <ActivityIndicator style={styles.center} />;
  if (!queue) return <View style={styles.center}><Text>Walay active queue.</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.queueNumber}>{queue.queueNumber}</Text>
      <Text style={[styles.status, { color: COLORS.status[queue.status] }]}>{queue.status}</Text>
      <Text style={styles.waitTime}>Estimated waiting time: {queue.estimatedWaitTime} min</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  queueNumber: { fontSize: 48, fontWeight: '800', color: theme.colors.primary },
  status: { fontSize: 16, fontWeight: '700', marginTop: theme.spacing.sm },
  waitTime: { marginTop: theme.spacing.md, color: theme.colors.textSecondary },
});
