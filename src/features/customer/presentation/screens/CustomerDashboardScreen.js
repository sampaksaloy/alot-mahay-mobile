import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getMyQueueUseCase } from '../../../queue/domain/usecases/getMyQueueUseCase';
import { getStoredUser } from '../../../../core/storage/localStorage';
import QueueStatusBadge from '../../../../components/QueueStatusBadge';
import { theme } from '../../../../core/theme/theme';
import { QUEUE_STATUS } from '../../../../core/constants/strings';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function CustomerDashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [currentQueue, setCurrentQueue] = useState(null);
  const [recentVisits, setRecentVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = await getStoredUser();
      setUser(storedUser);

      const list = await getMyQueueUseCase();
      const active = (list ?? []).find(
        (q) => q.status !== QUEUE_STATUS.COMPLETED && q.status !== QUEUE_STATUS.CANCELLED
      );
      const completed = (list ?? []).filter((q) => q.status === QUEUE_STATUS.COMPLETED);

      setCurrentQueue(active ?? null);
      setRecentVisits(completed.slice(0, 3));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation, loadData]);

  const quickActions = [
    { label: 'Services', route: 'ServiceList', icon: '✂️' },
    { label: 'History', route: 'QueueHistory', icon: '🕘' },
    { label: 'Profile', route: 'Profile', icon: '👤' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>{user?.name ?? 'Guest'}</Text>
        </View>
        <TouchableOpacity
          style={styles.bellButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {loading ? (
          <Text style={styles.cardEmptyText}>Checking your queue...</Text>
        ) : currentQueue ? (
          <>
            <View style={styles.cardRowBetween}>
              <Text style={styles.cardLabel}>Current Queue</Text>
              <QueueStatusBadge status={currentQueue.status} />
            </View>
            <Text style={styles.queueNumber}>{currentQueue.queueNumber}</Text>
            <Text style={styles.cardSubText}>{currentQueue.serviceName}</Text>
            {currentQueue.staffName ? (
              <Text style={styles.cardSubTextLight}>with {currentQueue.staffName}</Text>
            ) : null}
            {currentQueue.estimatedWaitTime != null ? (
              <Text style={styles.waitTime}>
                🕐 Est. wait {currentQueue.estimatedWaitTime} min
              </Text>
            ) : null}
          </>
        ) : (
          <>
            <Text style={styles.cardLabel}>No Active Queue</Text>
            <Text style={styles.cardEmptyText}>Join a queue to get started.</Text>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => navigation.navigate('JoinQueue')}
        activeOpacity={0.85}
      >
        <Text style={styles.joinButtonText}>+ Join a New Queue</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        {quickActions.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.actionItem}
            onPress={() => navigation.navigate(item.route)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>{item.icon}</Text>
            <Text style={styles.actionLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Recent Visits</Text>
      {recentVisits.length === 0 ? (
        <Text style={styles.cardEmptyText}>No recent visits yet.</Text>
      ) : (
        recentVisits.map((visit) => (
          <TouchableOpacity
            key={visit.id}
            style={styles.visitItem}
            onPress={() => navigation.navigate('RateService', { queueId: visit.id })}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.visitService}>{visit.serviceName}</Text>
              <Text style={styles.visitStaff}>
                {visit.staffName ? `with ${visit.staffName}` : ''}
              </Text>
            </View>
            <Text style={styles.visitStar}>☆</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  greeting: { ...theme.typography.body, color: theme.colors.textSecondary },
  userName: { ...theme.typography.h1, color: theme.colors.primary },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: { fontSize: 18 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardLabel: { ...theme.typography.caption, color: theme.colors.textSecondary },
  queueNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.primary,
    marginVertical: 2,
  },
  cardSubText: { ...theme.typography.body, color: theme.colors.textPrimary, fontWeight: '600' },
  cardSubTextLight: { ...theme.typography.caption, color: theme.colors.textSecondary },
  waitTime: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  cardEmptyText: { ...theme.typography.body, color: theme.colors.textSecondary },
  joinButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  joinButtonText: { color: theme.colors.white, fontWeight: '700', fontSize: 15 },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  actionItem: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionIcon: { fontSize: 22, marginBottom: theme.spacing.xs },
  actionLabel: { ...theme.typography.caption, color: theme.colors.textPrimary, fontWeight: '600' },
  visitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  visitService: { ...theme.typography.body, color: theme.colors.textPrimary, fontWeight: '600' },
  visitStaff: { ...theme.typography.caption, color: theme.colors.textSecondary },
  visitStar: { fontSize: 18, color: theme.colors.secondary },
});