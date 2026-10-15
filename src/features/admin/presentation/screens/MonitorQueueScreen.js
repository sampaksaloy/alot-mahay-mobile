import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useTodayQueue } from '../../../staff/presentation/hooks/useTodayQueue';
import { theme } from '../../../../core/theme/theme';
import { COLORS } from '../../../../core/constants/colors';
import { QUEUE_STATUS } from '../../../../core/constants/strings';
import QueueStatusBadge from '../../../../components/QueueStatusBadge';
import FilterChips from '../../../../components/FilterChips';
import EmptyState from '../../../../components/EmptyState';
import { mockDataStore } from '../../../../core/data/mockDataStore';

export default function MonitorQueueScreen() {
  const { queueList, loading, refresh } = useTodayQueue();
  const [statusFilter, setStatusFilter] = useState(null);
  const [staffFilter, setStaffFilter] = useState(null);

  const staffNames = [...new Set(queueList.map((t) => t.staff_name).filter(Boolean))];
  const statusOptions = ['All', ...Object.values(QUEUE_STATUS)];

  let filtered = queueList;
  if (statusFilter) filtered = filtered.filter((t) => t.status === statusFilter);
  if (staffFilter) filtered = filtered.filter((t) => t.staff_name === staffFilter);

  return (
    <View style={styles.container}>
      <FilterChips
        options={statusOptions}
        selected={statusFilter}
        onSelect={(s) => setStatusFilter(s === 'All' ? null : s)}
        style={styles.filters}
      />
      {staffNames.length > 1 ? (
        <FilterChips
          options={['All Staff', ...staffNames]}
          selected={staffFilter}
          onSelect={(s) => setStaffFilter(s === 'All Staff' ? null : s)}
          style={styles.filters}
        />
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.queueInfo}>
                <Text style={styles.number}>{item.queue_number}</Text>
                <QueueStatusBadge status={item.status} />
              </View>
              <Text style={styles.time}>{formatTime(item.joined_at)}</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardRow}>
                <Text style={styles.label}>Customer</Text>
                <Text style={styles.value}>{item.customer_name}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.label}>Service</Text>
                <Text style={styles.value}>{item.service_name}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.label}>Staff</Text>
                <Text style={styles.value}>{item.staff_name}</Text>
              </View>
              {item.estimated_wait_time > 0 ? (
                <View style={styles.cardRow}>
                  <Text style={styles.label}>Est. Wait</Text>
                  <Text style={[styles.value, { color: theme.colors.primaryLight }]}>~{item.estimated_wait_time} min</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState icon="time-outline" title="No queue tickets" message="No tickets match your filter" />
        }
        contentContainerStyle={filtered.length === 0 ? styles.emptyList : styles.listContent}
      />
    </View>
  );
}

function formatTime(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  filters: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.sm },
  listContent: { padding: theme.spacing.lg },
  emptyList: { flexGrow: 1, padding: theme.spacing.lg },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  queueInfo: { flexDirection: 'row', alignItems: 'center' },
  number: { fontSize: 18, fontWeight: '800', color: theme.colors.primary, marginRight: theme.spacing.sm },
  time: { ...theme.typography.caption, color: theme.colors.textMuted },
  cardBody: {},
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: { ...theme.typography.caption, color: theme.colors.textMuted },
  value: { ...theme.typography.body, color: theme.colors.textPrimary, fontWeight: '600', fontSize: 13 },
});
