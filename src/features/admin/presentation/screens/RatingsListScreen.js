import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme/theme';
import { mockDataStore } from '../../../../core/data/mockDataStore';
import EmptyState from '../../../../components/EmptyState';

export default function RatingsListScreen() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    setRatings(mockDataStore.getRatings());
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : '—';

  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{avgRating}</Text>
          <Text style={styles.summaryLabel}>Avg Rating</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{ratings.length}</Text>
          <Text style={styles.summaryLabel}>Total Reviews</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{ratings.filter((r) => r.rating >= 4).length}</Text>
          <Text style={styles.summaryLabel}>4+ Stars</Text>
        </View>
      </View>

      <FlatList
        data={ratings}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{item.customer_name}</Text>
                <Text style={styles.serviceName}>{item.service_name} · {item.staff_name}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#92400E" style={{ marginRight: 3 }} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
            {item.feedback ? (
              <Text style={styles.feedback}>"{item.feedback}"</Text>
            ) : null}
            <Text style={styles.date}>{formatDate(item.created_at)}</Text>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="star-outline" title="No ratings yet" message="Customer ratings will appear here" />}
        contentContainerStyle={ratings.length === 0 ? styles.emptyList : styles.listContent}
      />
    </View>
  );
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const now = new Date();
  const diffMin = Math.round((now - d) / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffMin < 1440) return `${Math.round(diffMin / 60)}h ago`;
  return d.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: 24, fontWeight: '800', color: theme.colors.primary },
  summaryLabel: { ...theme.typography.caption, color: theme.colors.textSecondary, marginTop: 2 },
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  customerInfo: { flex: 1, marginRight: theme.spacing.sm },
  customerName: { ...theme.typography.body, fontWeight: '700', color: theme.colors.textPrimary },
  serviceName: { ...theme.typography.caption, color: theme.colors.textSecondary },
  ratingBadge: {
    backgroundColor: theme.colors.secondary + '25',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingText: { color: theme.colors.secondaryDark, fontWeight: '700', fontSize: 13 },
  feedback: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: theme.spacing.sm,
    lineHeight: 20,
  },
  date: { ...theme.typography.caption, color: theme.colors.textMuted, marginTop: theme.spacing.sm },
});
