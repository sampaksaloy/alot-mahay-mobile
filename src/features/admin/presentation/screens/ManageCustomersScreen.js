import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { manageCustomerUseCase } from '../../domain/usecases/manageCustomerUseCase';
import { theme } from '../../../../core/theme/theme';
import Button from '../../../../components/Button';
import SearchInput from '../../../../components/SearchInput';
import EmptyState from '../../../../components/EmptyState';

export default function ManageCustomersScreen() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const list = await manageCustomerUseCase.list();
      setCustomers(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = search.trim()
    ? customers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      )
    : customers;

  const handleToggleStatus = async (customer) => {
    try {
      await manageCustomerUseCase.toggleStatus(customer.id);
      loadData();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <SearchInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search customers..."
        style={styles.search}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name?.charAt(0)?.toUpperCase()}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <Text style={styles.phone}>{item.phone}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: item.status === 'ACTIVE' ? theme.colors.success + '20' : theme.colors.danger + '20' },
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: item.status === 'ACTIVE' ? theme.colors.success : theme.colors.danger },
                ]}>
                  {item.status}
                </Text>
              </View>
            </View>
            <Button
              label={item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              variant={item.status === 'ACTIVE' ? 'outline' : 'primary'}
              onPress={() => handleToggleStatus(item)}
              style={styles.toggleBtn}
            />
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="person-outline" title="No customers" message="No customer accounts found" />}
        contentContainerStyle={filtered.length === 0 ? styles.emptyList : styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  search: { marginHorizontal: theme.spacing.lg, marginTop: theme.spacing.md },
  listContent: { padding: theme.spacing.lg },
  emptyList: { flexGrow: 1, padding: theme.spacing.lg },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: { color: theme.colors.white, fontWeight: '700', fontSize: 18 },
  cardInfo: { flex: 1 },
  name: { ...theme.typography.body, fontWeight: '700', color: theme.colors.textPrimary },
  email: { ...theme.typography.caption, color: theme.colors.textSecondary },
  phone: { ...theme.typography.caption, color: theme.colors.textMuted },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  toggleBtn: { marginTop: theme.spacing.md },
});
