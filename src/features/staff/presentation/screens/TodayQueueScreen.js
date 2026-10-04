import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTodayQueue } from '../hooks/useTodayQueue';
import { theme } from '../../../../core/theme/theme';
import { COLORS } from '../../../../core/constants/colors';

export default function TodayQueueScreen() {
  const { queueList, loading, callNext, startService, completeService, skipCustomer } = useTodayQueue();

  return (
    <View style={styles.container}>
      <Text style={theme.typography.h2}>Today's Queue</Text>
      <FlatList
        data={queueList}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.number}>{item.queueNumber}</Text>
            <Text style={{ color: COLORS.status[item.status] }}>{item.status}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => callNext(item.id)}><Text style={styles.action}>Call</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => startService(item.id)}><Text style={styles.action}>Start</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => completeService(item.id)}><Text style={styles.action}>Complete</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => skipCustomer(item.id)}><Text style={styles.action}>Skip</Text></TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Walay queue karon.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  card: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, padding: theme.spacing.md, marginTop: theme.spacing.sm },
  number: { fontSize: 20, fontWeight: '700' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: theme.spacing.sm },
  action: { color: theme.colors.primary, fontWeight: '600' },
  empty: { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.xl },
});
