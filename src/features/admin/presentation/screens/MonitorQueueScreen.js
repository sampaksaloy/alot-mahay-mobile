import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTodayQueue } from '../../../staff/presentation/hooks/useTodayQueue';
import { theme } from '../../../../core/theme/theme';
import { COLORS } from '../../../../core/constants/colors';

// Read-only overview sa tibuok queue (admin), dili sama sa TodayQueueScreen
// nga naay action buttons para sa staff.
export default function MonitorQueueScreen() {
  const { queueList, loading } = useTodayQueue();

  return (
    <View style={styles.container}>
      <Text style={theme.typography.h2}>Monitor Queue</Text>
      <FlatList
        data={queueList}
        refreshing={loading}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.queueNumber}</Text>
            <Text style={{ color: COLORS.status[item.status] }}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
});
