import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { manageCustomerUseCase } from '../../domain/usecases/manageCustomerUseCase';
import { theme } from '../../../../core/theme/theme';

export default function ManageCustomersScreen() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    manageCustomerUseCase.list().then(setCustomers);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={theme.typography.h2}>Manage Customers</Text>
      <FlatList
        data={customers}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.name}</Text>
            <Text>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
});
