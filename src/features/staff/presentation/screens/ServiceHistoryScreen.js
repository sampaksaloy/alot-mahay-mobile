import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { getStoredUser } from '../../../../core/storage/localStorage';
import { theme } from '../../../../core/theme/theme';
import { QUEUE_STATUS } from '../../../../core/constants/strings';
import { mockDataStore } from '../../../../core/data/mockDataStore';
import QueueStatusBadge from '../../../../components/QueueStatusBadge';
import EmptyState from '../../../../components/EmptyState';
import LoadingIndicator from '../../../../components/LoadingIndicator';

export default function ServiceHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const user = await getStoredUser();
      if (!user) { setHistory([]); return; }
      const staffRecord = mockDataStore.getStaffByUserId(user.id);
      const tickets = staffRecord
        ? mockDataStore.getQueueByStaffId(staffRecord.id)
        : mockDataStore.getTodayQueue();
      const completed = tickets.filter((t) =>
        [QUEUE_STATUS.COMPLETED, QUEUE_STATUS.SKIPPED].includes(t.status)
      );
      setHistory(completed);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading && history.length === 0) return <LoadingIndicator />;

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        renderItem={({ item }) => {
          const actualDuration = item.started_at && item.completed_at
            ? Math.round((new Date(item.completed_at) - new Date(item.started_at)) / 60000)
            : null;

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.number}>{item.queue_number}</Text>
                <QueueStatusBadge status={item.status} />
              </View>
              <Text style={styles.customerName}>{item.customer_name}</Text>
              <Text style={styles.serviceName}>{item.service_name}</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Est. Duration:</Text>
                <Text style={styles.detailValue}>{item.service_duration} min</Text>
              </View>
              {actualDuration !== null ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Actual Duration:</Text>
                  <Text style={[styles.detailValue, { color: theme.colors.primaryLight }]}>
                    {actualDuration} min
                  </Text>
                </View>
              ) : null}
              <Text style={styles.dateText}>{formatDate(item.completed_at || item.joined_at)}</Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="time-outline"
            title="No service history"
            message="Completed services will appear here."
          />
        }
        contentContainerStyle={history.length === 0 ? styles.emptyList : styles.listContent}
      />
    </View>
  );
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
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
    marginBottom: theme.spacing.sm,
  },
  number: { ...theme.typography.h3, color: theme.colors.primary },
  customerName: { ...theme.typography.body, fontWeight: '700', color: theme.colors.textPrimary },
  serviceName: { ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  detailLabel: { ...theme.typography.caption, color: theme.colors.textMuted },
  detailValue: { ...theme.typography.caption, color: theme.colors.textPrimary, fontWeight: '600' },
  dateText: { ...theme.typography.caption, color: theme.colors.textMuted, marginTop: theme.spacing.sm },
});
