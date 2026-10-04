import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useServices } from '../../../services/presentation/hooks/useServices';
import { theme } from '../../../../core/theme/theme';

// TODO: dugangan og Add/Edit/Delete form nga naka-connect sa
// features/services/domain/usecases/manageServiceUseCase.js
export default function ManageServicesScreen() {
  const { services, loading } = useServices();

  return (
    <View style={styles.container}>
      <Text style={theme.typography.h2}>Manage Services</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.name}</Text>
            <Text>₱{item.price}</Text>
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
