import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme/theme';

export default function AdminDashboardScreen({ navigation }) {
  const menu = [
    { label: 'Manage Services', route: 'ManageServices' },
    { label: 'Manage Staff', route: 'ManageStaff' },
    { label: 'Manage Customers', route: 'ManageCustomers' },
    { label: 'Manage Schedules', route: 'ManageSchedules' },
    { label: 'Monitor Queue', route: 'MonitorQueue' },
    { label: 'Reports & Analytics', route: 'Reports' },
  ];

  return (
    <View style={styles.container}>
      <Text style={theme.typography.h1}>Admin Dashboard</Text>
      {menu.map((item) => (
        <TouchableOpacity key={item.route} style={styles.item} onPress={() => navigation.navigate(item.route)}>
          <Text style={styles.itemText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  item: { paddingVertical: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  itemText: { fontSize: 16 },
});
