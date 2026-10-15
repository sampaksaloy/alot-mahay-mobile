import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMyQueueUseCase } from '../../domain/usecases/getMyQueueUseCase';
import { theme } from '../../../../core/theme/theme';
import { QUEUE_STATUS } from '../../../../core/constants/strings';
import QueueStatusBadge from '../../../../components/QueueStatusBadge';
import EmptyState from '../../../../components/EmptyState';
import LoadingIndicator from '../../../../components/LoadingIndicator';
import { mockDataStore } from '../../../../core/data/mockDataStore';

export default function QueueHistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getMyQueueUseCase();
      const past = (list || []).filter(
        (t) => [QUEUE_STATUS.COMPLETED, QUEUE_STATUS.CANCELLED, QUEUE_STATUS.SKIPPED].includes(t.status)
      );
      setHistory(past);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const isRated = (queueId) => !!mockDataStore.getRatingByQueueId(queueId);

  if (loading && history.length === 0) return <LoadingIndicator />;

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.queueNumber}>{item.queueNumber || item.queue_number}</Text>
              <QueueStatusBadge status={item.status} />
            </View>
            <Text style={styles.serviceName}>{item.serviceName || item.service_name}</Text>
            <Text style={styles.staffName}>
              {item.staffName || item.staff_name ? `with ${item.staffName || item.staff_name}` : ''}
            </Text>
            <Text style={styles.date}>{formatDate(item.joinedAt || item.joined_at)}</Text>
            {item.status === QUEUE_STATUS.COMPLETED && !isRated(item.id) ? (
              <TouchableOpacity
                style={styles.rateButton}
                onPress={() => navigation.navigate('RateService', { queueId: item.id })}
                accessibilityRole="button"
                accessibilityLabel="Rate this service"
              >
                <Ionicons name="star" size={14} color="#B45309" style={{ marginRight: 5 }} />
                <Text style={styles.rateButtonText}>Rate this service</Text>
              </TouchableOpacity>
            ) : item.status === QUEUE_STATUS.COMPLETED && isRated(item.id) ? (
              <View style={styles.ratedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={theme.colors.success} style={{ marginRight: 4 }} />
                <Text style={styles.ratedText}>Feedback Submitted</Text>
              </View>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-outline"
            title="No history yet"
            message="Your past queue tickets will appear here."
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
  queueNumber: { ...theme.typography.h3, color: theme.colors.primary },
  serviceName: { ...theme.typography.body, color: theme.colors.textPrimary, fontWeight: '600' },
  staffName: { ...theme.typography.caption, color: theme.colors.textSecondary },
  date: { ...theme.typography.caption, color: theme.colors.textMuted, marginTop: theme.spacing.xs },
  rateButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#FEF3C7',
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  rateButtonText: {
    color: '#92400E',
    fontWeight: '700',
    fontSize: 13,
  },
  ratedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.sm,
  },
  ratedText: {
    ...theme.typography.captionBold,
    color: '#15803D',
    fontSize: 12,
  },
});
