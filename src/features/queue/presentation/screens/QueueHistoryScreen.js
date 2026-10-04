import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme/theme';

// TODO: fetch history gikan sa /queues/my (completed/cancelled) o service_records
export default function QueueHistoryScreen() {
  const data = [];
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <Text>{item.serviceName}</Text>}
        ListEmptyComponent={<Text style={styles.empty}>Walay history pa.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  empty: { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.xl },
});
