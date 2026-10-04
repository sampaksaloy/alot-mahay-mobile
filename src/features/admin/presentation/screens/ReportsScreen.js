import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getReportsUseCase } from '../../domain/usecases/getReportsUseCase';
import { theme } from '../../../../core/theme/theme';

export default function ReportsScreen() {
  const [daily, setDaily] = useState(null);

  useEffect(() => {
    getReportsUseCase.daily().then(setDaily);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={theme.typography.h2}>Reports & Analytics</Text>
      <Text style={styles.hint}>
        {daily ? JSON.stringify(daily) : 'Naglo-load...'}
      </Text>
      {/* TODO: charts/graphs para sa daily/service/staff/queue reports */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  hint: { marginTop: theme.spacing.md, color: theme.colors.textSecondary },
});
