import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme/theme';

// TODO: CRUD sa staff schedules (start_time/end_time per staff per date)
export default function ManageSchedulesScreen() {
  return (
    <View style={styles.container}>
      <Text style={theme.typography.h2}>Manage Schedules</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: theme.spacing.lg } });
