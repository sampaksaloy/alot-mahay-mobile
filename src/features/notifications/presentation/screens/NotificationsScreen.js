import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getNotificationsUseCase } from '../../domain/usecases/getNotificationsUseCase';
import { theme } from '../../../../core/theme/theme';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotificationsUseCase().then(setNotifications);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={theme.typography.h2}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Walay notification.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  item: { paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  title: { fontWeight: '600' },
  message: { color: theme.colors.textSecondary },
  empty: { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.xl },
});
