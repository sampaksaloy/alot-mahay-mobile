import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { useTodayQueue } from '../hooks/useTodayQueue';
import { getStoredUser } from '../../../../core/storage/localStorage';
import { theme } from '../../../../core/theme/theme';
import { COLORS } from '../../../../core/constants/colors';
import { QUEUE_STATUS } from '../../../../core/constants/strings';
import QueueStatusBadge from '../../../../components/QueueStatusBadge';
import Button from '../../../../components/Button';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import EmptyState from '../../../../components/EmptyState';
import FilterChips from '../../../../components/FilterChips';
import { mockDataStore } from '../../../../core/data/mockDataStore';

export default function TodayQueueScreen() {
  const { queueList, loading, refresh, callNext, startService, completeService, skipCustomer } = useTodayQueue();
  const [staffRecord, setStaffRecord] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { id, action, label }

  useEffect(() => {
    (async () => {
      const u = await getStoredUser();
      if (u) setStaffRecord(mockDataStore.getStaffByUserId(u.id));
    })();
  }, []);

  const myQueue = staffRecord
    ? queueList.filter((t) => t.staff_id === staffRecord.id)
    : queueList;

  const filtered = statusFilter
    ? myQueue.filter((t) => t.status === statusFilter)
    : myQueue;

  const statusOptions = ['All', ...Object.values(QUEUE_STATUS)];

  const handleAction = async () => {
    if (!confirmAction) return;
    try {
      switch (confirmAction.action) {
        case 'call': await callNext(confirmAction.id); break;
        case 'start': await startService(confirmAction.id); break;
        case 'complete': await completeService(confirmAction.id); break;
        case 'skip': await skipCustomer(confirmAction.id); break;
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setConfirmAction(null);
  };

  const getActions = (ticket) => {
    const actions = [];
    if (ticket.status === QUEUE_STATUS.WAITING) {
      actions.push({ action: 'call', label: 'Call', icon: 'megaphone-outline', variant: 'royalBlue' });
      actions.push({ action: 'skip', label: 'Skip', icon: 'play-skip-forward-outline', variant: 'outline' });
    }
    if (ticket.status === QUEUE_STATUS.CALLED) {
      actions.push({ action: 'start', label: 'Start', icon: 'play-outline', variant: 'primary' });
      actions.push({ action: 'skip', label: 'Skip', icon: 'play-skip-forward-outline', variant: 'outline' });
    }
    if (ticket.status === QUEUE_STATUS.IN_SERVICE) {
      actions.push({ action: 'complete', label: 'Complete', icon: 'checkmark-circle-outline', variant: 'primary' });
    }
    return actions;
  };

  return (
    <View style={styles.container}>
      <FilterChips
        options={statusOptions}
        selected={statusFilter}
        onSelect={(s) => setStatusFilter(s === 'All' ? null : s)}
        style={styles.filters}
      />
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
            <Text style={styles.customerName}>{item.customer_name}</Text>
            <Text style={styles.serviceName}>{item.service_name} · {item.service_duration} min</Text>
            {item.estimated_wait_time > 0 ? (
              <Text style={styles.waitTime}>Est. wait: ~{item.estimated_wait_time} min</Text>
            ) : null}
            <View style={styles.actions}>
              {getActions(item).map(({ action, label, icon, variant }) => (
                <Button
                  key={action}
                  label={label}
                  icon={icon}
                  size="small"
                  variant={variant}
                  onPress={() => setConfirmAction({ id: item.id, action, label: `${label} ${item.customer_name}?` })}
                  style={styles.actionBtn}
                />
              ))}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="list-outline"
            title="No tickets"
            message={statusFilter ? `No ${statusFilter} tickets today.` : "No queue tickets today."}
          />
        }
        contentContainerStyle={filtered.length === 0 ? styles.emptyList : styles.listContent}
      />
      <ConfirmationModal
        visible={!!confirmAction}
        title="Confirm Action"
        message={confirmAction?.label || ''}
        confirmLabel="Yes"
        confirmVariant="primary"
        onConfirm={handleAction}
        onCancel={() => setConfirmAction(null)}
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
  filters: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md },
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
  queueInfo: { flexDirection: 'row', alignItems: 'center' },
  number: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  time: { ...theme.typography.caption, color: theme.colors.textMuted },
  customerName: { ...theme.typography.body, fontWeight: '700', color: theme.colors.textPrimary },
  serviceName: { ...theme.typography.caption, color: theme.colors.textSecondary, marginTop: 2 },
  waitTime: { ...theme.typography.caption, color: theme.colors.primaryLight, marginTop: 4 },
  actions: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
    flexWrap: 'wrap',
  },
  actionBtn: {
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    minWidth: 90,
  },
});
