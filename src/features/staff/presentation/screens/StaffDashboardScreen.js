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
import { useTodayQueue } from '../hooks/useTodayQueue';
import { getStoredUser } from '../../../../core/storage/localStorage';
import { logoutUseCase } from '../../../auth/domain/usecases/logoutUseCase';
import { theme } from '../../../../core/theme/theme';
import { QUEUE_STATUS } from '../../../../core/constants/strings';
import { mockDataStore } from '../../../../core/data/mockDataStore';
import StatCard from '../../../../components/StatCard';
import QueueStatusBadge from '../../../../components/QueueStatusBadge';
import Button from '../../../../components/Button';

export default function StaffDashboardScreen({ navigation }) {
  const { queueList, loading, refresh, callNext, startService, completeService } = useTodayQueue();
  const [user, setUser] = useState(null);
  const [staffRecord, setStaffRecord] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  const loadUserData = useCallback(async () => {
    const u = await getStoredUser();
    setUser(u);
    if (u) {
      const s = mockDataStore.getStaffByUserId(u.id);
      setStaffRecord(s);
      const notifs = mockDataStore.getNotificationsByUserId(u.id);
      const unread = notifs.filter((n) => !n.read).length;
      setUnreadCount(unread);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      refresh();
      loadUserData();
    });
    return unsub;
  }, [navigation, refresh, loadUserData]);

  // Filter for this staff member or all today
  const myQueue = staffRecord
    ? queueList.filter((t) => t.staff_id === staffRecord.id || !t.staff_id)
    : queueList;

  const waiting = myQueue.filter((t) => t.status === QUEUE_STATUS.WAITING);
  const inService = myQueue.find((t) => t.status === QUEUE_STATUS.IN_SERVICE);
  const called = myQueue.find((t) => t.status === QUEUE_STATUS.CALLED);
  const completed = myQueue.filter((t) => t.status === QUEUE_STATUS.COMPLETED);
  const nextUp = waiting[0];

  const handleCallNext = async () => {
    if (!nextUp) return;
    setActionLoading(true);
    try {
      await callNext(nextUp.id);
    } catch (e) {
      Alert.alert('Notice', e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartService = async () => {
    if (!called) return;
    setActionLoading(true);
    try {
      await startService(called.id);
    } catch (e) {
      Alert.alert('Notice', e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteService = async () => {
    if (!inService) return;
    setActionLoading(true);
    try {
      await completeService(inService.id);
    } catch (e) {
      Alert.alert('Notice', e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Sign out of the staff station?', [
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => {
            refresh();
            loadUserData();
          }}
          tintColor={theme.colors.royalBlue}
        />
      }
    >
      {/* Staff Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>STAFF WORKSPACE</Text>
          <Text style={styles.staffName} numberOfLines={1}>
            {user?.name || 'Staff Member'}
          </Text>
          {staffRecord ? (
            <View style={styles.roleTag}>
              <Ionicons name="cut" size={12} color={theme.colors.royalBlue} />
              <Text style={styles.roleTagText}>
                {staffRecord.staffType} · {staffRecord.specialization}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => navigation.navigate('Alerts')}
            accessibilityRole="button"
            accessibilityLabel="Staff Notifications"
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
            accessibilityLabel="Sign out of staff station"
          >
            <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* KPI Stats Row - Blue & White Only */}
      <View style={styles.statsRow}>
        <StatCard
          icon="time-outline"
          label="Waiting"
          value={waiting.length}
          color={theme.colors.navy}
          style={styles.statCard}
        />
        <StatCard
          icon="cut-outline"
          label="Serving"
          value={inService ? 1 : called ? 1 : 0}
          color={theme.colors.royalBlue}
          style={styles.statCard}
        />
        <StatCard
          icon="checkmark-circle-outline"
          label="Completed"
          value={completed.length}
          color={theme.colors.navy}
          style={styles.statCard}
        />
      </View>

      {/* Operational Active Service Card */}
      {inService ? (
        <View style={styles.activeServiceCard}>
          <View style={styles.activeCardTop}>
            <View style={styles.activePill}>
              <View style={styles.pulseDot} />
              <Text style={styles.activePillText}>NOW IN CHAIR</Text>
            </View>
            <QueueStatusBadge status={inService.status} size="small" />
          </View>

          <Text style={styles.ticketBigNumber}>{inService.queue_number}</Text>
          <Text style={styles.customerName}>{inService.customer_name}</Text>
          <Text style={styles.serviceMeta}>
            {inService.service_name} · {inService.service_duration} mins est.
          </Text>

          <Button
            label={actionLoading ? 'Updating...' : 'Finish Service'}
            icon="checkmark-done-circle-outline"
            onPress={handleCompleteService}
            loading={actionLoading}
            variant="primary"
            style={styles.cardActionButton}
          />
        </View>
      ) : called ? (
        <View style={[styles.activeServiceCard, styles.calledCard]}>
          <View style={styles.activeCardTop}>
            <View style={[styles.activePill, { backgroundColor: '#EBF2FD' }]}>
              <Ionicons name="megaphone" size={12} color={theme.colors.royalBlue} style={{ marginRight: 4 }} />
              <Text style={[styles.activePillText, { color: theme.colors.royalBlue }]}>CUSTOMER CALLED</Text>
            </View>
            <QueueStatusBadge status={called.status} size="small" />
          </View>

          <Text style={[styles.ticketBigNumber, { color: theme.colors.royalBlue }]}>{called.queue_number}</Text>
          <Text style={styles.customerName}>{called.customer_name}</Text>
          <Text style={styles.serviceMeta}>{called.service_name}</Text>

          <Button
            label={actionLoading ? 'Updating...' : 'Customer Arrived — Start Service'}
            icon="play-outline"
            onPress={handleStartService}
            loading={actionLoading}
            variant="royalBlue"
            style={styles.cardActionButton}
          />
        </View>
      ) : (
        <View style={styles.idleCard}>
          <View style={styles.idleIconCircle}>
            <Ionicons name="checkmark-done-outline" size={32} color={theme.colors.royalBlue} />
          </View>
          <Text style={styles.idleTitle}>No Active Service in Progress</Text>
          <Text style={styles.idleSubtitle}>
            {waiting.length > 0
              ? `${waiting.length} customer${waiting.length > 1 ? 's' : ''} currently waiting in queue.`
              : 'All customers served! Queue is currently clear.'}
          </Text>

          {waiting.length > 0 && nextUp ? (
            <Button
              label={`Call Next Customer (${nextUp.queue_number})`}
              icon="megaphone-outline"
              onPress={handleCallNext}
              loading={actionLoading}
              variant="royalBlue"
              style={styles.callNextBtn}
            />
          ) : null}
        </View>
      )}

      {/* Next In Line Preview */}
      {nextUp && (inService || called) ? (
        <View style={styles.nextUpCard}>
          <View style={styles.nextUpHeader}>
            <Ionicons name="hourglass-outline" size={16} color={theme.colors.royalBlue} style={{ marginRight: 6 }} />
            <Text style={styles.nextUpLabel}>Next Up in Line</Text>
          </View>
          <View style={styles.nextUpRow}>
            <View>
              <Text style={styles.nextUpName}>{nextUp.customer_name}</Text>
              <Text style={styles.nextUpService}>
                {nextUp.service_name} · {nextUp.service_duration} min
              </Text>
            </View>
            <View style={styles.nextUpNumberBadge}>
              <Text style={styles.nextUpNumberText}>{nextUp.queue_number}</Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* Quick Action Navigation Buttons */}
      <View style={styles.shortcutsSection}>
        <Text style={styles.sectionHeading}>Queue Shortcuts</Text>

        <TouchableOpacity
          style={styles.shortcutRow}
          onPress={() => navigation.navigate('TodayQueue')}
          activeOpacity={0.7}
        >
          <View style={[styles.shortcutIconCircle, { backgroundColor: '#EBF2FD' }]}>
            <Ionicons name="list" size={20} color={theme.colors.royalBlue} />
          </View>
          <View style={styles.shortcutInfo}>
            <Text style={styles.shortcutTitle}>Today's Queue List</Text>
            <Text style={styles.shortcutSubtitle}>
              {myQueue.length} total customer ticket{myQueue.length === 1 ? '' : 's'} today
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shortcutRow}
          onPress={() => navigation.navigate('History')}
          activeOpacity={0.7}
        >
          <View style={[styles.shortcutIconCircle, { backgroundColor: '#EBF2FD' }]}>
            <Ionicons name="time" size={20} color={theme.colors.navy} />
          </View>
          <View style={styles.shortcutInfo}>
            <Text style={styles.shortcutTitle}>Service History</Text>
            <Text style={styles.shortcutSubtitle}>
              View served tickets and completion records
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>
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
    marginRight: theme.spacing.sm,
  },
  greeting: {
    ...theme.typography.captionBold,
    color: theme.colors.textSecondary,
    letterSpacing: 0.8,
  },
  staffName: {
    ...theme.typography.h1,
    color: theme.colors.navy,
    marginTop: 2,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  roleTagText: {
    ...theme.typography.caption,
    color: theme.colors.royalBlue,
    fontWeight: '600',
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
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
  },
  activeServiceCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 2,
    borderColor: theme.colors.royalBlue,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  calledCard: {
    borderColor: theme.colors.royalBlue,
  },
  activeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.royalBlue,
    marginRight: 5,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.royalBlue,
    letterSpacing: 0.5,
  },
  ticketBigNumber: {
    fontSize: 44,
    fontWeight: '900',
    color: theme.colors.navy,
    textAlign: 'center',
    marginVertical: 4,
  },
  customerName: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    fontSize: 20,
  },
  serviceMeta: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  cardActionButton: {
    marginTop: theme.spacing.xs,
  },
  idleCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  idleIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.royalBlue + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  idleTitle: {
    ...theme.typography.h3,
    color: theme.colors.navy,
    textAlign: 'center',
  },
  idleSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: theme.spacing.lg,
    maxWidth: 260,
  },
  callNextBtn: {
    width: '100%',
  },
  nextUpCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.royalBlue,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  nextUpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  nextUpLabel: {
    ...theme.typography.captionBold,
    color: theme.colors.navy,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nextUpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextUpName: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
  },
  nextUpService: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  nextUpNumberBadge: {
    backgroundColor: theme.colors.navy,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
  },
  nextUpNumberText: {
    color: theme.colors.white,
    fontWeight: '800',
    fontSize: 14,
  },
  shortcutsSection: {
    marginTop: 4,
  },
  sectionHeading: {
    ...theme.typography.captionBold,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: theme.spacing.sm,
    marginLeft: 4,
  },
  shortcutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  shortcutIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  shortcutInfo: {
    flex: 1,
  },
  shortcutTitle: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
  },
  shortcutSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
