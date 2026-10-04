import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme/theme';

export default function StaffDashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={theme.typography.h1}>Staff Dashboard</Text>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('TodayQueue')}>
        <Text style={styles.itemText}>Today's Queue</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ServiceHistory')}>
        <Text style={styles.itemText}>Service History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  item: { paddingVertical: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  itemText: { fontSize: 16 },
});
