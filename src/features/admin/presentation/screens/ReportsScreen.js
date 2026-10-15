import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { getReportsUseCase } from '../../domain/usecases/getReportsUseCase';
import { theme } from '../../../../core/theme/theme';
import StatCard from '../../../../components/StatCard';
import SectionHeader from '../../../../components/SectionHeader';
import LoadingIndicator from '../../../../components/LoadingIndicator';

export default function ReportsScreen() {
  const [daily, setDaily] = useState(null);
  const [serviceReport, setServiceReport] = useState([]);
  const [staffReport, setStaffReport] = useState([]);
  const [queueReport, setQueueReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [d, s, st, q] = await Promise.all([
        getReportsUseCase.daily(),
        getReportsUseCase.byService(),
        getReportsUseCase.byStaff(),
        getReportsUseCase.queue(),
      ]);
      setDaily(d);
      setServiceReport(s);
      setStaffReport(st);
      setQueueReport(q);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <LoadingIndicator />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
    >
      {/* Overview Stats */}
      {daily ? (
        <>
          <SectionHeader title="Today's Overview" />
          <View style={styles.statsRow}>
            <StatCard icon="people-outline" label="Customers" value={daily.totalCustomers} style={styles.stat} />
            <StatCard icon="cut-outline" label="Staff" value={daily.activeStaff} style={styles.stat} />
            <StatCard icon="checkmark-circle-outline" label="Completed" value={daily.completedToday} style={styles.stat} />
          </View>
          <View style={styles.statsRow}>
            <StatCard icon="time-outline" label="Waiting" value={daily.customersWaiting} style={styles.stat} />
            <StatCard icon="list-outline" label="Active" value={daily.activeQueues} style={styles.stat} />
            <StatCard icon="timer-outline" label="Avg Dur." value={`${daily.avgDuration}m`} style={styles.stat} />
          </View>
        </>
      ) : null}

      {/* Queue Stats */}
      {queueReport ? (
        <>
          <SectionHeader title="Queue Performance" />
          <View style={styles.reportCard}>
            <ReportRow label="Total Today" value={queueReport.totalToday} />
            <ReportRow label="Avg. Wait Time" value={`${queueReport.avgWaitTime} min`} highlight />
          </View>
        </>
      ) : null}

      {/* Service Report */}
      {serviceReport.length > 0 ? (
        <>
          <SectionHeader title="Services Report" />
          <View style={styles.reportCard}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCol, styles.tableHeaderText, { flex: 2 }]}>Service</Text>
              <Text style={[styles.tableCol, styles.tableHeaderText]}>Total</Text>
              <Text style={[styles.tableCol, styles.tableHeaderText]}>Done</Text>
              <Text style={[styles.tableCol, styles.tableHeaderText]}>Revenue</Text>
            </View>
            {serviceReport.map((svc) => (
              <View key={svc.name} style={styles.tableRow}>
                <Text style={[styles.tableCol, { flex: 2 }]}>{svc.name}</Text>
                <Text style={styles.tableCol}>{svc.total}</Text>
                <Text style={styles.tableCol}>{svc.completed}</Text>
                <Text style={[styles.tableCol, styles.revenue]}>₱{svc.revenue}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      {/* Staff Report */}
      {staffReport.length > 0 ? (
        <>
          <SectionHeader title="Staff Performance" />
          <View style={styles.reportCard}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCol, styles.tableHeaderText, { flex: 2 }]}>Staff</Text>
              <Text style={[styles.tableCol, styles.tableHeaderText]}>Total</Text>
              <Text style={[styles.tableCol, styles.tableHeaderText]}>Done</Text>
              <Text style={[styles.tableCol, styles.tableHeaderText]}>Avg.</Text>
            </View>
            {staffReport.map((stf) => (
              <View key={stf.name} style={styles.tableRow}>
                <Text style={[styles.tableCol, { flex: 2 }]}>{stf.name}</Text>
                <Text style={styles.tableCol}>{stf.total}</Text>
                <Text style={styles.tableCol}>{stf.completed}</Text>
                <Text style={[styles.tableCol, styles.highlight]}>{stf.avgDuration}m</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

function ReportRow({ label, value, highlight }) {
  return (
    <View style={reportRowStyles.row}>
      <Text style={reportRowStyles.label}>{label}</Text>
      <Text style={[reportRowStyles.value, highlight && reportRowStyles.highlight]}>{value}</Text>
    </View>
  );
}

const reportRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  label: { ...theme.typography.body, color: theme.colors.textSecondary },
  value: { ...theme.typography.body, color: theme.colors.textPrimary, fontWeight: '600' },
  highlight: { color: theme.colors.primaryLight },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xl * 2 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  stat: { flex: 1, marginHorizontal: 3 },
  reportCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  tableHeaderText: { fontWeight: '700', color: theme.colors.primary, fontSize: 12 },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tableCol: {
    flex: 1,
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
  },
  revenue: { color: theme.colors.secondaryDark, fontWeight: '700' },
  highlight: { color: theme.colors.primaryLight, fontWeight: '600' },
});
