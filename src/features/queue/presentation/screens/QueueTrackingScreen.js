import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMyQueueUseCase } from '../../domain/usecases/getMyQueueUseCase';
import { updateQueueStatusUseCase } from '../../domain/usecases/updateQueueStatusUseCase';
import { theme } from '../../../../core/theme/theme';
import { COLORS } from '../../../../core/constants/colors';
import { QUEUE_STATUS } from '../../../../core/constants/strings';
import QueueStatusBadge from '../../../../components/QueueStatusBadge';
import Button from '../../../../components/Button';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import EmptyState from '../../../../components/EmptyState';
import LoadingIndicator from '../../../../components/LoadingIndicator';

export default function QueueTrackingScreen({ navigation }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getMyQueueUseCase();
      setTickets(list || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadData);
    return unsub;
  }, [navigation, loadData]);

  const activeTicket = tickets.find(
    (t) => ![QUEUE_STATUS.COMPLETED, QUEUE_STATUS.CANCELLED, QUEUE_STATUS.SKIPPED].includes(t.status)
  );

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await updateQueueStatusUseCase(cancelTarget.id, QUEUE_STATUS.CANCELLED);
      setCancelTarget(null);
      loadData();
    } catch (e) {
      // error handled silently, retry next load
    } finally {
      setCancelling(false);
    }
  };

  if (loading && tickets.length === 0) return <LoadingIndicator />;

  if (!activeTicket) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.emptyContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
      >
        <EmptyState
          icon="ticket-outline"
          title="No Active Queue"
          message="You don't have an active queue ticket. Browse services to join a queue."
        />
        <Button
          label="Browse Services"
          onPress={() => navigation.navigate('Services')}
          style={styles.browseBtn}
        />
      </ScrollView>
    );
  }

  const statusSteps = [
    { key: QUEUE_STATUS.WAITING, label: 'Waiting', desc: 'In Line', icon: 'time-outline' },
    { key: QUEUE_STATUS.CALLED, label: 'Called', desc: 'Proceed', icon: 'megaphone-outline' },
    { key: QUEUE_STATUS.IN_SERVICE, label: 'In Service', desc: 'At Chair', icon: 'cut-outline' },
    { key: QUEUE_STATUS.COMPLETED, label: 'Done', desc: 'Finished', icon: 'checkmark-circle-outline' },
  ];
  const currentStepIdx = statusSteps.findIndex((s) => s.key === activeTicket.status);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
    >
      {/* Queue number card */}
      <View style={styles.mainCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>LIVE TICKET TRACKER</Text>
          <QueueStatusBadge status={activeTicket.status} />
        </View>
        <Text style={styles.queueNumber}>
          {activeTicket.queueNumber || activeTicket.queue_number}
        </Text>

        {/* Current Stage Highlight Banner */}
        <View style={styles.stageHighlightBox}>
          <Ionicons
            name={
              activeTicket.status === QUEUE_STATUS.WAITING
                ? 'time'
                : activeTicket.status === QUEUE_STATUS.CALLED
                ? 'megaphone'
                : activeTicket.status === QUEUE_STATUS.IN_SERVICE
                ? 'cut'
                : 'checkmark-circle'
            }
            size={18}
            color={theme.colors.royalBlue}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.stageHighlightText}>
            {activeTicket.status === QUEUE_STATUS.WAITING && 'Step 1 of 4: Waiting for your turn in line'}
            {activeTicket.status === QUEUE_STATUS.CALLED && 'Step 2 of 4: Your number has been called!'}
            {activeTicket.status === QUEUE_STATUS.IN_SERVICE && 'Step 3 of 4: Currently receiving your service'}
            {activeTicket.status === QUEUE_STATUS.COMPLETED && 'Step 4 of 4: Service completed!'}
          </Text>
        </View>

        {/* Visual Multi-step progress pipeline */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrackBackground} />
          <View
            style={[
              styles.progressTrackActive,
              {
                width: `${Math.max(0, Math.min(100, (currentStepIdx / (statusSteps.length - 1)) * 100))}%`,
              },
            ]}
          />
          <View style={styles.progressRow}>
            {statusSteps.map((step, i) => {
              const isPast = i < currentStepIdx;
              const isCurrent = i === currentStepIdx;
              const isActive = i <= currentStepIdx;
              return (
                <View key={step.key} style={styles.progressItem}>
                  <View
                    style={[
                      styles.progressDot,
                      isActive && styles.progressDotActive,
                      isCurrent && styles.progressDotCurrent,
                    ]}
                  >
                    {isPast ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : (
                      <Ionicons
                        name={step.icon}
                        size={14}
                        color={isActive ? '#FFFFFF' : '#94A3B8'}
                      />
                    )}
                  </View>
                  <Text style={[styles.progressLabel, isActive && styles.progressLabelActive]}>
                    {step.label}
                  </Text>
                  <Text style={styles.progressSubLabel}>{step.desc}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Details */}
      <View style={styles.detailCard}>
        <DetailRow label="Service" value={activeTicket.serviceName || activeTicket.service_name} />
        <DetailRow label="Barber / Stylist" value={activeTicket.staffName || activeTicket.staff_name} />
        <DetailRow label="Queue Position" value={`#${activeTicket.position || '—'}`} />
        <DetailRow
          label="Est. Wait Time"
          value={`~${activeTicket.estimatedWaitTime ?? activeTicket.estimated_wait_time ?? 0} min`}
          highlight
        />
        <DetailRow label="Joined At" value={formatTime(activeTicket.joinedAt || activeTicket.joined_at)} />
      </View>

      {/* Instruction */}
      <View style={styles.instructionCard}>
        <Ionicons
          name={
            activeTicket.status === QUEUE_STATUS.WAITING
              ? 'time-outline'
              : activeTicket.status === QUEUE_STATUS.CALLED
              ? 'megaphone-outline'
              : activeTicket.status === QUEUE_STATUS.IN_SERVICE
              ? 'cut-outline'
              : 'checkmark-circle-outline'
          }
          size={24}
          color={theme.colors.royalBlue}
          style={{ marginRight: theme.spacing.md }}
        />
        <Text style={styles.instructionText}>
          {activeTicket.status === QUEUE_STATUS.WAITING
            ? "Please wait for your number to be called. We'll send an alert directly to your phone."
            : activeTicket.status === QUEUE_STATUS.CALLED
            ? "Your number has been called! Please head to your stylist's chair immediately."
            : activeTicket.status === QUEUE_STATUS.IN_SERVICE
            ? 'Your service is currently underway. Sit back and enjoy the experience!'
            : 'Your service is complete. Thank you for visiting Alot Mahay!'}
        </Text>
      </View>

      {/* Cancel button */}
      {[QUEUE_STATUS.WAITING, QUEUE_STATUS.CALLED].includes(activeTicket.status) ? (
        <Button
          label="Cancel Queue Ticket"
          variant="danger"
          onPress={() => setCancelTarget(activeTicket)}
          style={styles.cancelBtn}
        />
      ) : null}

      <ConfirmationModal
        visible={!!cancelTarget}
        title="Cancel Queue Ticket"
        message="Are you sure you want to cancel your queue ticket? This action cannot be undone."
        confirmLabel="Yes, Cancel"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
        loading={cancelling}
      />
    </ScrollView>
  );
}

function DetailRow({ label, value, highlight }) {
  return (
    <View style={detailStyles.row}>
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={[detailStyles.value, highlight && detailStyles.valueHighlight]}>{value}</Text>
    </View>
  );
}

function formatTime(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  label: { ...theme.typography.body, color: theme.colors.textSecondary },
  value: { ...theme.typography.body, color: theme.colors.navy, fontWeight: '700' },
  valueHighlight: { color: theme.colors.royalBlue },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xl * 2 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', padding: theme.spacing.lg },
  browseBtn: { alignSelf: 'center', minWidth: 200 },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.royalBlue,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.royalBlue,
    letterSpacing: 0.8,
  },
  queueNumber: {
    fontSize: 52,
    fontWeight: '900',
    color: theme.colors.navy,
    marginBottom: theme.spacing.sm,
    letterSpacing: 1,
  },
  stageHighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#D4E2F9',
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  stageHighlightText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.navy,
    flex: 1,
  },
  progressContainer: {
    width: '100%',
    position: 'relative',
    paddingVertical: 8,
  },
  progressTrackBackground: {
    position: 'absolute',
    top: 22,
    left: '12%',
    right: '12%',
    height: 4,
    backgroundColor: '#E2E8F0',
    zIndex: 1,
  },
  progressTrackActive: {
    position: 'absolute',
    top: 22,
    left: '12%',
    height: 4,
    backgroundColor: theme.colors.royalBlue,
    zIndex: 2,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 3,
  },
  progressItem: { alignItems: 'center', width: '22%' },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  progressDotActive: {
    backgroundColor: theme.colors.royalBlue,
    borderColor: theme.colors.royalBlue,
  },
  progressDotCurrent: {
    borderWidth: 3,
    borderColor: theme.colors.navy,
    elevation: 3,
  },
  progressLabel: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '600',
  },
  progressLabelActive: {
    color: theme.colors.navy,
    fontWeight: '800',
  },
  progressSubLabel: {
    fontSize: 9,
    color: theme.colors.textMuted,
    marginTop: 1,
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F5FF',
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.royalBlue,
    borderWidth: 1,
    borderColor: '#D4E2F9',
  },
  instructionText: {
    ...theme.typography.body,
    color: theme.colors.navy,
    flex: 1,
    lineHeight: 22,
    fontWeight: '500',
  },
  cancelBtn: { marginBottom: theme.spacing.lg },
});
