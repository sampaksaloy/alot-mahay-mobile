import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { submitRatingUseCase } from '../../domain/usecases/submitRatingUseCase';
import { theme } from '../../../../core/theme/theme';

export default function RateServiceScreen({ route, navigation }) {
  const { queueId } = route.params ?? {};
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const submit = async () => {
    try {
      await submitRatingUseCase({ queueId, rating, feedback });
      Alert.alert('', 'Salamat sa imong rating!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={theme.typography.h2}>Rate Service</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => setRating(n)}>
            <Text style={[styles.star, n <= rating && styles.starActive]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Feedback (optional)"
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  stars: { flexDirection: 'row', marginVertical: theme.spacing.md },
  star: { fontSize: 32, color: theme.colors.border, marginRight: 4 },
  starActive: { color: theme.colors.secondary },
  input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.sm, padding: theme.spacing.md, minHeight: 80 },
  button: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.sm, paddingVertical: 14, alignItems: 'center', marginTop: theme.spacing.md },
  buttonText: { color: theme.colors.white, fontWeight: '600' },
});
