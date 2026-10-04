import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useServices } from '../hooks/useServices';
import { theme } from '../../../../core/theme/theme';

export default function ServiceListScreen({ navigation }) {
  const { services, loading } = useServices();

  return (
    <View style={styles.container}>
      <Text style={theme.typography.h2}>Services</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('JoinQueue', { serviceId: item.id })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>₱{item.price} · {item.estimatedDuration} min</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Walay service.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  card: { padding: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, marginTop: theme.spacing.sm },
  name: { fontWeight: '600', fontSize: 16 },
  meta: { color: theme.colors.textSecondary, marginTop: 4 },
  empty: { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.xl },
});
