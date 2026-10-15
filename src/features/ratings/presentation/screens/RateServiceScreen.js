import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { submitRatingUseCase } from '../../domain/usecases/submitRatingUseCase';
import { theme } from '../../../../core/theme/theme';
import { mockDataStore } from '../../../../core/data/mockDataStore';
import Button from '../../../../components/Button';

export default function RateServiceScreen({ route, navigation }) {
  const { queueId } = route.params ?? {};
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [alreadyRated, setAlreadyRated] = useState(false);

  useEffect(() => {
    if (queueId) {
      const t = mockDataStore.getQueueById(queueId);
      setTicket(t);
      const existing = mockDataStore.getRatingByQueueId(queueId);
      if (existing) setAlreadyRated(true);
    }
  }, [queueId]);

  const submit = async () => {
    if (rating < 1) {
      Alert.alert('Selection Required', 'Please select a star rating (1-5 stars)');
      return;
    }
    setLoading(true);
    try {
      await submitRatingUseCase({ queueId, rating, feedback });
      Alert.alert('Feedback Received', 'Thank you for rating our salon service!', [
        { text: 'Done', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (alreadyRated) {
    const existingRating = mockDataStore.getRatingByQueueId(queueId);
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.ratedCard}>
          <View style={styles.ratedIconCircle}>
            <Ionicons name="checkmark-circle" size={48} color={theme.colors.success} />
          </View>
          <Text style={styles.ratedTitle}>Already Rated</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Ionicons
                key={n}
                name={n <= (existingRating?.rating || 0) ? 'star' : 'star-outline'}
                size={26}
                color={n <= (existingRating?.rating || 0) ? '#EAB308' : '#CBD5E1'}
                style={{ marginHorizontal: 3 }}
              />
            ))}
          </View>
          {existingRating?.feedback ? (
            <Text style={styles.ratedFeedback}>"{existingRating.feedback}"</Text>
          ) : null}
        </View>
        <Button label="Go Back" variant="outline" onPress={() => navigation.goBack()} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {ticket ? (
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceLabel}>Service</Text>
          <Text style={styles.serviceName}>{ticket.service_name}</Text>
          <Text style={styles.staffName}>with {ticket.staff_name}</Text>
        </View>
      ) : null}

      <Text style={styles.rateLabel}>How was your experience?</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity
            key={n}
            onPress={() => setRating(n)}
            activeOpacity={0.7}
            style={{ padding: 6 }}
            accessibilityRole="button"
            accessibilityLabel={`${n} star${n === 1 ? '' : 's'}`}
          >
            <Ionicons
              name={n <= rating ? 'star' : 'star-outline'}
              size={36}
              color={n <= rating ? '#EAB308' : '#CBD5E1'}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ratingText}>
        {rating === 0 ? 'Tap a star' :
         rating === 1 ? 'Poor' :
         rating === 2 ? 'Fair' :
         rating === 3 ? 'Good' :
         rating === 4 ? 'Very Good' : 'Excellent!'}
      </Text>

      <Text style={styles.feedbackLabel}>Feedback (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Tell us about your experience..."
        placeholderTextColor={theme.colors.textMuted}
        value={feedback}
        onChangeText={setFeedback}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Button
        label={loading ? 'Submitting...' : 'Submit Rating'}
        onPress={submit}
        loading={loading}
        style={styles.submitBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xl * 2 },
  serviceInfo: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  serviceLabel: { ...theme.typography.caption, color: theme.colors.textSecondary },
  serviceName: { ...theme.typography.h3, color: theme.colors.textPrimary, marginTop: 4 },
  staffName: { ...theme.typography.body, color: theme.colors.textSecondary, marginTop: 2 },
  rateLabel: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  star: {
    fontSize: 32,
    color: theme.colors.border,
    marginHorizontal: 4,
  },
  starLarge: { fontSize: 40 },
  starActive: { color: theme.colors.secondary },
  ratingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    fontWeight: '600',
  },
  feedbackLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    minHeight: 100,
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  submitBtn: {},
  ratedCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  ratedIcon: { fontSize: 48, marginBottom: theme.spacing.md },
  ratedTitle: { ...theme.typography.h3, color: theme.colors.textPrimary, marginBottom: theme.spacing.md },
  ratedFeedback: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});
