import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getMyProfileUseCase } from '../../domain/usecases/getMyProfileUseCase';
import { getMyQueueUseCase } from '../../../queue/domain/usecases/getMyQueueUseCase';
import { getServicesUseCase } from '../../../services/domain/usecases/getServicesUseCase';
import { theme } from '../../../../core/theme/theme';
import { QUEUE_STATUS } from '../../../../core/constants/strings';
import { mockDataStore } from '../../../../core/data/mockDataStore';
import QueueStatusBadge from '../../../../components/QueueStatusBadge';
import ServiceCard from '../../../../components/ServiceCard';
import SectionHeader from '../../../../components/SectionHeader';
import LoadingIndicator from '../../../../components/LoadingIndicator';

export default function CustomerDashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);
  const [services, setServices] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [u, tickets, svcList] = await Promise.all([
        getMyProfileUseCase(),
        getMyQueueUseCase(),
        getServicesUseCase(),
      ]);
      setUser(u);
      setServices((svcList || []).slice(0, 4));

      // Find active ticket (WAITING, CALLED, IN_SERVICE)
      const active = (tickets || []).find(
        (t) =>
          ![QUEUE_STATUS.COMPLETED, QUEUE_STATUS.CANCELLED, QUEUE_STATUS.SKIPPED].includes(
            t.status
          )
      );
      setActiveTicket(active || null);

      if (u && u.id) {
        const notifs = mockDataStore.getNotificationsByUserId(u.id);
        const unread = notifs.filter((n) => !n.read).length;
        setUnreadNotifications(unread);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadData);
    return unsub;
  }, [navigation, loadData]);

  if (loading && !user) return <LoadingIndicator />;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const queueNum = activeTicket?.queueNumber || activeTicket?.queue_number || '—';
  const serviceName = activeTicket?.serviceName || activeTicket?.service_name || 'Service';
  const staffName = activeTicket?.staffName || activeTicket?.staff_name || 'Any Available';
  const waitTime = activeTicket?.estimatedWaitTime ?? activeTicket?.estimated_wait_time ?? 0;
  const position = activeTicket?.position ?? (activeTicket?.id ? mockDataStore.getQueuePosition(activeTicket.id) : 1);

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerGreetingCol}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {user?.name || 'Customer'}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => navigation.navigate('Notifications')}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={22} color={theme.colors.navy} />
            {unreadNotifications > 0 && (
              <View style={styles.badgeDot}>
                <Text style={styles.badgeCount}>{unreadNotifications}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => navigation.navigate('Profile')}
            accessibilityRole="button"
            accessibilityLabel="View Profile"
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.profileAvatarImage} />
            ) : (
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'C'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Queue Card */}
      {activeTicket ? (
        <TouchableOpacity
          style={styles.activeCard}
          onPress={() => navigation.navigate('MyQueue')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`Active ticket ${queueNum}, ${serviceName}`}
        >
          <View style={styles.activeCardHeader}>
            <View style={styles.activeTag}>
              <Ionicons name="flash" size={13} color={theme.colors.royalBlue} style={{ marginRight: 4 }} />
              <Text style={styles.activeTagText}>YOUR ACTIVE TICKET</Text>
            </View>
            <QueueStatusBadge status={activeTicket.status} size="small" />
          </View>

          <View style={styles.activeNumberRow}>
            <Text style={styles.activeNumber}>{queueNum}</Text>
          </View>

          <Text style={styles.activeService}>{serviceName}</Text>

          {/* Queue Stage Progress Indicator */}
          <View style={styles.queueProgressContainer}>
            <View style={styles.progressHeaderRow}>
              <Text style={styles.progressStepTitle}>
                {activeTicket.status === QUEUE_STATUS.WAITING && 'Stage 1 of 4: Waiting in Line'}
                {activeTicket.status === QUEUE_STATUS.CALLED && 'Stage 2 of 4: Called to Chair'}
                {activeTicket.status === QUEUE_STATUS.IN_SERVICE && 'Stage 3 of 4: In Service / Haircut in Progress'}
                {activeTicket.status === QUEUE_STATUS.COMPLETED && 'Stage 4 of 4: Completed'}
              </Text>
              <Text style={styles.progressPercentText}>
                {activeTicket.status === QUEUE_STATUS.WAITING && '25%'}
                {activeTicket.status === QUEUE_STATUS.CALLED && '50%'}
                {activeTicket.status === QUEUE_STATUS.IN_SERVICE && '75%'}
                {activeTicket.status === QUEUE_STATUS.COMPLETED && '100%'}
              </Text>
            </View>

            <View style={styles.progressBarWrapper}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width:
                      activeTicket.status === QUEUE_STATUS.WAITING
                        ? '25%'
                        : activeTicket.status === QUEUE_STATUS.CALLED
                        ? '50%'
                        : activeTicket.status === QUEUE_STATUS.IN_SERVICE
                        ? '75%'
                        : '100%',
                  },
                ]}
              />
            </View>

            {/* Stage Steps Icons */}
            <View style={styles.stepsRow}>
              {[
                { label: 'Waiting', icon: 'time-outline', active: true },
                {
                  label: 'Called',
                  icon: 'megaphone-outline',
                  active: [QUEUE_STATUS.CALLED, QUEUE_STATUS.IN_SERVICE, QUEUE_STATUS.COMPLETED].includes(activeTicket.status),
                },
                {
                  label: 'In Service',
                  icon: 'cut-outline',
                  active: [QUEUE_STATUS.IN_SERVICE, QUEUE_STATUS.COMPLETED].includes(activeTicket.status),
                },
                {
                  label: 'Done',
                  icon: 'checkmark-circle-outline',
                  active: activeTicket.status === QUEUE_STATUS.COMPLETED,
                },
              ].map((step, idx) => (
                <View key={idx} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepIconCircle,
                      step.active ? styles.stepIconActive : styles.stepIconInactive,
                    ]}
                  >
                    <Ionicons
                      name={step.icon}
                      size={13}
                      color={step.active ? '#FFFFFF' : '#94A3B8'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      step.active && styles.stepLabelActive,
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.activeStatsGrid}>
            <View style={styles.activeStatItem}>
              <Text style={styles.activeStatLabel}>Position</Text>
              <Text style={styles.activeStatValue}>#{position}</Text>
            </View>

            <View style={styles.activeStatDivider} />

            <View style={styles.activeStatItem}>
              <Text style={styles.activeStatLabel}>Est. Wait</Text>
              <Text style={styles.activeStatValue}>~{waitTime} min</Text>
            </View>

            <View style={styles.activeStatDivider} />

            <View style={styles.activeStatItem}>
              <Text style={styles.activeStatLabel}>Staff</Text>
              <Text style={styles.activeStatValue} numberOfLines={1}>{staffName}</Text>
            </View>
          </View>

          <View style={styles.activeCardFooter}>
            <Text style={styles.activeFooterActionText}>View Live Queue Tracker</Text>
            <Ionicons name="arrow-forward" size={16} color={theme.colors.royalBlue} />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyQueueCard}>
          <View style={styles.emptyQueueTop}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="cut" size={26} color={theme.colors.royalBlue} />
            </View>
            <View style={styles.emptyQueueTextCol}>
              <Text style={styles.emptyQueueTitle}>Ready for a fresh look?</Text>
              <Text style={styles.emptyQueueSubtitle}>
                Skip the in-salon waiting time by booking your queue spot remotely.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.joinQueueButton}
            onPress={() => navigation.navigate('Services')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Browse Services and Join Queue"
          >
            <Ionicons name="add-circle-outline" size={18} color={theme.colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.joinQueueButtonText}>Browse Services & Join Queue</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Action Tiles - Blue & White Only */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={styles.quickActionTile}
          onPress={() => navigation.navigate('Services')}
          activeOpacity={0.7}
        >
          <View style={styles.tileIconContainer}>
            <Ionicons name="cut" size={22} color={theme.colors.royalBlue} />
          </View>
          <Text style={styles.tileTitle}>Services</Text>
          <Text style={styles.tileSub}>Salon Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionTile}
          onPress={() => navigation.navigate('MyQueue')}
          activeOpacity={0.7}
        >
          <View style={styles.tileIconContainer}>
            <Ionicons name="ticket-outline" size={22} color={theme.colors.navy} />
          </View>
          <Text style={styles.tileTitle}>My Queue</Text>
          <Text style={styles.tileSub}>Live Ticket</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionTile}
          onPress={() => navigation.getParent()?.navigate('QueueHistory')}
          activeOpacity={0.7}
        >
          <View style={styles.tileIconContainer}>
            <Ionicons name="clipboard-outline" size={22} color={theme.colors.royalBlue} />
          </View>
          <Text style={styles.tileTitle}>History</Text>
          <Text style={styles.tileSub}>Past Visits</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionTile}
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <View style={styles.tileIconContainer}>
            <Ionicons name="notifications-outline" size={22} color={theme.colors.navy} />
          </View>
          <Text style={styles.tileTitle}>Alerts</Text>
          <Text style={styles.tileSub}>Updates</Text>
        </TouchableOpacity>
      </View>

      {/* Salon Status Notice - Blue and White */}
      <View style={styles.infoBanner}>
        <Ionicons name="time-outline" size={18} color={theme.colors.royalBlue} style={{ marginRight: 8 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.infoBannerTitle}>Real-Time Waiting Algorithm</Text>
          <Text style={styles.infoBannerText}>
            Predictions dynamically calibrate based on serving staff pace and service complexity.
          </Text>
        </View>
      </View>

      {/* Popular Services */}
      {services.length > 0 ? (
        <View style={styles.servicesSection}>
          <SectionHeader
            title="Popular Services"
            rightText="View All Services"
            onRightPress={() => navigation.navigate('Services')}
          />
          {services.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              compact
              onPress={() =>
                navigation.getParent()?.navigate('JoinQueue', { serviceId: svc.id })
              }
            />
          ))}
        </View>
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
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
  },
  headerGreetingCol: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  greeting: {
    ...theme.typography.captionBold,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  userName: {
    ...theme.typography.h1,
    color: theme.colors.navy,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...theme.shadows.sm,
  },
  badgeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: theme.colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeCount: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  avatarButton: {},
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.royalBlue,
    ...theme.shadows.sm,
  },
  profileAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.royalBlue,
  },
  profileAvatarText: {
    color: theme.colors.white,
    fontWeight: '800',
    fontSize: 18,
  },
  activeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 2,
    borderColor: theme.colors.royalBlue,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  activeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.royalBlue,
    letterSpacing: 0.6,
  },
  activeNumberRow: {
    alignItems: 'center',
    marginVertical: 4,
  },
  activeNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: theme.colors.navy,
    letterSpacing: 1,
  },
  activeService: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: theme.spacing.md,
  },
  queueProgressContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressStepTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.navy,
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.royalBlue,
  },
  progressBarWrapper: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.royalBlue,
    borderRadius: 3,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  stepIconActive: {
    backgroundColor: theme.colors.royalBlue,
  },
  stepIconInactive: {
    backgroundColor: '#E2E8F0',
  },
  stepLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: theme.colors.navy,
    fontWeight: '700',
  },
  activeStatsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  activeStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  activeStatLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    fontSize: 11,
    marginBottom: 2,
  },
  activeStatValue: {
    ...theme.typography.bodyBold,
    color: theme.colors.navy,
    fontSize: 15,
  },
  activeCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    gap: 6,
  },
  activeFooterActionText: {
    ...theme.typography.captionBold,
    color: theme.colors.royalBlue,
    fontSize: 13,
  },
  emptyQueueCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  emptyQueueTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EBF2FD',
    borderWidth: 1,
    borderColor: '#D4E2F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  emptyQueueTextCol: {
    flex: 1,
  },
  emptyQueueTitle: {
    ...theme.typography.h3,
    color: theme.colors.navy,
  },
  emptyQueueSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  joinQueueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.navy,
    borderRadius: theme.radius.md,
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  joinQueueButtonText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  quickActionTile: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  tileIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EBF2FD',
    borderWidth: 1,
    borderColor: '#D4E2F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  tileTitle: {
    ...theme.typography.captionBold,
    color: theme.colors.navy,
    fontSize: 12,
  },
  tileSub: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F5FF',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#D4E2F9',
    marginBottom: theme.spacing.md,
  },
  infoBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.navy,
    marginBottom: 2,
  },
  infoBannerText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  servicesSection: {
    marginTop: 4,
  },
});