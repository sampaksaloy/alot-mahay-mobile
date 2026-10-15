import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme/theme';
import { COLORS } from '../../../../core/constants/colors';
import { mockDataStore } from '../../../../core/data/mockDataStore';
import { logoutUseCase } from '../../../auth/domain/usecases/logoutUseCase';
import StatCard from '../../../../components/StatCard';
import QueueStatusBadge from '../../../../components/QueueStatusBadge';
import LoadingIndicator from '../../../../components/LoadingIndicator';

export default function AdminDashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    try {
      const data = mockDataStore.getDashboardStats();
      setStats(data);
      const notifs = mockDataStore.getNotificationsByUserId('20');
      const unread = notifs.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadData);
    return unsub;
  }, [navigation, loadData]);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Sign out of admin control center?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logoutUseCase();
          navigation.reset({ index: 0, routes: [{ name: 'AuthStack' }] });
        },
      },
    ]);
  };

  if (loading && !stats) return <LoadingIndicator />;

  const todayQueueTotal = mockDataStore.getTodayQueue().length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor={theme.colors.royalBlue}
          />
        }
      >
        {/* Executive Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>MANAGEMENT CONSOLE</Text>
            <Text style={styles.title}>Alot Mahay Barbershop</Text>
          </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => navigation.navigate('Notifications')}
            accessibilityRole="button"
            accessibilityLabel="Admin Notifications"
          >
            <Ionicons name="notifications-outline" size={22} color={theme.colors.navy} />
            {unreadCount > 0 && (
              <View style={styles.badgeDot}>
                <Text style={styles.badgeCount}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutBtn}
            accessibilityRole="button"
            accessibilityLabel="Sign out of admin"
          >
            <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Primary KPI Grid (6 stats cards) */}
      {stats ? (
        <>
          <View style={styles.statsRow}>
            <StatCard
              icon="people-outline"
              label="Customers"
              value={stats.totalCustomers}
              color={theme.colors.navy}
              style={styles.stat}
            />
            <StatCard
              icon="cut-outline"
              label="Staff On Duty"
              value={stats.activeStaff}
              color={theme.colors.royalBlue}
              style={styles.stat}
            />
            <StatCard
              icon="flash-outline"
              label="Active Queues"
              value={stats.activeQueues}
              color={theme.colors.royalBlue}
              style={styles.stat}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              icon="time-outline"
              label="Waiting"
              value={stats.customersWaiting}
              color={theme.colors.navy}
              style={styles.stat}
            />
            <StatCard
              icon="checkmark-circle-outline"
              label="Completed"
              value={stats.completedToday}
              color={theme.colors.royalBlue}
              style={styles.stat}
            />
            <StatCard
              icon="timer-outline"
              label="Avg Duration"
              value={`${stats.avgDuration}m`}
              color={theme.colors.navy}
              style={styles.stat}
            />
          </View>

          {/* Quick Management Shortcuts Bar */}
          <View style={styles.quickBar}>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => navigation.navigate('Queue')}
            >
              <Ionicons name="time" size={18} color={theme.colors.royalBlue} />
              <Text style={styles.quickBtnText}>Live Monitor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => navigation.navigate('Services')}
            >
              <Ionicons name="cut" size={18} color={theme.colors.navy} />
              <Text style={styles.quickBtnText}>Services</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => navigation.navigate('Staff')}
            >
              <Ionicons name="people" size={18} color={theme.colors.navy} />
              <Text style={styles.quickBtnText}>Roster</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => navigation.navigate('Reports')}
            >
              <Ionicons name="bar-chart" size={18} color={theme.colors.royalBlue} />
              <Text style={styles.quickBtnText}>Analytics</Text>
            </TouchableOpacity>
          </View>

          {/* Status Breakdown Distribution */}
          {Object.keys(stats.statusDistribution).length > 0 ? (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="pie-chart-outline" size={18} color={theme.colors.navy} style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Today's Queue Breakdown</Text>
              </View>

              {Object.entries(stats.statusDistribution).map(([status, count]) => {
                const percent = todayQueueTotal > 0 ? Math.round((count / todayQueueTotal) * 100) : 0;
                return (
                  <View key={status} style={styles.distRow}>
                    <View style={styles.distBadgeWrapper}>
                      <QueueStatusBadge status={status} size="small" />
                    </View>
                    <View style={styles.distTrack}>
                      <View
                        style={[
                          styles.distFill,
                          {
                            width: `${Math.max(4, percent)}%`,
                            backgroundColor: COLORS.status[status] || theme.colors.navy,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.distCountText}>
                      {count} ({percent}%)
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : null}

          {/* Popular Services Breakdown */}
          {stats.popularServices.length > 0 ? (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="flame-outline" size={18} color={theme.colors.royalBlue} style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Top Requested Services</Text>
              </View>

              {stats.popularServices.map((svc, i) => (
                <View
                  key={svc.name}
                  style={[
                    styles.popularItem,
                    i < stats.popularServices.length - 1 && styles.borderBottom,
                  ]}
                >
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>#{i + 1}</Text>
                  </View>
                  <View style={styles.popularNameCol}>
                    <Text style={styles.popularName}>{svc.name}</Text>
                  </View>
                  <View style={styles.ordersBadge}>
                    <Text style={styles.ordersCount}>{svc.count} ticket{svc.count === 1 ? '' : 's'}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {/* Recent Operational Activity */}
          {stats.recentActivity && stats.recentActivity.length > 0 ? (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="receipt-outline" size={18} color={theme.colors.navy} style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Recent Ticket Activity</Text>
              </View>

              {stats.recentActivity.map((ticket, idx) => (
                <View
                  key={ticket.id}
                  style={[
                    styles.activityItem,
                    idx < stats.recentActivity.length - 1 && styles.borderBottom,
                  ]}
                >
                  <View style={styles.activityNumberBox}>
                    <Text style={styles.activityNumber}>{ticket.queue_number}</Text>
                  </View>
                  <View style={styles.activityCenterCol}>
                    <Text style={styles.activityCustomer}>{ticket.customer_name}</Text>
                    <Text style={styles.activityService}>
                      {ticket.service_name} · {ticket.staff_name}
                    </Text>
                  </View>
                  <QueueStatusBadge status={ticket.status} size="small" />
                </View>
              ))}
            </View>
          ) : null}
        </>
      ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl * 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  headerLeft: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  greeting: {
    ...theme.typography.captionBold,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.navy,
    marginTop: 2,
    fontSize: 24,
  },
  subTitle: {
    ...theme.typography.caption,
    color: theme.colors.royalBlue,
    fontWeight: '600',
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...theme.shadows.sm,
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.colors.royalBlue,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  stat: {
    flex: 1,
  },
  quickBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
    marginVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'space-between',
    ...theme.shadows.sm,
  },
  quickBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  quickBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.navy,
    marginTop: 4,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.navy,
    fontSize: 16,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  distBadgeWrapper: {
    width: 105,
  },
  distTrack: {
    flex: 1,
    height: 10,
    backgroundColor: '#EEF2F6',
    borderRadius: 5,
    marginHorizontal: theme.spacing.sm,
    overflow: 'hidden',
  },
  distFill: {
    height: '100%',
    borderRadius: 5,
  },
  distCountText: {
    ...theme.typography.captionBold,
    color: theme.colors.textPrimary,
    minWidth: 55,
    textAlign: 'right',
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EBF2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#D4E2F9',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.navy,
  },
  popularNameCol: {
    flex: 1,
  },
  popularName: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
  },
  ordersBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ordersCount: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  activityNumberBox: {
    backgroundColor: theme.colors.navy + '12',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
    marginRight: theme.spacing.sm,
  },
  activityNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.navy,
  },
  activityCenterCol: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  activityCustomer: {
    ...theme.typography.bodyBold,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  activityService: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
});
