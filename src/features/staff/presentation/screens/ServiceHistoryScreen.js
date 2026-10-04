import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme/theme';

// TODO: fetch completed service_records para ani nga staff
export default function ServiceHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={theme.typography.h2}>Service History</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: theme.spacing.lg } });
