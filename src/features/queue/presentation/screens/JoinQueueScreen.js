import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useQueue } from '../hooks/useQueue';
import { getServicesUseCase } from '../../../services/domain/usecases/getServicesUseCase';
import { manageStaffUseCase } from '../../../staff/domain/usecases/manageStaffUseCase';
import { theme } from '../../../../core/theme/theme';
import ServiceCard from '../../../../components/ServiceCard';
import StaffCard from '../../../../components/StaffCard';
import Button from '../../../../components/Button';
import LoadingIndicator from '../../../../components/LoadingIndicator';
import SectionHeader from '../../../../components/SectionHeader';

export default function JoinQueueScreen({ navigation, route }) {
  const preSelectedServiceId = route.params?.serviceId;
  const { joinQueue, loading, error } = useQueue();

  const [step, setStep] = useState(preSelectedServiceId ? 2 : 1); // 1=service, 2=staff, 3=confirm
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [svcList, stfList] = await Promise.all([
          getServicesUseCase(),
          manageStaffUseCase.list(),
        ]);
        setServices(svcList);
        setStaffList(stfList);

        if (preSelectedServiceId) {
          const svc = svcList.find((s) => s.id === preSelectedServiceId);
          if (svc) setSelectedService(svc);
        }
      } finally {
        setDataLoading(false);
      }
    })();
  }, [preSelectedServiceId]);

  const handleSelectService = (svc) => {
    setSelectedService(svc);
    setStep(2);
  };

  const handleSelectStaff = (stf) => {
    setSelectedStaff(stf);
    setStep(3);
  };

  const handleConfirm = async () => {
    if (!selectedService) {
      Alert.alert('Error', 'Please select a service');
      return;
    }
    if (!selectedStaff) {
      Alert.alert('Error', 'Please select a barber/stylist');
      return;
    }

    const ticket = await joinQueue(selectedService.id, selectedStaff.id);
    if (ticket) {
      Alert.alert(
        '🎉 Queue Joined!',
        `Your queue number is ${ticket.queueNumber || ticket.queue_number}.\nEstimated wait: ~${ticket.estimatedWaitTime || ticket.estimated_wait_time || 0} min.`,
        [{ text: 'View Queue', onPress: () => navigation.navigate('CustomerTabs', { screen: 'MyQueue' }) }]
      );
    } else {
      Alert.alert('Error', error || 'Could not join queue. You may already have an active ticket.');
    }
  };

  if (dataLoading) return <LoadingIndicator />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress indicator */}
      <View style={styles.progress}>
        {['Service', 'Barber', 'Confirm'].map((label, i) => (
          <View key={label} style={styles.progressItem}>
            <View style={[styles.progressDot, step > i && styles.progressDotActive]} >
              <Text style={[styles.progressDotText, step > i && styles.progressDotTextActive]}>
                {step > i + 1 ? '✓' : i + 1}
              </Text>
            </View>
            <Text style={[styles.progressLabel, step === i + 1 && styles.progressLabelActive]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Step 1: Select Service */}
      {step === 1 && (
        <>
          <SectionHeader title="Choose a Service" />
          {services.map((svc) => (
            <ServiceCard key={svc.id} service={svc} onPress={() => handleSelectService(svc)} />
          ))}
        </>
      )}

      {/* Step 2: Select Staff */}
      {step === 2 && (
        <>
          <SectionHeader title="Choose a Barber / Stylist" />
          {selectedService ? (
            <View style={styles.selectedBanner}>
              <Text style={styles.selectedLabel}>Selected Service</Text>
              <Text style={styles.selectedValue}>{selectedService.name} — ₱{selectedService.price}</Text>
            </View>
          ) : null}
          {staffList.map((stf) => (
            <StaffCard
              key={stf.id}
              staff={stf}
              selected={selectedStaff?.id === stf.id}
              onPress={() => handleSelectStaff(stf)}
            />
          ))}
          <Button
            label="Back to Services"
            icon="arrow-back"
            variant="outline"
            onPress={() => setStep(1)}
            style={styles.backBtn}
          />
        </>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <>
          <SectionHeader title="Review & Confirm" />
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service</Text>
              <Text style={styles.summaryValue}>{selectedService?.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Category</Text>
              <Text style={styles.summaryValue}>{selectedService?.category}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Price</Text>
              <Text style={styles.summaryValue}>₱{selectedService?.price}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Est. Duration</Text>
              <Text style={styles.summaryValue}>{selectedService?.estimatedDuration || selectedService?.estimated_duration} min</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Barber / Stylist</Text>
              <Text style={styles.summaryValue}>{selectedStaff?.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Specialization</Text>
              <Text style={styles.summaryValue}>{selectedStaff?.specialization}</Text>
            </View>
          </View>

          <Button
            label={loading ? 'Joining Queue...' : 'Confirm & Join Queue'}
            icon="checkmark-circle-outline"
            onPress={handleConfirm}
            loading={loading}
            style={styles.confirmBtn}
          />
          <Button
            label="Back to Staff Selection"
            icon="arrow-back"
            variant="outline"
            onPress={() => setStep(2)}
            style={styles.backBtn}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xl * 2 },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  progressItem: { alignItems: 'center', marginHorizontal: theme.spacing.lg },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  progressDotActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  progressDotText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  progressDotTextActive: { color: theme.colors.white },
  progressLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  progressLabelActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  selectedBanner: {
    backgroundColor: theme.colors.primaryLight + '10',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primaryLight,
  },
  selectedLabel: { ...theme.typography.caption, color: theme.colors.textSecondary },
  selectedValue: { ...theme.typography.body, color: theme.colors.textPrimary, fontWeight: '600' },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  summaryLabel: { ...theme.typography.body, color: theme.colors.textSecondary },
  summaryValue: { ...theme.typography.body, color: theme.colors.textPrimary, fontWeight: '600' },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  confirmBtn: { marginBottom: theme.spacing.sm },
  backBtn: { marginBottom: theme.spacing.sm },
});
