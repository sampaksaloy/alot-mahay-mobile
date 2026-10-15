import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useServices } from '../hooks/useServices';
import { theme } from '../../../../core/theme/theme';
import ServiceCard from '../../../../components/ServiceCard';
import SearchInput from '../../../../components/SearchInput';
import FilterChips from '../../../../components/FilterChips';
import LoadingIndicator from '../../../../components/LoadingIndicator';
import EmptyState from '../../../../components/EmptyState';

export default function ServiceListScreen({ navigation }) {
  const { services, loading, refresh } = useServices();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);

  const categories = useMemo(() => {
    const cats = [...new Set(services.map((s) => s.category).filter(Boolean))];
    return ['All', ...cats];
  }, [services]);

  const filtered = useMemo(() => {
    let list = services;
    if (category && category !== 'All') {
      list = list.filter((s) => s.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q) ||
          (s.category || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [services, search, category]);

  if (loading && services.length === 0) return <LoadingIndicator />;

  const handleSelectService = (svc) => {
    try {
      navigation.getParent()?.navigate('JoinQueue', { serviceId: svc.id });
    } catch {
      navigation.navigate('JoinQueue', { serviceId: svc.id });
    }
  };

  return (
    <View style={styles.container}>
      <SearchInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search services..."
      />
      <FilterChips
        options={categories}
        selected={category}
        onSelect={(c) => setCategory(c === 'All' ? null : c)}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={refresh}
        renderItem={({ item }) => (
          <ServiceCard
            service={item}
            onPress={() => handleSelectService(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="cut-outline"
            title="No services found"
            message={search ? 'Try a different search term' : 'No services available right now'}
          />
        }
        contentContainerStyle={filtered.length === 0 ? styles.emptyList : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  emptyList: { flexGrow: 1 },
});
