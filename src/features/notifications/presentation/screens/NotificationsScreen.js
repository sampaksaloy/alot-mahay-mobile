import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { getNotificationsUseCase } from '../../domain/usecases/getNotificationsUseCase';
import { notificationRepositoryImpl } from '../../data/repositories/notificationRepositoryImpl';
import { theme } from '../../../../core/theme/theme';
import EmptyState from '../../../../components/EmptyState';
import LoadingIndicator from '../../../../components/LoadingIndicator';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getNotificationsUseCase();
      setNotifications(list || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleMarkRead = async (id) => {
    await notificationRepositoryImpl.markRead(id);
    loadData();
  };

  if (loading && notifications.length === 0) return <LoadingIndicator />;

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, !item.read && styles.itemUnread]}
            onPress={() => !item.read && handleMarkRead(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.itemHeader}>
              <Text style={[styles.title, !item.read && styles.titleUnread]}>{item.title}</Text>
              {!item.read ? <View style={styles.unreadDot} /> : null}
            </View>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{formatTime(item.created_at)}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-outline"
            title="No notifications"
            message="You're all caught up!"
          />
        }
        contentContainerStyle={notifications.length === 0 ? styles.emptyList : styles.listContent}
      />
    </View>
  );
}

function formatTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const now = new Date();
  const diffMin = Math.round((now - d) / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffMin < 1440) return `${Math.round(diffMin / 60)}h ago`;
  return d.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { padding: theme.spacing.lg },
  emptyList: { flexGrow: 1, padding: theme.spacing.lg },
  item: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemUnread: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primaryLight,
    backgroundColor: theme.colors.primaryLight + '08',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  titleUnread: { fontWeight: '700' },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primaryLight,
    marginLeft: theme.spacing.sm,
  },
  message: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.xs,
  },
  time: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    fontSize: 11,
  },
});
